import React from "react";
import { PanelLeftClose, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/50 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-gray-800/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            aria-label="Toggle navigation"
          >
            <PanelLeftClose size={20} />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="hidden text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-200 sm:block">
              LangGraph Agent
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
