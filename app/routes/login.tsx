import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { isUserLoggedIn, signInWithGoogle } from "~/supabase/auth.supabase.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  // 認証済みならuserにリダイレクトする
  if (await isUserLoggedIn(request, context)) {
    return redirect("/user");
  }
  return null;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const data =  await signInWithGoogle(request, context);
  const parsedData = data;

  // リダイレクトURLはdata.urlに格納されている。
  // 自動でリダイレクトはしてくれないので、手動で行う。
  return redirect(parsedData.data.url!, { headers: data.headers });
};

export default function SignIn() {
  return (
    <>
      <Form method="post">
        <button type="submit">Sign In</button>
      </Form>
    </>
  );
}