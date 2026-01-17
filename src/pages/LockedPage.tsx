import { PageProps } from "./page_props";
import Template from "./Template";

export default function LockedPage({ pageProps }: { pageProps: PageProps }) {
  return (
    <Template pageProps={pageProps}>
      <h1>The clipboard is locked</h1>
      <a href="/secure/lock">Unlock Page</a>
    </Template>
  );
}
