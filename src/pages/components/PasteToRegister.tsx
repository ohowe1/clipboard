import { ClipboardItem } from "../../models/ClipboardItem";
import RegisterContent from "./RegisterContent";

function PasteToRegister({
  registerAppend,
  currentContent,
}: {
  registerAppend: string;
  currentContent?: ClipboardItem;
}) {
  return (
    <>
      <h2>Current Contents (<a href={`/paste/history${registerAppend}`}>History</a>)</h2>
      <RegisterContent
        registerContent={currentContent?.content}
        registerAppend={registerAppend}
      />

      <form method="post" action={`/paste/remove${registerAppend}`}>
        <button type="submit">Clear Register (and history)</button>
      </form>
      <hr />

      <h2>Paste Text</h2>
      <form method="post" action={`/paste/text${registerAppend}`}>
        <textarea name="text" rows={10} cols={50} placeholder="Enter Text" />
        <br />
        <button type="submit">Paste to Register</button>
      </form>

      <h2>Paste URL</h2>
      <form method="post" action={`/paste/url${registerAppend}`}>
        <input type="url" name="url" placeholder="Enter URL" />
        <br />
        <button type="submit">Paste URL to Register</button>
      </form>

      <h2>Paste File</h2>
      <form
        method="post"
        action={`/paste/file${registerAppend}`}
        encType="multipart/form-data"
      >
        <input type="file" name="file" />
        <br />
        <button type="submit">Paste File to Register</button>
      </form>
    </>
  );
}

export default PasteToRegister;
