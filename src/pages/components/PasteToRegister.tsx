import { ClipboardItem } from "../../models/ClipboardItem";

function PasteToRegister({
  registerAppend,
  currentContent,
}: {
  registerAppend: string;
  currentContent?: ClipboardItem;
}) {
  return (
    <>
      <div>
        <h2>Current Contents</h2>
      </div>
      {currentContent ? (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "12px",
            background: "#fafbfc",
            maxWidth: "600px",
            marginBottom: "1em",
          }}
        >
          {currentContent.content.type === "text" && (
            <div>
              <strong>Text:</strong>
              <div
                style={{
                  marginTop: "6px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {currentContent.content.text}
              </div>
            </div>
          )}
          {currentContent.content.type === "url" && (
            <div>
              <strong>URL: </strong>
              <a
                href={currentContent.content.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentContent.content.url}
              </a>
            </div>
          )}
          {currentContent.content.type === "file" && (
            <div>
              <strong>File: </strong>
              <a
                href={registerAppend}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentContent.content.file_name}
              </a>
            </div>
          )}
        </div>
      ) : (
        <p>Register is empty</p>
      )}

      <form method="post" action={`/paste/remove${registerAppend}`}>
        <button type="submit">Clear Register</button>
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
