import { redirect  } from "@remix-run/cloudflare";
import type {LoaderFunctionArgs} from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase/supabase.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/user";
  const { client, headers } = createSupabaseServerClient(request, context);

  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    }
  }

  // return the user to an error page with instructions
  return redirect("/error", { headers });
}