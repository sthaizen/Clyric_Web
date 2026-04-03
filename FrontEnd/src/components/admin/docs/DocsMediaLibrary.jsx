import React, { useState, useRef } from "react";
import {
  Upload, Image, Trash2, Copy, Check, Search,
  Grid3x3, List, Eye, X, Download, FileImage, Loader2
} from "lucide-react";
import { docsApi } from "../../../api/docsApi";
import toast from "react-hot-toast";

// ─── Media Thumbnail ──────────────────────────────────────────────────────────
const Thumb = ({ item, size = "full" }) => {
  if (item.url) {
    return <img src={item.url} alt={item.name} className={`w-full h-full object-cover`} />;
  }
  const colors = ["from-orange-100 to-orange-200","from-blue-100 to-blue-200","from-purple-100 to-purple-200","from-emerald-100 to-emerald-200","from-rose-100 to-rose-200","from-slate-100 to-slate-200"];
  const i = item.name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${colors[i]} flex flex-col items-center justify-center`}>
      <FileImage className="w-5 h-5 text-slate-400 mb-1" strokeWidth={1.5} />
      <p className="text-[10px] font-bold text-slate-400 text-center px-2 truncate max-w-full">{item.name}</p>
    </div>
  );
};

// ─── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(item.url || item.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="min-w-0 flex-1 pr-4">
            <p className="text-[14px] font-bold text-slate-900 truncate">{item.name}</p>
            <p className="text-[12px] text-slate-400 font-medium">{item.size} · {item.dimensions || "—"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="aspect-video bg-slate-100 mx-6 my-4 rounded-2xl overflow-hidden flex items-center justify-center">
          {item.url
            ? <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain" />
            : <Thumb item={item} />
          }
        </div>
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Name</span>
            <span className="text-[12px] font-mono text-slate-600 flex-1 truncate">{item.name}</span>
            <button onClick={handleCopy} className="text-[11px] font-bold text-orange-500 hover:text-orange-600 shrink-0">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-[12px] text-slate-400">
            Type: <span className="font-bold text-slate-700">{item.type}</span> ·{" "}
            Uploaded: <span className="font-bold text-slate-700">{item.uploadedAt}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Grid Card ────────────────────────────────────────────────────────────────
const MediaCard = ({ item, selected, onSelect, onDelete, onPreview }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      className={`group relative bg-white border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${
        selected ? "border-orange-400 shadow-[0_0_0_3px_rgba(249,115,22,0.15)]" : "border-slate-200/60 hover:border-slate-300 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
        <Thumb item={item} />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={e => { e.stopPropagation(); onPreview(item); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleCopy}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30 transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(item.id); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-red-500/60 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[12px] font-bold text-slate-900 truncate">{item.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-slate-400 font-medium">{item.size}</span>
          <span className="text-[10px] text-slate-400 font-medium">{item.uploadedAt}</span>
        </div>
      </div>
    </div>
  );
};

// ─── List Row ─────────────────────────────────────────────────────────────────
const MediaRow = ({ item, selected, onSelect, onDelete }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`group flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer last:border-0 ${selected ? "bg-orange-50/30" : ""}`} onClick={onSelect}>
      <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
        <Thumb item={item} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-900 truncate">{item.name}</p>
        <p className="text-[11px] text-slate-400 font-mono">{item.type}</p>
      </div>
      <span className="text-[12px] text-slate-400 font-medium w-20 text-center">{item.size}</span>
      <span className="text-[12px] text-slate-400 font-medium w-24">{item.dimensions || "—"}</span>
      <span className="text-[11px] text-slate-400 w-24 text-right">{item.uploadedAt}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(item.name); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DocsMediaLibrary({ media = [], onAdd, onDelete }) {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const filtered = media.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const processFiles = async (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setDragging(true); // Re-use the dragging state or you can make a separate isUploading state
    toast.loading(`Uploading ${imageFiles.length} image(s)...`, { id: "upload" });

    try {
      const newItems = [];
      for (const f of imageFiles) {
        const res = await docsApi.uploadImage(f);
        newItems.push({
          id: res.public_id || Date.now() + Math.random(),
          name: f.name,
          size: f.size > 1024 * 1024
            ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(f.size / 1024)} KB`,
          dimensions: res.width ? `${res.width}x${res.height}` : "—",
          url: res.url,
          type: f.type,
          uploadedAt: new Date().toLocaleDateString(),
        });
      }
      onAdd(newItems);
      toast.success("Upload complete!", { id: "upload" });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + (err.response?.data?.error || err.message), { id: "upload" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      setDragging(false);
    }
  };

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const bulkDelete = () => {
    selected.forEach(id => onDelete(id));
    setSelected([]);
  };

  const totalSize = media.reduce((sum, m) => {
    const n = parseFloat(m.size);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <>
      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}

      <div className="flex flex-col pb-10">

        {/* ── Header stats ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
          <div className="flex items-center gap-4">
            <span className="text-[22px] font-bold text-slate-900">{media.length}</span>
            <span className="text-[13px] font-bold text-slate-400">file{media.length !== 1 ? "s" : ""}
              {media.length > 0 && ` · ~${totalSize.toFixed(0)} KB total`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => { processFiles(e.target.files); e.target.value = ""; }}
            />
            {selected.length > 0 && (
              <button
                onClick={bulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-[13px] font-bold hover:bg-red-600 transition-all shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete {selected.length}
              </button>
            )}
            <button
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              <Upload strokeWidth={2} className="w-4 h-4" /> Upload Images
            </button>
          </div>
        </div>

        {/* ── Drop zone ── */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current.click()}
          className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragging ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-3 ${dragging ? "text-orange-500" : "text-slate-300"}`} strokeWidth={1.5} />
          <p className={`text-[13px] font-bold ${dragging ? "text-orange-600" : "text-slate-400"}`}>
            {dragging ? "Drop images to upload" : "Drag & drop images here, or click to browse"}
          </p>
          <p className="text-[11px] text-slate-300 mt-1">PNG, JPG, WEBP, SVG, GIF · Multiple files supported</p>
        </div>

        {/* ── Toolbar ── */}
        {media.length > 0 && (
          <div className="flex items-center justify-between gap-3 mb-4 px-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search files…"
                className="pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 shadow-sm w-56 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center bg-white border border-slate-200/60 rounded-xl shadow-sm p-1">
              <button onClick={() => setView("grid")}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"}`}>
                <Grid3x3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setView("list")}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900"}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {media.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
            <Image className="w-12 h-12 text-slate-200 mb-4" strokeWidth={1.5} />
            <p className="text-[15px] font-bold text-slate-400 mb-2">No images uploaded yet</p>
            <p className="text-[13px] text-slate-300 mb-6">Drop images in the zone above or click Upload</p>
          </div>
        )}

        {/* ── No search results ── */}
        {media.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-[13px] font-bold text-slate-400">No files match "{search}"</p>
          </div>
        )}

        {/* ── Grid ── */}
        {filtered.length > 0 && view === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                selected={selected.includes(item.id)}
                onSelect={() => toggleSelect(item.id)}
                onDelete={onDelete}
                onPreview={setPreview}
              />
            ))}
          </div>
        )}

        {/* ── List ── */}
        {filtered.length > 0 && view === "list" && (
          <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-12 shrink-0" />
              <div className="flex-1">File Name</div>
              <div className="w-20 text-center">Size</div>
              <div className="w-24">Dimensions</div>
              <div className="w-24 text-right">Uploaded</div>
              <div className="w-14" />
            </div>
            {filtered.map(item => (
              <MediaRow
                key={item.id}
                item={item}
                selected={selected.includes(item.id)}
                onSelect={() => toggleSelect(item.id)}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-[12px] font-bold text-slate-400 mt-4 px-1">
            {filtered.length} file{filtered.length !== 1 ? "s" : ""}
            {selected.length > 0 && ` · ${selected.length} selected`}
          </p>
        )}
      </div>
    </>
  );
}
