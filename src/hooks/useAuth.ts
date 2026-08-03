import { useCallback, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import type { CurrentUser } from "../api/types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

// SEC-10: cong chan truy cap - App.tsx chi render workspace chinh khi da xac
// thuc THAT SU (khong chi dua vao "co token trong memory hay khong").
//
// Vi sao goi authApi.me() ngay ca khi KHONG co access token trong memory:
// nguoi dung co the vua mo lai trinh duyet sau khi da dang nhap tu truoc -
// luc nay access token (luu trong memory, xem authToken.ts) da mat theo vong
// doi trang, nhung cookie httpOnly "refresh_token" (SEC-06) van con hieu luc.
// Goi me() se nhan 401 luc dau, apiClient.ts TU DONG goi /api/auth/refresh
// bang cookie do, thanh cong thi retry lai me() va co ket qua - nguoi dung
// KHONG can dang nhap lai moi lan mo trinh duyet, dung nhu thiet ke ban dau.
export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<CurrentUser | null>(null);

  const checkAuth = useCallback(async () => {
    setStatus("checking");
    try {
      const me = await authApi.me();
      setUser(me);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return { status, user, isAuthenticated: status === "authenticated", checkAuth, logout };
}
