"use client";

import { useState } from "react";

interface Note {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
}

interface OpportunityNotesProps {
  opportunityId: string;
  notes: Note[];
}

export function OpportunityNotes({ opportunityId: _opportunityId, notes }: OpportunityNotesProps) {
  const [newNote, setNewNote] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Notes</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border p-3 text-sm">
            <p>{note.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {note.authorName} &middot; {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add
        </button>
      </div>
    </div>
  );
}
