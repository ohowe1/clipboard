import { PropsWithChildren } from "hono/jsx";

export default function Template({ children }: PropsWithChildren) {
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
          <nav style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px"}}>
            <a href="/">Copy</a>
            <a href="/secure/lock">Lock Page</a>
            <a href="/paste">Paste Page</a>
          </nav>
          {children}
        </body>
      </html>
    </>
  );
}
