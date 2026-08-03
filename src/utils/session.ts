const STORAGE_KEY = "noted-session";

type StoredSession = { tabs: number[]; activeId: number | null };

// SEC-08 THAY DOI QUAN TRONG so voi ban truoc: khong con luu ca "notes"
// (metadata + content) vao localStorage nua - chi luu "tabs" (danh sach id
// dang mo) va "activeId". Ly do: gio backend la NGUON SU THAT (source of
// truth) cho noi dung note, khong phai localStorage nua. Luu ca content vao
// day se tao ra 2 nguon du lieu co the LECH NHAU (VD note bi sua tu thiet bi
// khac, ban cu trong localStorage se de doi len tren, ghi de mat du lieu moi).
//
// session.ts BAY GIO chi con dong vai tro "nho ho da mo nhung tab nao lan
// truoc" - dung cho useNotes.ts goi notesApi.get(id) de tai lai NOI DUNG
// THAT tu server cho tung tab, khong tu suy ra content tu localStorage nua.
export function loadTabSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredSession;
    if (!Array.isArray(parsed.tabs)) return null;

    return { tabs: parsed.tabs, activeId: parsed.activeId ?? null };
  } catch {
    // Corrupted JSON / storage unavailable (VD private browsing quota) —
    // fail-open, useNotes.ts se tu fallback ve trang thai mac dinh.
    return null;
  }
}

export function saveTabSession(tabs: number[], activeId: number | null): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabs, activeId }));
  } catch {
    // Storage full/unavailable - best-effort, khong lam gian doan nguoi dung.
  }
}
