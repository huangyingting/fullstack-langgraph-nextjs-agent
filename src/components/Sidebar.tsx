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
          x: isOpen ? 0 : -256, // 256px = w-64
          width: isOpen ? 256 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-30 h-screen overflow-hidden border-r border-gray-200/50 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 dark:border-gray-800/50 dark:from-gray-900 dark:to-gray-900/80 md:sticky ${
          isOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="flex h-full w-64 flex-shrink-0 flex-col overflow-hidden px-3 py-4">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={toggle}
              className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 md:hidden"
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
        className={`fixed top-4 left-4 z-40 cursor-pointer rounded-md p-2 transition-all duration-300 md:hidden ${
          isOpen
            ? "pointer-events-none opacity-0"
            : "border border-gray-200 bg-white opacity-100 shadow-sm hover:bg-gray-50"
        }`}
        aria-label="Toggle navigation"
      >
        <PanelLeftClose size={20} />
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
