import { PropsWithChildren } from "hono/jsx";
import { PageProps } from "./page_props";

export default function Template({
  children,
  pageProps
}: PropsWithChildren<{ pageProps: PageProps }>) {
  return (
    <>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Clipboard</title>
        </head>
        <body>
          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <a href="/">Copy</a>

            {pageProps.loggedIn ? (
              <>
                <a href="/secure/lock">Lock Page</a>
                <a href="/paste">Paste Page</a>
                <form
                  method="post"
                  action="/logout"
                  style={{ display: "contents" }}
                >
                  <button type="submit">Logout</button>
                </form>
              </>
            ) : (
              <a href="/login">Login</a>
            )}
          </nav>
          {children}
        </body>
      </html>
    </>
  );
}
