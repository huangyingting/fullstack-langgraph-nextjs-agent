import React from "react";
import { PanelLeftClose, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5D5D5A] transition-colors hover:bg-black/5"
            aria-label="Toggle navigation"
          >
            <PanelLeftClose size={18} />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#E8A87C] to-[#D4915A] transition-transform group-hover:scale-105">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="hidden text-[15px] font-medium text-[#2D2D2D] sm:block">
              LangGraph Agent
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
