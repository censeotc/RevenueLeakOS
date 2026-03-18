"use client";

import { X, Plus } from "lucide-react";
import { useState } from "react";

interface ContactTagsProps {
  tags: string[];
  editable?: boolean;
  onChange?: (tags: string[]) => void;
}

export function ContactTags({ tags, editable = false, onChange }: ContactTagsProps) {
  const [localTags, setLocalTags] = useState(tags);
  const [newTag, setNewTag] = useState("");
  const [adding, setAdding] = useState(false);

  function removeTag(tag: string) {
    const updated = localTags.filter((t) => t !== tag);
    setLocalTags(updated);
    onChange?.(updated);
  }

  function addTag() {
    if (!newTag.trim() || localTags.includes(newTag.trim())) return;
    const updated = [...localTags, newTag.trim().toLowerCase()];
    setLocalTags(updated);
    onChange?.(updated);
    setNewTag("");
    setAdding(false);
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {localTags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
        >
          {tag}
          {editable && (
            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {editable && !adding && (
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
        >
          <Plus className="h-3 w-3" />
          Add tag
        </button>
      )}
      {editable && adding && (
        <input
          autoFocus
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTag();
            if (e.key === "Escape") setAdding(false);
          }}
          onBlur={addTag}
          placeholder="tag name"
          className="text-xs border border-blue-300 rounded-full px-2 py-0.5 w-20 focus:outline-none"
        />
      )}
    </div>
  );
}
