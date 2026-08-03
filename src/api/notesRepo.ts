import { notesApi } from "./notesApi";
import { localNotesStore } from "../utils/localNotesStore";
import type { BulkDeleteResult, NoteDetail, NoteSummary } from "./types";

export type NotesMode = "local" | "server";

// SEC-15: truu tuong hoa "noi luu note" thanh 1 interface DUY NHAT, de
// useNotes.ts/useAutoSave.ts KHONG CAN biet dang o Local Mode hay Server
// Mode - chi goi repo.xxx() nhu nhau. Nho vay TOAN BO logic tab/menu/UI hien
// co (SEC-08) duoc giu nguyen 100%, chi thay doi phan "goi API lay du lieu
// tu dau" - giam toi da rui ro khi thay doi kien truc lon nhu the nay.
export type NotesRepo = {
  list: () => Promise<NoteSummary[]>;
  get: (id: number) => Promise<NoteDetail>;
  create: (displayName: string, initialContent: string) => Promise<NoteDetail>;
  updateContent: (id: number, content: string) => Promise<NoteDetail>;
  rename: (id: number, newDisplayName: string) => Promise<NoteSummary>;
  duplicate: (id: number) => Promise<NoteDetail>;
  remove: (id: number) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<BulkDeleteResult>;
  download: (id: number, filename: string) => Promise<void>;
};

const serverRepo: NotesRepo = {
  list: () => notesApi.list(),
  get: (id) => notesApi.get(id),
  create: (displayName, initialContent) => notesApi.create(displayName, initialContent),
  updateContent: (id, content) => notesApi.updateContent(id, content),
  rename: (id, newDisplayName) => notesApi.rename(id, newDisplayName),
  duplicate: (id) => notesApi.duplicate(id),
  remove: (id) => notesApi.remove(id),
  bulkDelete: (ids) => notesApi.bulkDelete(ids),
  download: (id, filename) => notesApi.download(id, filename),
};

const localRepo: NotesRepo = {
  list: () => localNotesStore.list(),
  get: (id) => localNotesStore.get(id),
  create: (displayName, initialContent) => localNotesStore.create(displayName, initialContent),
  updateContent: (id, content) => localNotesStore.updateContent(id, content),
  rename: (id, newDisplayName) => localNotesStore.rename(id, newDisplayName),
  duplicate: (id) => localNotesStore.duplicate(id),
  remove: (id) => localNotesStore.remove(id),
  bulkDelete: (ids) => localNotesStore.bulkDelete(ids),
  download: (id, filename) => localNotesStore.download(id, filename),
};

export function getNotesRepo(mode: NotesMode): NotesRepo {
  return mode === "server" ? serverRepo : localRepo;
}
