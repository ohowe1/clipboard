import { PageProps } from "./page_props";
import Template from "./Template";

function EmptyClipboardPage({ pageProps }: { pageProps: PageProps }) {
  return (
    <Template pageProps={pageProps}>
      <h1>This clipboard register is empty</h1>
    </Template>
  );
}

export default EmptyClipboardPage;
