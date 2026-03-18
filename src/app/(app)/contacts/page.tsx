"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { CSVImportDialog } from "@/components/csv-import-dialog";
import { demoContacts, demoOpportunities } from "@/lib/demo-data";
import { formatCurrency, daysSince } from "@/lib/utils";
import { Users, Upload, Search, X, Target } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const allTags = Array.from(new Set(demoContacts.flatMap((c) => c.tags))).sort();

  const filtered = demoContacts.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search);
    const matchesTag = !tagFilter || c.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  const selected = selectedContact ? demoContacts.find((c) => c.id === selectedContact) : null;
  const selectedOpps = selected ? demoOpportunities.filter((o) => o.contactId === selected.id) : [];

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Contacts" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{filtered.length} contacts</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4 mr-1" />
              CSV Import
            </Button>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full h-9 rounded-lg border border-input pl-9 pr-4 text-sm bg-background"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button variant={!tagFilter ? "default" : "outline"} size="sm" onClick={() => setTagFilter(null)}>
                All
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={tagFilter === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Phone</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Tags</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Last Service</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Lifetime Value</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((contact) => {
                    const oppCount = demoOpportunities.filter((o) => o.contactId === contact.id).length;
                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => setSelectedContact(contact.id)}
                      >
                        <td className="px-4 py-3 font-medium">{contact.firstName} {contact.lastName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{contact.phone}</td>
                        <td className="px-4 py-3 text-muted-foreground">{contact.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {contact.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {contact.lastServiceDate ? `${daysSince(contact.lastServiceDate)}d ago` : "Never"}
                        </td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(contact.lifetimeValue)}</td>
                        <td className="px-4 py-3">
                          {oppCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-primary">
                              <Target className="h-3 w-3" />{oppCount}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {selected && (
        <div className="w-full lg:w-[420px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <h2 className="font-semibold">{selected.firstName} {selected.lastName}</h2>
            <button onClick={() => setSelectedContact(null)} className="rounded-lg p-1 hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm">{selected.address}</p>
                <p className="text-sm">{selected.city}, {selected.state} {selected.zip}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="text-sm capitalize">{selected.source}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lifetime Value</p>
                <p className="text-sm font-bold">{formatCurrency(selected.lifetimeValue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Service</p>
                <p className="text-sm">{selected.lastServiceDate ? `${daysSince(selected.lastServiceDate)} days ago` : "Never"}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex gap-1 flex-wrap">
                {selected.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>

            {selectedOpps.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Linked Opportunities ({selectedOpps.length})
                </p>
                <div className="space-y-2">
                  {selectedOpps.map((opp) => (
                    <div key={opp.id} className="border border-border rounded-lg p-3">
                      <p className="text-sm font-medium">{opp.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={opp.status} />
                        <span className="text-xs text-muted-foreground">{formatCurrency(opp.estimatedValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Notes</p>
              <textarea
                placeholder="Add notes about this contact..."
                className="w-full rounded-lg border border-input p-3 text-sm bg-background min-h-[80px]"
              />
            </div>
          </div>
        </div>
      )}

      <CSVImportDialog type="contacts" open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
