import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ThreadMessage } from "@/types/revenue";

export function SmsThreadPreview({ messages }: { messages: ThreadMessage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message preview</CardTitle>
        <CardDescription>First-touch outreach connected to the selected call.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? <p className="text-sm text-slate-500">No follow-up thread has been started.</p> : null}
        {messages.map((message) => (
          <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.direction === 'outbound' ? 'ml-auto bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`} key={message.id}>
            <p>{message.body}</p>
            <p className={`mt-2 text-xs ${message.direction === 'outbound' ? 'text-brand-100' : 'text-slate-500'}`}>{message.timestamp}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
