
import { PageProps } from "./page_props";
import Template from "./Template";

export default function Login({ pageProps, message }: { pageProps: PageProps, message?: string }) {
  return (
    <Template pageProps={pageProps}>
      <h1>Login</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form method="post" action="/login">
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </Template>
  );
}
