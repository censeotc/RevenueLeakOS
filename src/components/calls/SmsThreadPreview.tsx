interface SmsMessage {
  id: string;
  body: string;
  from: string;
  createdAt: string;
}

interface SmsThreadPreviewProps {
  messages: SmsMessage[];
  businessPhone: string;
}

export function SmsThreadPreview({ messages, businessPhone }: SmsThreadPreviewProps) {
  return (
    <div className="space-y-3">
      {messages.map((msg) => {
        const isOutbound = msg.from === businessPhone;
        return (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              isOutbound
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p>{msg.body}</p>
            <p className="mt-1 text-xs opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
