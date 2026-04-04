eact from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "code-block",
];

export const DocsRichText = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/60 overflow-hidden 
      [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200/60 [&_.ql-toolbar]:bg-slate-50/50 
      [&_.ql-container]:border-none [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-[13px] [&_.ql-editor]:text-slate-700 
      [&_.ql-editor.ql-blank::before]:text-slate-300 [&_.ql-editor.ql-blank::before]:font-medium transition-all ${className}`}
    >
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};
