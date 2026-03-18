import { useState } from "react";
import { Save, Building2, Clock, DollarSign, Shield } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { demoBusiness, demoUsers } from "@/data/seed";

export function SettingsPage() {
  const { addToast } = useToast();
  const { hasRole } = useAuth();
  const [biz, setBiz] = useState({ ...demoBusiness });

  function handleSave() {
    addToast({ type: "success", title: "Settings saved", description: "Business settings have been updated" });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your business configuration</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-gray-400" />
          <CardTitle>Business Information</CardTitle>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Business Name" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} />
          <Input label="Phone" value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} />
          <Input label="Email" value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} />
          <Input label="Timezone" value={biz.timezone} onChange={(e) => setBiz({ ...biz, timezone: e.target.value })} />
          <Input label="Address" value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} />
          <Input label="City" value={biz.city} onChange={(e) => setBiz({ ...biz, city: e.target.value })} />
          <Input label="State" value={biz.state} onChange={(e) => setBiz({ ...biz, state: e.target.value })} />
          <Input label="ZIP" value={biz.zip} onChange={(e) => setBiz({ ...biz, zip: e.target.value })} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-400" />
          <CardTitle>Automation Rules</CardTitle>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stale Estimate Days"
            type="number"
            value={String(biz.staleEstimateDays)}
            onChange={(e) => setBiz({ ...biz, staleEstimateDays: Number(e.target.value) })}
          />
          <Input
            label="Attribution Window (days)"
            type="number"
            value={String(biz.attributionWindowDays)}
            onChange={(e) => setBiz({ ...biz, attributionWindowDays: Number(e.target.value) })}
          />
          <Input
            label="High Value Threshold ($)"
            type="number"
            value={String(biz.highValueThreshold)}
            onChange={(e) => setBiz({ ...biz, highValueThreshold: Number(e.target.value) })}
          />
          <Input
            label="Missed Call Suppression (hours)"
            type="number"
            value={String(biz.missedCallSuppressionHours)}
            onChange={(e) => setBiz({ ...biz, missedCallSuppressionHours: Number(e.target.value) })}
          />
        </div>
      </Card>

      {hasRole(["owner"]) && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-gray-400" />
            <CardTitle>Team Members</CardTitle>
          </div>
          <div className="space-y-2">
            {demoUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <Badge variant={u.role === "owner" ? "primary" : u.role === "manager" ? "blue" : "default"}>
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save size={14} /> Save Settings
        </Button>
      </div>
    </div>
  );
}
