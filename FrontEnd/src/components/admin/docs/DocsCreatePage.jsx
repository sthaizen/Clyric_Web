import React, { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  ChevronDown, ChevronUp, Plus, Trash2, GripVertical, Save,
  Globe, Image, X, Code2, FileText, HelpCircle,
  ArrowLeft, Upload, ToggleLeft, ToggleRight, Loader2
} from "lucide-react";
import { docsApi } from "../../../api/docsApi";
import toast from "react-hot-toast";
import { DocsRichText } from "./DocsRichText";

// ─── Section Types (Code, Image, FAQ only) ─────────────────────────────────────
const SECTION_TYPES = [
  { value: "text",  label: "Text Block", icon: FileText,   desc: "Rich text content" },
  { value: "code",  label: "Code Block", icon: Code2,      desc: "Syntax-highlighted code" },
  { value: "image", label: "Image",      icon: Image,      desc: "Image with caption" },
  { value: "faq",   label: "FAQ",        icon: HelpCircle, desc: "Q&A pairs" },
];

const CALLOUT_VARIANTS = ["info", "warning", "tip", "success"];
const CODE_LANGS = ["bash", "javascript", "typescript", "python", "json", "yaml", "sql", "html", "css"];

const genId = () => Math.random().toString(36).substr(2, 9);
const autoSlug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const createSection = (type) => {
  const base = { id: genId(), type, heading: "" };
  switch (type) {
    case "text":    return { ...base, content: "" };
    case "steps":   return { ...base, steps: [{ id: genId(), title: "", content: "" }] };
    case "callout": return { ...base, calloutType: "info", title: "", content: "" };
    case "code":    return { ...base, language: "bash", code: "" };
    case "image":   return { ...base, imageUrl: "", imageFile: null, caption: "", altText: "" };
    case "faq":     return { ...base, faqs: [{ id: genId(), question: "", answer: "" }] };
    default:        return base;
  }
};

// ─── Field Components ───────────────────────────────────────────────────────────
const Inp = ({ value, onChange, placeholder, mono, className = "" }) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    className={`w-full px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all ${mono ? "font-mono text-slate-700" : "font-bold text-slate-900"} ${className}`}
  />
);

const Txt = ({ value, onChange, placeholder, rows = 4, mono }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    className={`w-full px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all resize-none leading-relaxed ${mono ? "font-mono text-slate-100 bg-slate-900 border-slate-700 focus:border-slate-500 placeholder:text-slate-600" : "font-medium text-slate-700"}`}
  />
);

const Sel = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    className="w-full px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 focus:outline-none focus:border-slate-400 transition-all"
  >
    {children}
  </select>
);

const Lbl = ({ children, required, icon: Icon }) => (
  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 cursor-default group-hover:text-slate-600 transition-colors">
    {Icon && <Icon className="w-3.5 h-3.5 mb-0.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" strokeWidth={2.5} />}
    {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
  </label>
);

// ─── Section Editors ───────────────────────────────────────────────────────────
const TextEditor = ({ s, onChange }) => (
  <div className="space-y-3">
    <div><Lbl>Section Heading</Lbl><Inp value={s.heading} onChange={e => onChange({ ...s, heading: e.target.value })} placeholder="e.g. Overview" /></div>
    <div><Lbl required icon={FileText}>Content</Lbl><DocsRichText value={s.content} onChange={val => onChange({ ...s, content: val })} placeholder="Write your documentation content here…" /></div>
  </div>
);

const StepsEditor = ({ s, onChange }) => {
  const add = () => onChange({ ...s, steps: [...s.steps, { id: genId(), title: "", content: "" }] });
  const remove = (id) => onChange({ ...s, steps: s.steps.filter(x => x.id !== id) });
  const upd = (id, patch) => onChange({ ...s, steps: s.steps.map(x => x.id === id ? { ...x, ...patch } : x) });
  return (
    <div className="space-y-3">
      <div><Lbl>Section Heading</Lbl><Inp value={s.heading} onChange={e => onChange({ ...s, heading: e.target.value })} placeholder="e.g. Installation" /></div>
      {s.steps.map((step, i) => (
        <div key={step.id} className="flex gap-3 bg-slate-50/60 rounded-xl p-4 border border-slate-100">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-1">{i + 1}</div>
          <div className="flex-1 space-y-2">
            <Inp value={step.title} onChange={e => upd(step.id, { title: e.target.value })} placeholder="Step title" />
            <Txt value={step.content} onChange={e => upd(step.id, { content: e.target.value })} placeholder="Step description…" rows={2} />
          </div>
          {s.steps.length > 1 && (
            <button onClick={() => remove(step.id)} className="text-slate-300 hover:text-rose-500 transition-colors mt-1"><Trash2 className="w-4 h-4" /></button>
          )}
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-900 transition-colors"><Plus className="w-4 h-4" /> Add Step</button>
    </div>
  );
};

const CalloutEditor = ({ s, onChange }) => (
  <div className="space-y-3">
    <div className="flex gap-2">
      {CALLOUT_VARIANTS.map(v => (
        <button key={v} onClick={() => onChange({ ...s, calloutType: v })}
          className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold capitalize border transition-all ${s.calloutType === v ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900"}`}
        >{v}</button>
      ))}
    </div>
    <Inp value={s.title} onChange={e => onChange({ ...s, title: e.target.value })} placeholder="Callout title (optional)" />
    <Txt value={s.content} onChange={e => onChange({ ...s, content: e.target.value })} placeholder="Callout message…" rows={3} />
  </div>
);

const CodeEditor = ({ s, onChange }) => (
  <div className="space-y-3">
    <div className="flex gap-3">
      <div className="flex-1"><Lbl>Heading</Lbl><Inp value={s.heading} onChange={e => onChange({ ...s, heading: e.target.value })} placeholder="e.g. Install dependencies" /></div>
      <div className="w-36">
        <Lbl>Language</Lbl>
        <Sel value={s.language} onChange={e => onChange({ ...s, language: e.target.value })}>
          {CODE_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
        </Sel>
      </div>
    </div>
    <div>
      <Lbl required icon={Code2}>Code</Lbl>
      <div className="rounded-xl overflow-hidden border border-slate-200/60" style={{ minHeight: 200 }}>
        <MonacoEditor
          height={260}
          language={s.language === "bash" ? "shell" : s.language}
          value={s.code}
          theme="vs-dark"
          onChange={(val) => onChange({ ...s, code: val || "" })}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: "on",
            folding: false,
            padding: { top: 10, bottom: 10 },
            scrollbar: { vertical: "auto", horizontal: "auto" },
          }}
        />
      </div>
    </div>
  </div>
);


const ImageUploadEditor = ({ s, onChange }) => {
  const fileRef = useRef();
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setIsUploading(true);
      const res = await docsApi.uploadImage(file);
      onChange({ ...s, imageUrl: res.url, imageFile: null });
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div><Lbl>Section Heading</Lbl><Inp value={s.heading} onChange={e => onChange({ ...s, heading: e.target.value })} placeholder="e.g. Dashboard screenshot" /></div>

      <input type="file" accept="image/*" ref={fileRef} className="hidden"
        onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
      />

      {s.imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200">
          <img src={s.imageUrl} alt={s.altText || "Preview"} className="w-full max-h-56 object-contain bg-slate-50" />
          <button
            onClick={() => onChange({ ...s, imageUrl: "", imageFile: null })}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileRef.current.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); if (!isUploading) handleFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 transition-all ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" strokeWidth={1.5} />
          ) : (
            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
          )}
          <p className="text-[13px] font-bold text-slate-400">
            {isUploading ? "Uploading to Cloudinary..." : "Click or drag image to upload"}
          </p>
          <p className="text-[11px] text-slate-300 mt-1">PNG, JPG, WEBP, SVG · Max 10 MB</p>
        </div>
      )}

      <Inp value={s.caption} onChange={e => onChange({ ...s, caption: e.target.value })} placeholder="Caption shown under the image" />
      <Inp value={s.altText} onChange={e => onChange({ ...s, altText: e.target.value })} placeholder="Alt text for accessibility" />
    </div>
  );
};

const FaqEditor = ({ s, onChange }) => {
  const add = () => onChange({ ...s, faqs: [...s.faqs, { id: genId(), question: "", answer: "" }] });
  const remove = (id) => onChange({ ...s, faqs: s.faqs.filter(f => f.id !== id) });
  const upd = (id, patch) => onChange({ ...s, faqs: s.faqs.map(f => f.id === id ? { ...f, ...patch } : f) });
  return (
    <div className="space-y-3">
      <div><Lbl>Section Heading</Lbl><Inp value={s.heading} onChange={e => onChange({ ...s, heading: e.target.value })} placeholder="e.g. Frequently Asked Questions" /></div>
      {s.faqs.map((faq, i) => (
        <div key={faq.id} className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Q{i + 1}</span>
            {s.faqs.length > 1 && <button onClick={() => remove(faq.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
          <Inp value={faq.question} onChange={e => upd(faq.id, { question: e.target.value })} placeholder="Question" />
          <Txt value={faq.answer} onChange={e => upd(faq.id, { answer: e.target.value })} placeholder="Answer" rows={2} />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-900 transition-colors"><Plus className="w-4 h-4" /> Add FAQ Item</button>
    </div>
  );
};

const renderEditor = (s, onChange) => {
  switch (s.type) {
    case "text":    return <TextEditor    s={s} onChange={onChange} />;
    case "steps":   return <StepsEditor   s={s} onChange={onChange} />;
    case "callout": return <CalloutEditor s={s} onChange={onChange} />;
    case "code":    return <CodeEditor    s={s} onChange={onChange} />;
    case "image":   return <ImageUploadEditor s={s} onChange={onChange} />;
    case "faq":     return <FaqEditor     s={s} onChange={onChange} />;
    default: return null;
  }
};

// ─── Section Card ───────────────────────────────────────────────────────────────
const SectionCard = ({ section, index, isFirst, isLast, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [open, setOpen] = useState(true);
  const t = SECTION_TYPES.find(x => x.value === section.type);
  const Icon = t?.icon || FileText;
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm group">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 border-b border-slate-100">
        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
        <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-900">{t?.label}</p>
          {section.heading && <p className="text-[11px] text-slate-400 truncate">{section.heading}</p>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onMoveUp} disabled={isFirst} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button onClick={onMoveDown} disabled={isLast} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-500 ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
        <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {open && <div className="p-5">{renderEditor(section, onUpdate)}</div>}
    </div>
  );
};

// ─── Add Section Picker ─────────────────────────────────────────────────────────
const AddSectionPicker = ({ onAdd, isCentered }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`${isCentered ? "px-6 py-2.5 bg-slate-900 text-white" : "w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50/50"} flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold transition-all shadow-sm`}
      >
        <Plus className="w-4 h-4" /> Add {isCentered ? "First Section" : "Section"}
      </button>
      {open && (
        <div className={`absolute bottom-full left-0 right-0 mb-3 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-20 ${isCentered ? "w-[400px] left-1/2 -translate-x-1/2" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Select Section Type</p>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button key={type.value}
                  onClick={() => { onAdd(type.value); setOpen(false); }}
                  className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all text-left group/picker"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover/picker:text-indigo-500" strokeWidth={2.5} />
                  <span className="text-[13px] font-bold text-slate-900">{type.label}</span>
                  <span className="text-[11px] text-slate-400 leading-tight">{type.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ... keep main comp ...

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function DocsCreatePage({ categories = [], editDoc = null, onSave, onNavigate }) {
  const isEdit = !!editDoc;
  const TABS = ["content", "seo", "settings"];

  const [form, setForm] = useState({
    title:      editDoc?.title      || "",
    slug:       editDoc?.slug       || "",
    category:   editDoc?.category   || (categories[0]?.name || ""),
    shortDesc:  editDoc?.shortDesc  || "",
    difficulty: editDoc?.difficulty || "Beginner",
    sortOrder:  editDoc?.sortOrder  || "",
    metaTitle:  editDoc?.metaTitle  || "",
    metaDesc:   editDoc?.metaDesc   || "",
    status:     editDoc?.status     || "draft",
  });
  const [sections, setSections] = useState(editDoc?.sections || []);
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const upd = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!isEdit || !form.slug) upd({ title, slug: autoSlug(title) });
    else upd({ title });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim())  e.slug  = "Slug is required";
    if (!form.category)     e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const doc = {
      ...(editDoc || {}),
      ...form,
      status: publish ? "published" : form.status,
      sections,
    };
    onSave(doc);
    setSaving(false);
  };

  const addSection = (type) => setSections(prev => [...prev, createSection(type)]);
  const updateSection = (id, data) => setSections(prev => prev.map(s => s.id === id ? data : s));
  const deleteSection = (id) => setSections(prev => prev.filter(s => s.id !== id));
  const moveSection = (id, dir) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((dir === "up" && idx === 0) || (dir === "down" && idx === prev.length - 1)) return prev;
      const arr = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  const hasError = (key) => errors[key] ? "border-red-400 ring-2 ring-red-100" : "";

  return (
    <div className="flex flex-col pb-10">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("docs-list")} className="w-9 h-9 border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">{isEdit ? "Edit Document" : "Create New Document"}</h2>
            <p className="text-[12px] text-slate-400 font-mono mt-0.5">
              /docs/{form.slug || "…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status toggle */}
          <button
            onClick={() => upd({ status: form.status === "published" ? "draft" : "published" })}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/60 rounded-xl shadow-sm"
          >
            {form.status === "published"
              ? <ToggleRight className="w-5 h-5 text-emerald-500" />
              : <ToggleLeft className="w-5 h-5 text-slate-300" />
            }
            <span className={`text-[12px] font-black ${form.status === "published" ? "text-emerald-600" : "text-slate-400"}`}>
              {form.status === "published" ? "Published" : "Draft"}
            </span>
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm disabled:opacity-60"
          >
            <Globe className="w-3.5 h-3.5" strokeWidth={2} />
            Publish
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="flex items-center bg-white border border-slate-200/60 rounded-xl shadow-sm p-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >{tab}</button>
          ))}
        </div>
        <span className="text-[12px] font-bold text-slate-400 ml-2">{sections.length} section{sections.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Validation errors ── */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-5 px-1 py-3 bg-red-50 border border-red-200 rounded-2xl flex gap-3 items-start px-4">
          <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="text-[13px] font-bold text-red-700">
            {Object.values(errors).join(" · ")}
          </div>
        </div>
      )}

      {/* ── Editor Grid ── */}
      <div className="grid grid-cols-[1fr_280px] gap-6 px-1 items-start">

        {/* Left */}
        <div className="space-y-4">

          {activeTab === "content" && (
            <>
              {/* Page details */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-[14px] font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                  Page Details
                </h3>
                <div>
                  <Lbl required>Page Title</Lbl>
                  <Inp value={form.title} onChange={handleTitleChange} placeholder="e.g. Getting Started with Clyric" className={hasError("title")} />
                </div>
                <div>
                  <Lbl required>URL Slug</Lbl>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-slate-400 shrink-0 bg-slate-50 px-2 py-2.5 rounded-xl border border-slate-200/60">/docs/</span>
                    <Inp value={form.slug} onChange={e => upd({ slug: e.target.value })} placeholder="getting-started" mono className={hasError("slug")} />
                  </div>
                </div>
                <div className="group">
                  <Lbl icon={FileText}>Short Description</Lbl>
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 focus-within:bg-white focus-within:border-slate-200 focus-within:shadow-sm transition-all">
                    <DocsRichText value={form.shortDesc} onChange={val => upd({ shortDesc: val })} placeholder="1–2 sentence summary shown in listings and article subtitle." />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[15px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Content Sections
                    {sections.length > 0 && (
                      <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100">
                        {sections.length}
                      </span>
                    )}
                  </h3>
                  {sections.length > 0 && (
                    <span className="text-[11px] font-bold text-slate-400 capitalize">
                      {sections.length === 1 ? "document part" : "structured blocks"}
                    </span>
                  )}
                </div>

                {sections.length === 0 ? (
                  <div className="relative group overflow-hidden flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-slate-200 rounded-[32px] bg-white transition-all hover:border-indigo-200">
                    {/* Decorative background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-50 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                        <FileText className="w-8 h-8 text-slate-200 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                      </div>
                      <h4 className="text-[16px] font-black text-slate-900 mb-2">No content sections yet</h4>
                      <p className="text-[13px] text-slate-400 max-w-[240px] leading-relaxed mb-8">
                        Break your documentation into manageable blocks of text, code, or images.
                      </p>
                      <AddSectionPicker onAdd={addSection} isCentered={true} />
                    </div>
                  </div>
                ) : (
                  <>
                    {sections.map((section, idx) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        index={idx}
                        isFirst={idx === 0}
                        isLast={idx === sections.length - 1}
                        onUpdate={(data) => updateSection(section.id, data)}
                        onDelete={() => deleteSection(section.id)}
                        onMoveUp={() => moveSection(section.id, "up")}
                        onMoveDown={() => moveSection(section.id, "down")}
                      />
                    ))}
                    <div className="pt-2">
                       <AddSectionPicker onAdd={addSection} />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {activeTab === "seo" && (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-[13px] font-bold text-slate-900 pb-3 border-b border-slate-100">SEO Metadata</h3>
              <div>
                <Lbl>Meta Title</Lbl>
                <Inp value={form.metaTitle} onChange={e => upd({ metaTitle: e.target.value })} placeholder="Defaults to page title if empty" />
                <p className="text-[11px] text-slate-300 mt-1">{form.metaTitle.length}/60</p>
              </div>
              <div>
                <Lbl>Meta Description</Lbl>
                <Txt value={form.metaDesc} onChange={e => upd({ metaDesc: e.target.value })} placeholder="150–160 character description for search engines." rows={4} />
                <p className="text-[11px] text-slate-300 mt-1">{form.metaDesc.length}/160</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Search Preview</p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <p className="text-[11px] text-slate-400 mb-1">clyric.dev/docs/{form.slug || "page-slug"}</p>
                  <p className="text-[16px] font-bold text-[#1a0dab]">{form.metaTitle || form.title || "Page Title"}</p>
                  <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{form.metaDesc || form.shortDesc || "Meta description will appear here…"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-[13px] font-bold text-slate-900 pb-3 border-b border-slate-100">Advanced Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Lbl>Sort Order</Lbl>
                  <Inp value={form.sortOrder} onChange={e => upd({ sortOrder: e.target.value })} placeholder="1" />
                  <p className="text-[11px] text-slate-300 mt-1.5">Lower = appears first in sidebar</p>
                </div>
                <div>
                  <Lbl>Visibility</Lbl>
                  <Sel value={form.status} onChange={e => upd({ status: e.target.value })}>
                    <option value="draft">Draft (hidden from public)</option>
                    <option value="published">Published (visible to all)</option>
                  </Sel>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sticky top-4">

          {/* Publish */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-4">Publish Settings</p>
            <div className="space-y-4">
              <div>
                <Lbl required>Category</Lbl>
                {categories.length === 0 ? (
                  <div className="py-2.5 px-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] font-bold text-amber-600">
                    No categories yet — <button onClick={() => onNavigate("docs-categories")} className="underline">add one</button>
                  </div>
                ) : (
                  <Sel value={form.category} onChange={e => upd({ category: e.target.value })} className={hasError("category")}>
                    {categories.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                  </Sel>
                )}
              </div>

              <div>
                <Lbl>Difficulty</Lbl>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map(d => (
                    <button key={d} onClick={() => upd({ difficulty: d })}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        form.difficulty === d
                          ? d === "Beginner" ? "bg-green-500 text-white border-green-500"
                          : d === "Intermediate" ? "bg-orange-400 text-white border-orange-400"
                          : "bg-red-500 text-white border-red-500"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button onClick={() => handleSave(true)} disabled={saving}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all disabled:opacity-60"
                >
                  {saving ? "Publishing…" : "Publish Now"}
                </button>
                <button onClick={() => handleSave(false)} disabled={saving}
                  className="w-full py-2.5 bg-slate-50 border border-slate-200/60 text-slate-700 rounded-xl text-[13px] font-bold hover:bg-slate-100 transition-all disabled:opacity-60"
                >
                  Save as Draft
                </button>
                <button onClick={() => onNavigate("docs-list")}
                  className="w-full py-2 text-slate-400 text-[12px] font-bold hover:text-slate-600 transition-colors"
                >
                  Discard & go back
                </button>
              </div>
            </div>
          </div>

          {/* Section summary */}
          {sections.length > 0 && (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Section Summary</p>
              <div className="space-y-2">
                {sections.map((s, i) => {
                  const t = SECTION_TYPES.find(x => x.value === s.type);
                  const Icon = t?.icon || FileText;
                  return (
                    <div key={s._id || s.id} className="flex items-center gap-2.5">
                      <span className="text-[10px] font-black text-slate-300 w-4">{i + 1}</span>
                      <Icon className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                      <span className="text-[12px] font-bold text-slate-600 truncate flex-1">
                        {s.heading || t?.label || "Untitled"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
