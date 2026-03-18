import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useToast, type ToastType } from "@/contexts/ToastContext";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success-500" />,
  error: <AlertCircle size={18} className="text-danger-500" />,
  info: <Info size={18} className="text-primary-500" />,
  warning: <AlertTriangle size={18} className="text-warning-500" />,
};

const borders: Record<ToastType, string> = {
  success: "border-l-success-500",
  error: "border-l-danger-500",
  info: "border-l-primary-500",
  warning: "border-l-warning-500",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white rounded-lg shadow-lg border border-gray-200 border-l-4 ${borders[toast.type]} p-4 flex items-start gap-3 animate-[slideIn_0.2s_ease-out]`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-gray-500 mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
