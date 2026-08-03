import type { CSSProperties } from "react";
import { authApi } from "../../api/authApi";

// Dung inline style thay vi them class moi vao index.css - tranh phai doc/
// doan lai toan bo file CSS hien co cua repo (rui ro dam vao selector da
// dung o noi khac). Neu muon chuyen sang class rieng sau nay, chi can thay
// the phan style={{...}} bang className tuong ung.
export function LoginScreen() {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.mark}>N</div>
        <h1 style={styles.title}>Noted</h1>
        <p style={styles.subtitle}>Không gian ghi chú riêng tư, đồng bộ trên mọi thiết bị.</p>
        <button style={styles.button} onClick={() => authApi.loginWithGoogle()}>
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0b0b0c", fontFamily: "inherit",
  },
  card: {
    width: 320, textAlign: "center", padding: "40px 32px", borderRadius: 12,
    background: "#141416", border: "1px solid #26262a",
  },
  mark: {
    width: 44, height: 44, margin: "0 auto 16px", borderRadius: 10, background: "#fff",
    color: "#0b0b0c", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 20,
  },
  title: { color: "#f2f2f3", fontSize: 20, margin: "0 0 8px" },
  subtitle: { color: "#9a9aa0", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 },
  button: {
    width: "100%", padding: "10px 16px", borderRadius: 8, border: "none",
    background: "#f2f2f3", color: "#0b0b0c", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
};
