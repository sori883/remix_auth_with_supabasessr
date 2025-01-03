import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

import type { AppLoadContext } from "@remix-run/cloudflare";

/**
 * 参考：https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=remix&queryGroups=package-manager&package-manager=pnpm&queryGroups=environment&environment=remix-component#create-a-client
**/

export function createSupabaseServerClient(request: Request, c:AppLoadContext) {
  const headers = new Headers();

  const client = createServerClient(
      c.cloudflare.env.SUPABASE_URL,
      c.cloudflare.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            const { name, value, options } = cookie;
            headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
            );
          }
        },
      },
      cookieOptions: {
        httpOnly: true,
        secure: true,
      },
  });

  return { 
    client,
    headers,
  };
}