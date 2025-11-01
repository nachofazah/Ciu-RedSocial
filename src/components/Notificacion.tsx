import React, { useState } from "react";

interface Props {
  message: string;
  onClose?: () => void;
}

export default function Notificacion({ message, onClose }: Props) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    background: "rgba(0,0,0,0.2)",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    padding: "18px 22px",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    maxWidth: "90%",
    minWidth: 280,
    textAlign: "center",
  };

  const messageStyle: React.CSSProperties = {
    margin: 0,
    color: "#222",
    fontSize: 16,
    lineHeight: 1.3,
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 12,
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#1976d2",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={cardStyle}>
        <p style={messageStyle}>{message}</p>
        <button style={buttonStyle} onClick={handleClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
