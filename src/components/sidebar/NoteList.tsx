import type { MouseEvent } from "react";
import type { Note, NoteSyncStatus } from "../../types";
import { NoteListItem } from "./NoteListItem";

type Props = {
  notes: Note[];
  activeId: number | null;
  selectMode: boolean;
  selected: Set<number>;
  driveConnected: boolean;
  noteSyncMap: Record<number, NoteSyncStatus>;
  onOpen: (id: number) => void;
  onToggleSelect: (id: number) => void;
  onTouchStart: (id: number) => void;
  onTouchEnd: () => void;
  onMoreClick: (e: MouseEvent<HTMLButtonElement>, id: number) => void;
};

export function NoteList({
  notes, activeId, selectMode, selected, driveConnected, noteSyncMap,
  onOpen, onToggleSelect, onTouchStart, onTouchEnd, onMoreClick,
}: Props) {
  return (
    <div className="file-list">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isActive={activeId === note.id}
          selectMode={selectMode}
          isSelected={selected.has(note.id)}
          syncStatus={noteSyncMap[note.id]}
          driveConnected={driveConnected}
          onClick={() => (selectMode ? onToggleSelect(note.id) : onOpen(note.id))}
          onTouchStart={() => onTouchStart(note.id)}
          onTouchEnd={onTouchEnd}
          onMoreClick={(e) => onMoreClick(e, note.id)}
        />
      ))}
    </div>
  );
}
