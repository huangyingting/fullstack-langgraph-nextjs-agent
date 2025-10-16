"use client";
import { ReactNode, useCallback, useState } from "react";
import { ThreadList } from "./ThreadList";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { MCPServerList } from "./MCPServerList";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showMCPConfig, setShowMCPConfig] = useState(false);
  
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const openMCPConfig = useCallback(() => setShowMCPConfig(true), []);
  const closeMCPConfig = useCallback(() => setShowMCPConfig(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F9F8]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar}>
        <ThreadList onOpenMCPConfig={openMCPConfig} />
      </Sidebar>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="z-10 border-b border-black/[0.06]">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        {/* Main content - centered like Claude */}
        <div className="relative flex-1 overflow-hidden">{children}</div>
      </div>

      {/* MCP Configuration Modal */}
      <MCPServerList isOpen={showMCPConfig} onClose={closeMCPConfig} />
    </div>
  );
}
