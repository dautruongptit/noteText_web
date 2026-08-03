import type { CSSProperties } from "react";

// Backend (DriveController.callback(), SEC-09) redirect trinh duyet VE day
// sau khi hoan tat (thanh cong hoac that bai) luong xin quyen Drive, kem
// query param ?connected=true/false&reason=... Khong dung router library
// (repo khong co react-router) - App.tsx tu kiem tra window.location.pathname
// va render component nay thay vi workspace chinh khi khop "/drive/callback".
export function DriveCallbackScreen() {
  const params = new URLSearchParams(window.location.search);
  const connected = params.get("connected") === "true";
  const reason = params.get("reason");

  const reasonMessages: Record<string, string> = {
    access_denied: "Bạn đã từ chối cấp quyền truy cập Google Drive.",
    missing_params: "Thiếu thông tin cần thiết từ Google, vui lòng thử lại.",
    invalid_state: "Phiên kết nối đã hết hạn hoặc không hợp lệ, vui lòng thử lại.",
    exchange_failed: "Không thể xác thực với Google, vui lòng thử lại.",
    unknown_error: "Đã có lỗi không xác định xảy ra.",
  };

  const goHome = () => {
    // Dieu huong ve trang goc BANG RELOAD THAT (khong phai React state) -
    // dam bao useDriveSync.ts o App.tsx tu tai lai trang thai ket noi that
    // qua driveApi.status() ngay khi workspace chinh mount lai.
    window.location.href = "/";
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ ...styles.mark, background: connected ? "#1f7a3f" : "#7a2f1f" }}>
          {connected ? "✓" : "⚠"}
        </div>
        <h1 style={styles.title}>{connected ? "Đã kết nối Google Drive" : "Kết nối thất bại"}</h1>
        <p style={styles.subtitle}>
          {connected
            ? "Ghi chú của bạn sẽ được tự động sao lưu lên Google Drive từ bây giờ."
            : (reason && reasonMessages[reason]) || "Không thể hoàn tất kết nối, vui lòng thử lại."}
        </p>
        <button style={styles.button} onClick={goHome}>Về Noted</button>
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
    width: 340, textAlign: "center", padding: "40px 32px", borderRadius: 12,
    background: "#141416", border: "1px solid #26262a",
  },
  mark: {
    width: 44, height: 44, margin: "0 auto 16px", borderRadius: 10, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20,
  },
  title: { color: "#f2f2f3", fontSize: 20, margin: "0 0 8px" },
  subtitle: { color: "#9a9aa0", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 },
  button: {
    width: "100%", padding: "10px 16px", borderRadius: 8, border: "none",
    background: "#f2f2f3", color: "#0b0b0c", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
};
