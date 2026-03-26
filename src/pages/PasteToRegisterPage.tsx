import { ClipboardItem } from "../models/ClipboardItem";
import PasteToRegister from "./components/PasteToRegister";
import { PageProps } from "./page_props";
import Template from "./Template";

function PasteToRegisterPage({
  register: registerAppend,
  registerContent,
  pageProps,
}: {
  register: string;
  registerContent?: ClipboardItem;
  pageProps: PageProps;
}) {
  return (
    <Template pageProps={pageProps}>
      <h1>Paste to Register {registerAppend}</h1>
      <a href={"/paste"}>Back to Paste Page</a>

      <PasteToRegister
        registerAppend={registerAppend}
        currentContent={registerContent}
      />
    </Template>
  );
}

export default PasteToRegisterPage;
