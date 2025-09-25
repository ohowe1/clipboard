import Template from "./Template";

function PastePage() {
  return (
    <Template>
      <form method="post" action="/paste/remove">
        <button type="submit">Clear Clipboard</button>
      </form>

      <h1>
        Paste Text
      </h1>
      <form method="post" action="/paste/text">
        <textarea name="text" rows={10} cols={50} />
        <br />
        <button type="submit">Paste to Clipboard</button>
      </form>

      <h1>Paste URL</h1>
      <form method="post" action="/paste/url">
        <input type="url" name="url" placeholder="Enter URL" />
        <br />
        <button type="submit">Paste URL to Clipboard</button>
      </form>

      <h1>Paste File</h1>
      <form method="post" action="/paste/file" encType="multipart/form-data">
        <input type="file" name="file" />
        <br />
        <button type="submit">Paste File to Clipboard</button>
      </form>
    </Template>
  )
}

export default PastePage;
