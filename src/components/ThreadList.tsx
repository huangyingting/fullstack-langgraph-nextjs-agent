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
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarSettings } from "./SidebarSettings";
import { useModelSettings } from "@/contexts/ModelSettingsContext";

interface ThreadListProps {
  onOpenMCPConfig: () => void;
}

export function ThreadList({ onOpenMCPConfig }: ThreadListProps) {
  const { threads, createThread, deleteThread, refetchThreads } = useThreads();
  const { provider, setProvider, model, setModel } = useModelSettings();
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
    <nav className="flex h-full flex-col border-r border-gray-200/50 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-sm dark:border-gray-800/50 dark:from-gray-900 dark:to-gray-900/50">
      <div className="space-y-3 px-3 pt-4 pb-2">
        <div className="flex gap-2">
          <button
            onClick={handleCreateThread}
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 dark:from-blue-700 dark:to-indigo-700"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SquarePen className="h-4 w-4" />
            )}
            New
          </button>
          <button
            onClick={handleRefresh}
            className="border border-gray-200/50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 inline-flex items-center justify-center rounded-lg px-2.5 py-2 transition-all dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            title="Refresh"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="group relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search threads..."
            className="w-full rounded-lg border border-gray-200/50 bg-white/50 py-2 pr-3 pl-9 text-xs font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700/50 dark:bg-gray-800/30 dark:text-gray-100 dark:focus:border-blue-600"
          />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto px-2 pb-3">
        {filtered.map((thread) => {
          const active = pathname === `/thread/${thread.id}`;
          const isRenaming = renamingId === thread.id;
          return (
            <div
              key={thread.id}
              className={`group relative cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 text-gray-900 dark:border-blue-900/30 dark:from-blue-950/40 dark:to-indigo-950/30 dark:text-gray-100"
                  : "border-transparent hover:bg-gray-100/50 text-gray-700 dark:hover:bg-gray-800/30 dark:text-gray-300"
              }`}
              onClick={() => {
                if (!isRenaming) router.push(`/thread/${thread.id}`);
              }}
            >
              {!isRenaming && (
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium" title={thread.title || thread.id}>
                    {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(thread.id, thread.title);
                      }}
                      className="hover:bg-blue-100 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors dark:hover:bg-blue-900/30"
                      title="Rename"
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThread(thread.id);
                      }}
                      disabled={deletingId === thread.id}
                      className="hover:bg-red-100 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      title="Delete"
                    >
                      {deletingId === thread.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isRenaming && (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={inputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename();
                      if (e.key === "Escape") cancelRename();
                    }}
                    className="bg-white dark:bg-gray-800 border-gray-200/50 dark:border-gray-700/50 focus:ring-blue-500/20 flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:outline-none dark:text-gray-100"
                  />
                  <button
                    disabled={savingRename}
                    onClick={saveRename}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white inline-flex h-7 w-7 items-center justify-center rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 transition-all"
                  >
                    {savingRename ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={cancelRename}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="text-muted-foreground/70 mt-1 flex items-center gap-2 text-[10px]">
                <span>{thread.id.slice(0, 6)}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-gray-400">No threads found.</div>
        )}
      </div>

      {/* Sidebar Settings */}
      <SidebarSettings
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        onOpenMCPConfig={onOpenMCPConfig}
      />
    </nav>
  );
}
