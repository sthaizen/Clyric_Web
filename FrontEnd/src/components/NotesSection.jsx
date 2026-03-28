import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { PenLine, Plus, Trash2, FileText, Search, PanelLeftClose, PanelLeftOpen, Lock } from "lucide-react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { getNotes, createNote, updateNote, deleteNote } from "../lib/api/notes";
import toast from "react-hot-toast";
import { useSubscription } from "../hooks/useSubscription";
import { useNavigate } from "react-router-dom";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block"],
    ["clean"],
  ],
};

export default function NotesSection({ problemId, problemTitle, onBackToOverview }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { canAccess, tierLabel } = useSubscription();
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const saveTimer = useRef(null);

  const selectedNote = notes.find((n) => n._id === selectedId) || null;

  // ── Access Gate ─────────────────────────────────────────────────────────────
  if (!canAccess("canUseNotes")) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5 bg-[#1b1b1f] px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8a6bfe]/10 flex items-center justify-center ring-1 ring-[#8a6bfe]/20">
          <Lock className="w-7 h-7 text-[#8a6bfe]" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-white">Notes Locked</h3>
          <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed mx-auto">
            Personal notes are available on <span className="text-[#8a6bfe] font-medium">Interview Studio</span> and above.
          </p>
          <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-bold">Current: <span className="text-gray-400">{tierLabel}</span></p>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-[180px]">
          <button
            onClick={onBackToOverview}
            className="w-full px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-all active:scale-95"
          >
            Back to Description
          </button>
          <button
            onClick={() => navigate("/priceoverview")}
            className="w-full px-5 py-2.5 bg-[#8a6bfe] hover:bg-[#795ceb] text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:shadow-[#8a6bfe]/20 active:scale-95"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  // ── Load notes ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!problemId || !userId) return;
    setIsLoading(true);
    setSelectedId(null);
    getNotes(problemId)
      .then(({ notes: loaded }) => {
        setNotes(loaded || []);
        if (loaded?.length > 0) setSelectedId(loaded[0]._id);
      })
      .catch(() => toast.error("Failed to load notes."))
      .finally(() => setIsLoading(false));
  }, [problemId, userId]);

  // ── Create note ─────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    try {
      const { note } = await createNote(problemId);
      setNotes((prev) => [note, ...prev]);
      setSelectedId(note._id);
    } catch {
      toast.error("Failed to create note.");
    }
  };

  // ── Delete note ─────────────────────────────────────────────────────────────
  const handleDelete = async (noteId, e) => {
    e.stopPropagation();
    try {
      await deleteNote(noteId);
      setNotes((prev) => {
        const remaining = prev.filter((n) => n._id !== noteId);
        if (selectedId === noteId) {
          setSelectedId(remaining.length > 0 ? remaining[0]._id : null);
        }
        return remaining;
      });
      toast.success("Note deleted.");
    } catch {
      toast.error("Failed to delete note.");
    }
  };

  // ── Auto-save (debounced) ────────────────────────────────────────────────────
  const scheduleSave = useCallback(
    (id, field, value) => {
      // Optimistically update local state immediately
      setNotes((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
        )
      );

      clearTimeout(saveTimer.current);
      setIsSaving(true);
      saveTimer.current = setTimeout(async () => {
        try {
          await updateNote(id, { [field]: value });
        } catch {
          toast.error("Failed to save note.");
        } finally {
          setIsSaving(false);
        }
      }, 800);
    },
    []
  );

  const handleContentChange = (content) => {
    if (!selectedId) return;
    scheduleSave(selectedId, "content", content);
  };

  const handleTitleChange = (e) => {
    if (!selectedId) return;
    scheduleSave(selectedId, "title", e.target.value);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      stripHtml(n.content).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#1b1b1f] overflow-hidden">
      <style>{`
        .notes-quill .ql-toolbar {
          background: #1e1e24;
          border: 1px solid #28282c;
          border-radius: 10px;
          padding: 6px 10px;
          margin: 12px 20px 0 20px;
          display: flex;
          align-items: center;
          gap: 2px;
          flex-wrap: nowrap;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .notes-quill .ql-toolbar::-webkit-scrollbar { display: none; }
        .notes-quill .ql-container {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 15px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .notes-quill .ql-editor {
          flex-grow: 1;
          color: #e5e7eb;
          padding: 20px 24px;
          font-size: 15px;
          line-height: 1.7;
          overflow-y: auto;
        }
        .notes-quill .ql-editor h1 { font-size: 1.8em; color: #fff; font-weight: 700; margin-bottom: 0.4em; }
        .notes-quill .ql-editor h2 { font-size: 1.4em; color: #fff; font-weight: 600; margin-bottom: 0.3em; }
        .notes-quill .ql-editor h3 { font-size: 1.2em; color: #fff; font-weight: 600; margin-bottom: 0.2em; }
        .notes-quill .ql-editor::-webkit-scrollbar { width: 5px; }
        .notes-quill .ql-editor::-webkit-scrollbar-track { background: transparent; }
        .notes-quill .ql-editor::-webkit-scrollbar-thumb { background-color: #2e2e34; border-radius: 20px; }
        .notes-quill .ql-toolbar button {
          border-radius: 6px; transition: all 0.15s ease;
          width: 28px; height: 28px; display: flex;
          align-items: center; justify-content: center; color: #9ca3af;
        }
        .notes-quill .ql-toolbar button:hover { background: rgba(44,187,93,0.08); color: #2cbb5d; }
        .notes-quill .ql-toolbar button.ql-active { background: rgba(44,187,93,0.12); color: #2cbb5d; }
        .notes-quill .ql-stroke { stroke: currentColor; transition: stroke 0.15s; stroke-width: 1.8; }
        .notes-quill .ql-fill { fill: currentColor; transition: fill 0.15s; }
        .notes-quill .ql-picker { color: #9ca3af; font-size: 13px; font-weight: 500; }
        .notes-quill .ql-picker-label {
          border-radius: 6px; transition: all 0.15s; padding: 0 8px;
          display: flex; align-items: center; height: 28px; border: 1px solid transparent;
        }
        .notes-quill .ql-picker-label:hover { color: #2cbb5d; background: rgba(44,187,93,0.08); }
        .notes-quill .ql-picker-options {
          background-color: #1e1e24; border: 1px solid #28282c;
          border-radius: 10px; box-shadow: 0 10px 25px -3px rgba(0,0,0,0.7);
          padding: 6px; margin-top: 6px;
        }
        .notes-quill .ql-picker-item { color: #9ca3af; border-radius: 6px; padding: 6px 12px; transition: all 0.15s; }
        .notes-quill .ql-picker-item:hover { color: #fff; background: rgba(44,187,93,0.15); }
        .notes-quill .ql-editor.ql-blank::before { color: #4b5563; font-style: normal; left: 24px; }
      `}</style>

      <div className="flex h-full min-h-0">
        {/* ── Left: Note List ─────────────────────────────────────────────────── */}
        <div
          className={`shrink-0 flex flex-col border-r border-[#28282c] bg-[#16161a] transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? "w-0 overflow-hidden border-none" : "w-64"
            }`}
        >
          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-[#28282c] shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-[#8a6bfe]" />
                <h2 className="text-sm font-bold text-white">Notes</h2>
                {notes.length > 0 && (
                  <span className="text-[10px] font-bold bg-[#28282c] text-gray-400 px-1.5 py-0.5 rounded-full">
                    {notes.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 text-[#2cbb5d] hover:bg-[#2cbb5d]/10 p-1.5 rounded-lg transition-colors"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-[#1e1e24] text-sm text-gray-300 placeholder-gray-500 pl-8 pr-3 py-2 rounded-lg outline-none border border-[#28282c] focus:border-[#3e3e42] transition-colors"
              />
            </div>
          </div>

          {/* Note List */}
          <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#28282c] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-5 h-5 border-2 border-t-[#2cbb5d] border-[#2cbb5d]/20 rounded-full animate-spin" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 px-4">
                <FileText className="w-8 h-8 opacity-20" />
                <p className="text-xs text-center">
                  {search ? "No notes match your search." : "No notes yet.\nClick + to create one."}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => setSelectedId(note._id)}
                  className={`group mx-2 my-0.5 rounded-xl px-3 py-3 cursor-pointer transition-all duration-150 ${selectedId === note._id
                    ? "bg-[#1c1c21]/60 border border-[#242428]/60"
                    : "hover:bg-[#1c1c21]/60 border border-[#242428]/60"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate flex-1 leading-snug">
                      {note.title || "Untitled"}
                    </p>
                    <button
                      onClick={(e) => handleDelete(note._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {stripHtml(note.content) || "No additional text"}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5">{timeAgo(note.updatedAt)}</p>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer (Collapse Button) */}
          {!isSidebarCollapsed && (
            <div className="p-2 shrink-0 flex items-center justify-end pr-3">
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Editor ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1b1b1f]">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="px-6 pt-5 pb-2 border-b border-[#28282c] shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={selectedNote.title || ""}
                      onChange={handleTitleChange}
                      placeholder="Note title..."
                      className="text-xl font-bold text-white bg-transparent outline-none border-none flex-1 placeholder-gray-600 min-w-0"
                    />
                  </div>
                  <div className="ml-4 shrink-0 flex items-center gap-3">
                    {problemTitle && (
                      <span className="text-[11px] bg-[#28282c] text-gray-400 px-2 py-1 rounded border border-[#3e3e42]/50 font-semibold">
                        {problemTitle}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded transition-all ${isSaving
                      ? "text-yellow-400 bg-yellow-400/10"
                      : "text-[#2cbb5d] bg-[#2cbb5d]/10"
                      }`}>
                      {isSaving ? "Saving..." : "Saved"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(selectedNote.updatedAt).toLocaleString()}
                </p>
              </div>

              {/* Quill Editor */}
              <div className="flex-1 flex flex-col notes-quill overflow-hidden relative">
                <ReactQuill
                  key={selectedNote._id}
                  theme="snow"
                  value={selectedNote.content || ""}
                  onChange={handleContentChange}
                  className="h-full flex flex-col"
                  placeholder="Start writing your ideas, approach, or edge cases..."
                  modules={QUILL_MODULES}
                />

                {isSidebarCollapsed && (
                  <div className="absolute bottom-6 left-6 z-10">
                    <button
                      onClick={() => setIsSidebarCollapsed(false)}
                      className=" rounded-lg text-[#ffffff] hover:bg-white/10 transition-all group"
                      title="Expand Sidebar"
                    >
                      <PanelLeftOpen className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="relative flex flex-col items-center justify-center h-full gap-6 bg-[#1b1b1f]">
              {/* Sidebar Toggle - Moved to top left for standard UX, improved hover states */}
              {isSidebarCollapsed && (
                <div className="absolute top-6 left-6 z-10">
                  <button
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out group"
                    title="Expand Sidebar"
                  >
                    <PanelLeftOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              )}


              <div className="w-16 h-16 rounded-full bg-[#8a6bfe]/10 flex items-center justify-center">
                <PenLine className="w-7 h-7 text-[#8a6bfe]" strokeWidth={1.5} />
              </div>

              {/* Typography - Improved contrast, sizing, and vertical rhythm */}
              <div className="text-center space-y-1.5">
                <h3 className="text-xl font-medium text-gray-200 tracking-tight">
                  No note selected
                </h3>
                <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">
                  Create a new note or choose one from your sidebar to start writing.
                </p>
              </div>

              {/* Call to Action - Unified color, added shadow, and an active click "squish" effect */}
              <button
                onClick={handleCreate}
                className="mt-2 flex items-center gap-2 bg-[#8a6bfe] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#795ceb] hover:shadow-lg hover:shadow-[#8a6bfe]/20 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Create Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
