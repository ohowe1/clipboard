import PasteToRegister from "./components/PasteToRegister";
import { PageProps } from "./page_props";
import Template from "./Template";

function PastePage({
  usedRegisters,
  pageProps,
}: {
  usedRegisters: string[];
  pageProps: PageProps;
}) {
  return (
    <Template pageProps={pageProps}>
      <h1>Paste</h1>

      <form action="/paste/page" method="post">
        <input type="text" name="register" placeholder="Register Name"  minlength={1} required />
        <button type="submit">Go To Paste Page</button>
      </form>

      <h2>Active Registers:</h2>
      <div>
        {usedRegisters.length === 0 ? (
          <span>None</span>
        ) : (
          usedRegisters.map((reg, i) => (
            <span key={reg}>
              {reg === "" ? (
                <em>Default</em>
              ) : (
                <a href={`/paste/${reg}`}>/{reg}</a>
              )}
              {i < usedRegisters.length - 1 ? ", " : ""}
            </span>
          ))
        )}
      </div>

      <br />
      <hr />
      <PasteToRegister registerAppend={""} />
    </Template>
  );
}

export default PastePage;
