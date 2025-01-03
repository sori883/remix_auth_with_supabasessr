import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { getUser, signOut } from "~/supabase/auth.supabase.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getUser(request, context);
  return { user };
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const data =  await signOut(request, context);
  return redirect(data.data.url, { headers: data.headers });
};

export default function SignIn() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      { data.user ? 
        <>
          <h1>ログイン済みです！</h1>
          <h2>ログアウトボタン</h2>
          <Form method="post">
            <button type="submit">Sign Out</button>
          </Form>
        </>
        : <h1>未ログインです。。</h1> 
      }
    </>
  );  
}