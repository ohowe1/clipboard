function PasteToRegister({ registerAppend }: { registerAppend: string }) {
  return (
    <>
      <form method="post" action={`/paste/remove${registerAppend}`}>
        <button type="submit">Clear Register</button>
      </form>

      <h1>Paste Text</h1>
      <form method="post" action={`/paste/text${registerAppend}`}>
        <textarea name="text" rows={10} cols={50} placeholder="Enter Text"/>
        <br />
        <button type="submit">Paste to Register</button>
      </form>

      <h1>Paste URL</h1>
      <form method="post" action={`/paste/url${registerAppend}`}>
        <input type="url" name="url" placeholder="Enter URL" />
        <br />
        <button type="submit">Paste URL to Register</button>
      </form>

      <h1>Paste File</h1>
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
