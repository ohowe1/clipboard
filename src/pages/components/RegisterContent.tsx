import { ClipboardContent } from "../../models/ClipboardItem";

function TextContent({
  textContent,
}: {
  textContent: Extract<ClipboardContent, { type: "text" }>;
}) {
  return (
    <div
      style={{
        maxHeight: "200px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {textContent.text}
    </div>
  );
}

function URLContent({
  urlContent,
}: {
  urlContent: Extract<ClipboardContent, { type: "url" }>;
}) {
  return (
    <div>
      <strong>URL: </strong>
      <a href={urlContent.url} target="_blank" rel="noopener noreferrer">
        {urlContent.url}
      </a>
    </div>
  );
}

function FileContent({
  fileContent,
  register,
  fileNumber,
}: {
  fileContent: Extract<ClipboardContent, { type: "file" }>;
  register: string;
  fileNumber: number;
}) {
  return (
    <div>
      <strong>File: </strong>
      <a
        href={`/paste/get_file/${register}/${fileNumber}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {fileContent.file_name}
      </a>
    </div>
  );
}

function RegisterContent({
  registerContent,
  register,
  fileNumber = -1,
}: {
  registerContent?: ClipboardContent;
  register: string;
  fileNumber?: number;
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "12px",
        background: "#fafbfc",
        marginBottom: "1em",
      }}
    >
      {registerContent ? (
        <>
          {registerContent.type === "text" && (
            <TextContent textContent={registerContent} />
          )}
          {registerContent.type === "url" && (
            <URLContent urlContent={registerContent} />
          )}
          {registerContent.type === "file" && (
            <FileContent
              fileContent={registerContent}
              register={register}
              fileNumber={fileNumber}
            />
          )}
        </>
      ) : (
        <em>No content in this register.</em>
      )}
    </div>
  );
}

export default RegisterContent;
