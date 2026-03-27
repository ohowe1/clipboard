import { ClipboardItem } from "../models/ClipboardItem";
import PasteToRegister from "./components/PasteToRegister";
import RegisterContent from "./components/RegisterContent";
import { PageProps } from "./page_props";
import Template from "./Template";

function HistoryPage({
  pastePage,
  register,
  registerItem,
  pageProps,
}: {
  pastePage: string;
  register: string;
  registerItem?: ClipboardItem;
  pageProps: PageProps;
}) {
  let content;

  if (!registerItem) {
    content = (
      <p>
        <em>No history found for this register.</em>
      </p>
    );
  } else {
    content = (
      <>
        <div style={{ marginBottom: "20px" }}>
          <h3>Current Element</h3>
          <RegisterContent
            registerContent={registerItem.content}
            register={register}
          />
        </div>

        {registerItem.history?.map((content, i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <h3>History {i + 1}</h3>
            <RegisterContent
              registerContent={content}
              register={register}
              fileNumber={i}
            />
          </div>
        ))}
      </>
    );
  }
  return (
    <Template pageProps={pageProps}>
      <h1>History for Register {register}</h1>
      <a href={pastePage}>Back to Register Page</a>

      {content}
    </Template>
  );
}

export default HistoryPage;
