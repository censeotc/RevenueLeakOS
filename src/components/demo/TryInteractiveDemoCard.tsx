import Link from "next/link";
import { PlayCircle } from "lucide-react";

export function TryInteractiveDemoCard() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
        <PlayCircle className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Try the interactive demo</h3>
      <p className="text-blue-100 text-sm mb-4">
        Walk through a real revenue recovery scenario step-by-step. No sign-up required.
      </p>
      <Link
        href="/app/demo-walkthrough"
        className="inline-block bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Launch demo →
      </Link>
    </div>
  );
}
