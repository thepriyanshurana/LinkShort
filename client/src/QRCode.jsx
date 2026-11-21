
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRCode({ url, onBack }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = image;
    link.download = "LinkShort-QR.png";
    link.click();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-icon">↗</div>

        <span className="auth-tag">QR CODE GENERATOR</span>

        <h1>Your QR code.</h1>

        <p>
          Scan this QR code to open your shortened link.
        </p>

        <div
          ref={qrRef}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            display: "inline-block",
            margin: "20px auto"
          }}
        >
          <QRCodeCanvas
            value={url}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        <p style={{ wordBreak: "break-all" }}>
          {url}
        </p>

        <button
          className="auth-button"
          onClick={handleDownload}
        >
          Download QR Code ↓
        </button>

        <div className="auth-switch">
          <span onClick={onBack}>
            ← Back to dashboard
          </span>
        </div>
      </div>
    </div>
  );
}

export default QRCode;
