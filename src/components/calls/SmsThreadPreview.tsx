"use client";

import { formatDistanceToNow } from "date-fns";
import type { SmsThread } from "@/types/revenue";

interface SmsThreadPreviewProps {
  thread: SmsThread;
  onClick?: () => void;
}

export function SmsThreadPreview({ thread, onClick }: SmsThreadPreviewProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">
        {thread.contactName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900 truncate">{thread.contactName}</p>
          <span className="text-xs text-slate-400 flex-shrink-0">
            {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">{thread.lastMessage}</p>
      </div>
      {thread.unreadCount > 0 && (
        <span className="w-5 h-5 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {thread.unreadCount}
        </span>
      )}
    </button>
  );
}
