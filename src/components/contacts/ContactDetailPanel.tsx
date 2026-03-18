"use client";

import type { ContactRow } from "@/types/revenue";
import { ContactTags } from "./ContactTags";

interface ContactDetailPanelProps {
  contact: ContactRow;
  onClose: () => void;
}

export function ContactDetailPanel({ contact, onClose }: ContactDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 border-l bg-background p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {contact.firstName} {contact.lastName}
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          &times;
        </button>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p>{contact.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p>{contact.phone ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tags</p>
          <ContactTags tags={contact.tags} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Source</p>
          <p className="capitalize">{contact.source ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Job</p>
          <p>{contact.lastJobAt ? new Date(contact.lastJobAt).toLocaleDateString() : "—"}</p>
        </div>
      </div>
    </div>
  );
}
