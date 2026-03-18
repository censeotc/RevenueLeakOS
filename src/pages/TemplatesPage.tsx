import { useState } from "react";
import { FileCode, MessageSquare, Mail, Copy, Edit, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { demoTemplates } from "@/data/seed";

export function TemplatesPage() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = demoTemplates.filter((t) => {
    if (filter === "all") return !t.isArchived;
    return t.type === filter && !t.isArchived;
  });

  const preview = previewId ? demoTemplates.find((t) => t.id === previewId) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Message templates for campaigns and auto-replies</p>
        </div>
        <Button
          size="sm"
          onClick={() => addToast({ type: "info", title: "Coming soon", description: "Template editor available in full release" })}
        >
          <FileCode size={14} /> New Template
        </Button>
      </div>

      <div className="flex gap-2">
        {["all", "sms", "email"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "all" ? "All" : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <EmptyState title="No templates" description="No templates match this filter." />
            </Card>
          ) : (
            filtered.map((tpl) => (
              <Card key={tpl.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      {tpl.type === "sms" ? (
                        <MessageSquare size={16} className="text-primary-500" />
                      ) : (
                        <Mail size={16} className="text-purple-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{tpl.name}</h3>
                        <Badge variant={tpl.type === "sms" ? "primary" : "purple"}>
                          {tpl.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{tpl.body}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {tpl.variables.map((v) => (
                          <span key={v} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setPreviewId(tpl.id)}>
                      <Eye size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(tpl.body);
                        addToast({ type: "success", title: "Copied", description: "Template copied to clipboard" });
                      }}
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {preview && (
          <div className="w-80 shrink-0">
            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{preview.name}</h3>
              <Badge variant={preview.type === "sms" ? "primary" : "purple"} className="mb-3">
                {preview.type.toUpperCase()}
              </Badge>
              {preview.subject && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-0.5">Subject</p>
                  <p className="text-sm text-gray-900">{preview.subject}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {preview.body}
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Variables</p>
                <div className="flex flex-wrap gap-1">
                  {preview.variables.map((v) => (
                    <Badge key={v} variant="default">{`{{${v}}}`}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
