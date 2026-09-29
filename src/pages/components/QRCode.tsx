/**
 * Client-side QR code component using qrcode-generator.
 * Renders a QR code pointing to the copy URL for a given register.
 */
function QRCode({ register }: { register: string }) {
  const containerId = `qr-${register}`;
  // Build the path for the copy URL: "/" for default, "/:register" otherwise
  const copyPath = register === "default" ? "/" : `/${register}`;

  return (
    <div style={{ margin: "0.5em 0" }}>
      <div
        style={{
          fontSize: "0.8em",
          color: "#666",
          marginBottom: "4px",
        }}
      >
        Scan to copy:
      </div>
      <div id={containerId} style={{ maxWidth: "120px" }}></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  var copyPath = ${JSON.stringify(copyPath)};
  var containerId = ${JSON.stringify(containerId)};

  function render() {
    var copyUrl = window.location.origin + copyPath;
    var qr = qrcode(0, 'M');
    qr.addData(copyUrl);
    qr.make();
    var container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = qr.createImgTag(4, 0);
      var img = container.querySelector('img');
      if (img) { img.style.width = '100%'; img.style.height = 'auto'; img.alt = 'QR code for ' + copyUrl; }
      var link = document.createElement('p');
      link.style.fontSize = '0.75em';
      link.style.color = '#999';
      link.style.margin = '2px 0 0';
      link.textContent = copyUrl;
      container.appendChild(link);
    }
  }

  if (typeof qrcode === 'function') {
    render();
  } else {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    s.onload = render;
    document.head.appendChild(s);
  }
})();
`,
        }}
      />
    </div>
  );
}

export default QRCode;
