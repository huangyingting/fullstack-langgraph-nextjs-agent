"use client";

import { useRef, useState } from "react";
import { useThreads } from "@/hooks/useThreads";
import {
  SquarePen,
  Search,
  Loader2,
  Check,
  X,
  Pencil,
  RefreshCcw,
  Trash2,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface ThreadListProps {
  onOpenMCPConfig: () => void;
}

export function ThreadList({ onOpenMCPConfig }: ThreadListProps) {
  const { threads, createThread, deleteThread, refetchThreads } = useThreads();
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [savingRename, setSavingRename] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleCreateThread = async () => {
    setIsCreating(true);
    try {
      const newThread = await createThread();
      router.push(`/thread/${newThread.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = threads.filter((t) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (t.title || "").toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

  const startRename = (id: string, current: string | undefined) => {
    setRenamingId(id);
    setRenameValue(current || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const saveRename = async () => {
    if (!renamingId) return;
    setSavingRename(true);
    try {
      await fetch("/api/agent/threads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: renamingId, title: renameValue || "Untitled thread" }),
      });
      await refetchThreads();
      setRenamingId(null);
    } catch (e) {
      console.error("Rename failed", e);
    } finally {
      setSavingRename(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchThreads();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      return;
    }
    setDeletingId(threadId);
    try {
      await deleteThread(threadId);
      // Navigation will be handled by the useThreads hook if we're deleting the active thread
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete thread. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <nav className="flex h-full flex-col">
      <div className="space-y-3 px-3 pt-4 pb-3">
        <div className="flex gap-2">
          <button
            onClick={handleCreateThread}
            disabled={isCreating}
            className="bg-[#AB6B3C] text-white inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[#96593A] disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SquarePen className="h-3.5 w-3.5" />
            )}
            New
          </button>
          <button
            onClick={handleRefresh}
            className="border border-black/10 text-[#5D5D5A] hover:bg-black/5 inline-flex items-center justify-center rounded-md px-2 py-1.5 transition-colors"
            title="Refresh"
          >
            {refreshing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <div className="group relative">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A0A0]" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search threads..."
            className="w-full rounded-md border border-black/10 bg-white py-1.5 pr-3 pl-8 text-[13px] text-[#2D2D2D] placeholder-[#A0A0A0] focus:border-black/20 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {filtered.map((thread) => {
          const active = pathname === `/thread/${thread.id}`;
          const isRenaming = renamingId === thread.id;
          return (
            <div
              key={thread.id}
              className={`group relative cursor-pointer rounded-md px-2.5 py-2 text-left transition-colors ${
                active
                  ? "bg-black/5 text-[#2D2D2D]"
                  : "hover:bg-black/[0.03] text-[#5D5D5A]"
              }`}
              onClick={() => {
                if (!isRenaming) router.push(`/thread/${thread.id}`);
              }}
            >
              {!isRenaming && (
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-[13px] font-medium" title={thread.title || thread.id}>
                    {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(thread.id, thread.title);
                      }}
                      className="hover:bg-black/5 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors"
                      title="Rename"
                    >
                      <Pencil className="h-3 w-3 text-[#8E8E8E]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThread(thread.id);
                      }}
                      disabled={deletingId === thread.id}
                      className="hover:bg-red-50 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:text-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === thread.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 text-[#8E8E8E]" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isRenaming && (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={inputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename();
                      if (e.key === "Escape") cancelRename();
                    }}
                    className="bg-white border-black/10 focus:border-black/20 flex-1 rounded-md border px-2 py-1 text-[13px] focus:outline-none text-[#2D2D2D]"
                  />
                  <button
                    disabled={savingRename}
                    onClick={saveRename}
                    className="bg-[#AB6B3C] text-white inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-[#96593A] disabled:opacity-50 transition-colors"
                  >
                    {savingRename ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={cancelRename}
                    className="bg-black/5 text-[#5D5D5A] hover:bg-black/10 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#A0A0A0]">
                <span>{thread.id.slice(0, 6)}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-[#D0D0D0]" />
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-[13px] text-[#A0A0A0]">No threads found.</div>
        )}
      </div>
      
      {/* MCP Settings Button */}
      <div className="border-t border-black/[0.06] bg-white px-3 py-3">
        <button
          onClick={onOpenMCPConfig}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-3 py-1.5 text-[13px] font-medium text-[#5D5D5A] transition-colors hover:bg-black/5"
        >
          <Settings className="h-3.5 w-3.5" />
          MCP Servers
        </button>
      </div>
    </nav>
  );
}
