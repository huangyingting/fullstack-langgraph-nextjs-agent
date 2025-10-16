import React, { useEffect } from "react";
import { PanelLeftClose, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, children }) => {
  // Close sidebar on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) toggle();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, toggle]);

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -280, // 280px = w-[280px]
          width: isOpen ? 280 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 z-30 h-screen overflow-hidden border-r border-black/[0.08] bg-white md:sticky ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="flex h-full w-[280px] flex-shrink-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 md:hidden">
            <button
              onClick={toggle}
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5D5D5A] transition-colors hover:bg-black/5"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">{children}</div>
        </div>
      </motion.div>

      {/* Menu Toggle Button - Only show on mobile */}
      <button
        onClick={toggle}
        className={`fixed top-3 left-3 z-40 cursor-pointer rounded-md p-2 transition-all duration-200 md:hidden ${
          isOpen
            ? "pointer-events-none opacity-0"
            : "border border-black/10 bg-white opacity-100 shadow-sm hover:bg-black/5"
        }`}
        aria-label="Toggle navigation"
      >
        <PanelLeftClose size={18} className="text-[#5D5D5A]" />
      </button>

      {/* Overlay Background - Only show on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={toggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
