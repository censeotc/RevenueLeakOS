import { useState } from "react";
import { Search, Plus, Upload, Phone, Mail, MapPin, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { CSVImport } from "@/components/ui/CSVImport";
import { useToast } from "@/contexts/ToastContext";
import { demoContacts, getOpportunitiesForContact } from "@/data/seed";
import { formatDistanceToNow } from "date-fns";

export function ContactsPage() {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { addToast } = useToast();

  const allTags = [...new Set(demoContacts.flatMap((c) => c.tags))].sort();

  const filtered = demoContacts.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesTag = !tagFilter || c.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  const selected = selectedId ? demoContacts.find((c) => c.id === selectedId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{demoContacts.length} contacts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowImport(!showImport)}>
            <Upload size={14} /> Import CSV
          </Button>
          <Button size="sm" onClick={() => addToast({ type: "info", title: "Coming soon", description: "Contact creation is available in the full release" })}>
            <Plus size={14} /> Add Contact
          </Button>
        </div>
      </div>

      {showImport && (
        <CSVImport
          entityType="contacts"
          expectedColumns={["firstName", "lastName", "phone", "email"]}
          onImport={(rows) => {
            setShowImport(false);
          }}
        />
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="block w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setTagFilter(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!tagFilter ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagFilter === tag ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card padding={false}>
            {filtered.length === 0 ? (
              <EmptyState
                title="No contacts found"
                description="Try adjusting your search or filter."
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((contact) => {
                  const opps = getOpportunitiesForContact(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedId(contact.id)}
                      className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${selectedId === contact.id ? "bg-primary-50/50" : "hover:bg-gray-50"}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold shrink-0">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {contact.tags.slice(0, 2).map((t) => (
                          <Badge key={t} variant="default">{t}</Badge>
                        ))}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-gray-700">${contact.lifetimeValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          {opps.length > 0 ? `${opps.length} opp${opps.length > 1 ? "s" : ""}` : "No opps"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {selected && (
          <div className="w-80 shrink-0">
            <Card>
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  {selected.firstName[0]}{selected.lastName[0]}
                </div>
                <h2 className="text-base font-semibold text-gray-900">
                  {selected.firstName} {selected.lastName}
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {selected.address}, {selected.city}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag size={14} className="text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Lifetime Value</p>
                  <p className="text-lg font-bold text-gray-900">${selected.lifetimeValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Service</p>
                  <p className="text-sm text-gray-700">
                    {selected.lastServiceDate
                      ? formatDistanceToNow(selected.lastServiceDate, { addSuffix: true })
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm text-gray-700 capitalize">{selected.source}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
