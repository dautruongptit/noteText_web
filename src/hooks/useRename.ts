import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { Note } from "../types";
import { nameTaken } from "../utils/uniqueName";
import { notesApi } from "../api/notesApi";
import { ApiError } from "../utils/apiClient";

export function useRename(
  notes: Note[],
  setNotes: Dispatch<SetStateAction<Note[]>>,
  closeMenu: () => void,
) {
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [renaming, setRenaming] = useState(false);
  const renameInput = useRef<HTMLInputElement>(null);

  const openRename = (id: number) => {
    const note = notes.find((n) => n.id === id)!;
    setRenameId(id);
    setRenameName(note.name);
    setRenameError("");
    closeMenu();
    setTimeout(() => renameInput.current?.select(), 60);
  };

  const onRenameChange = (val: string) => {
    setRenameName(val);
    if (!val.trim()) { setRenameError("Tên file không được để trống"); return; }
    // Kiem tra trung ten TRUOC o client (nhanh, khong can cho mang) dua tren
    // danh sach dang co san - day chi la lop UX, lop bao ve THAT SU van la
    // UNIQUE constraint o backend (xem catch block trong commitRename).
    if (nameTaken(notes, val, renameId ?? undefined)) { setRenameError("Tên file đã tồn tại, vui lòng chọn tên khác"); return; }
    setRenameError("");
  };

  const commitRename = async () => {
    if (!renameId || renameError || !renameName.trim() || renaming) return;
    setRenaming(true);
    try {
      const result = await notesApi.rename(renameId, renameName.trim());
      setNotes((n) => n.map((x) => (x.id === renameId ? { ...x, name: result.displayName } : x)));
      setRenameId(null);
    } catch (err) {
      // Server tu choi (VD trung ten do race condition voi thiet bi khac vua
      // doi ten cung luc - kiem tra o client khong bat duoc case nay) - hien
      // loi NGAY TRONG modal, KHONG dong modal, de nguoi dung chon ten khac
      // ma khong mat lai thao tac dang lam.
      setRenameError(err instanceof ApiError ? err.message : "Đổi tên thất bại, vui lòng thử lại");
    } finally {
      setRenaming(false);
    }
  };

  return { renameId, setRenameId, renameName, renameError, renaming, renameInput, openRename, onRenameChange, commitRename };
}
