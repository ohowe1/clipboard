import PasteToRegister from "./components/PasteToRegister";
import { PageProps } from "./page_props";
import Template from "./Template";

function PasteToRegisterPage({ register, pageProps }: { register: string, pageProps: PageProps }) {
  return (
    <Template pageProps={pageProps}>
      <h1>Paste to Register /{register}</h1>
      <a href={"/paste"}>Back to Paste Page</a>

      <PasteToRegister registerAppend={"/" + register} />
    </Template>
  )
}

export default PasteToRegisterPage;
