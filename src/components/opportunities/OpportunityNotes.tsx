"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { OpportunityNote } from "@/types/revenue";

interface OpportunityNotesProps {
  opportunityId: string;
  notes: OpportunityNote[];
}

export function OpportunityNotes({ opportunityId, notes }: OpportunityNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  function handleAddNote() {
    if (!newNote.trim()) return;
    const note: OpportunityNote = {
      id: Math.random().toString(36).slice(2),
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
      authorName: "You",
    };
    setLocalNotes((prev) => [note, ...prev]);
    setNewNote("");
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-900">Notes</h4>

      <div className="flex gap-2">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
          placeholder="Add a note..."
          className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {localNotes.map((note) => (
          <li key={note.id} className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-700">{note.content}</p>
            <p className="text-xs text-slate-400 mt-1">
              {note.authorName} · {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
            </p>
          </li>
        ))}
        {localNotes.length === 0 && (
          <li className="text-sm text-slate-400 text-center py-4">No notes yet</li>
        )}
      </ul>
    </div>
  );
}
