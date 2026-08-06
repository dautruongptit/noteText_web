import { api } from "../utils/apiClient";
import { apiUrl } from "../config/env";
import { getAccessToken } from "../utils/authToken";
import type { DriveStatus } from "./types";

export const driveApi = {
  /** GET /api/drive/status - kiem tra user da ket noi Google Drive chua */
  status: (): Promise<DriveStatus> => api.get<DriveStatus>("/api/drive/status"),

  /**
   * GET /api/drive/connect - lay URL de bat dau luong xin quyen Drive (scope
   * "drive.file" + "access_type=offline", KHAC voi luong dang nhap thong
   * thuong o authApi.loginWithGoogle - xem DriveController, SEC-03).
   *
   * QUAN TRONG: ham nay KHONG tu dong redirect - no chi TRA VE authUrl, vi
   * hanh dong "ket noi Drive" nen la 1 lua chon RO RANG cua nguoi dung (vd
   * bam nut "Ket noi Google Drive" trong Settings), khong nen tu dong xay ra.
   * Component goi ham nay se tu quyet dinh: window.location.href = authUrl.
   */
  getConnectUrl: (): Promise<{ authUrl: string }> => api.get<{ authUrl: string }>("/api/drive/connect"),

  /**
   * POST /api/drive/sync-all - "Flush" thu cong: day NGAY LAP TUC toan bo
   * note dang dirty=true cua user hien tai, BO QUA nguong debounce 30s
   * (xem DriveSyncServiceImpl.flushDirtyNotes, "Debounce Sync"). Dung khi
   * nguoi dung bam nut "Dong bo ngay".
   */
  syncAll: (): Promise<{ message: string }> => api.post<{ message: string }>("/api/drive/sync-all"),

  /** DELETE /api/drive/disconnect - ngat ket noi Drive, xoa refresh token da luu */
  disconnect: (): Promise<{ message: string }> => api.delete<{ message: string }>("/api/drive/disconnect"),

  /**
   * Flush dong bo luc DONG TAB/ROI TRANG - kenh thu 3 trong "Debounce Sync"
   * (2 kenh con lai: debounce 30s tu dong o backend, va bam nut "Dong bo
   * ngay" da co o syncAll() phia tren).
   *
   * KHONG dung qua apiClient.ts (api.post) nhu binh thuong vi 2 ly do:
   *  1. apiClient.ts co logic tu dong RETRY khi gap 401 (goi /api/auth/refresh
   *     roi thu lai) - qua cham va khong can thiet luc trang sap dong, co the
   *     KHONG BAO GIO hoan tat truoc khi trinh duyet huy request.
   *  2. Can `keepalive: true` (thuoc tinh cua fetch API) de trinh duyet dam
   *     bao GUI DUOC request nay di ngay ca khi trang da unload xong - day
   *     la ly do KHONG dung navigator.sendBeacon(): sendBeacon dang tin cay
   *     hon nhung KHONG cho phep gan header Authorization tuy y, trong khi
   *     fetch(..., {keepalive:true}) cho phep day du header nhu fetch thuong,
   *     duoc cac trinh duyet hien dai (Chrome/Firefox/Safari) ho tro tot.
   *
   * Goi "fire-and-forget" - KHONG await ket qua (trang co the da dong truoc
   * khi response ve toi), chi can dam bao request DA DUOC GUI DI.
   */
  flushOnUnload: (): void => {
    const token = getAccessToken();
    if (!token) return; // chua dang nhap (Local Mode, SEC-16) - khong co gi de flush len Drive

    fetch(apiUrl("/api/drive/sync-all"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      keepalive: true,
    }).catch(() => {
      // Khong the lam gi them luc trang dang dong - neu that bai, debounce
      // job dinh ky (30s) o backend se tu bat lai note dirty nay o lan sau.
    });
  },
};
