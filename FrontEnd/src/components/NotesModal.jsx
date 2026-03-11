import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { X } from "lucide-react";

const NotesModal = ({ isOpen, onClose, problemId }) => {
  const [notes, setNotes] = useState("");

  // Load notes from local storage when open
  useEffect(() => {
    if (isOpen) {
      const savedNotes = localStorage.getItem(`notes_${problemId}`);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes("");
      }
    }
  }, [isOpen, problemId]);

  // Save notes on change
  const handleChange = (content) => {
    setNotes(content);
    localStorage.setItem(`notes_${problemId}`, content);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111113] w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#3e3e42] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3e3e42] bg-[#1b1b1f]">
          <h2 className="text-xl font-bold text-gray-200">My Notes</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#3e3e42] rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 bg-[#111113] text-gray-100 overflow-hidden flex flex-col quill-dark-theme">
          <ReactQuill
            theme="snow"
            value={notes}
            onChange={handleChange}
            className="h-full flex flex-col"
            placeholder="Write your notes for this problem here... (Supports rich text)"
          />
        </div>
      </div>

      {/* Required style overrides for Quill in dark mode */}
      <style>{`
        .quill-dark-theme .ql-toolbar {
          background: #1b1b1f;
          border-color: #3e3e42;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .quill-dark-theme .ql-container {
          border-color: #3e3e42;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .quill-dark-theme .ql-editor {
          flex-grow: 1;
          color: #e5e7eb;
          font-size: 15px;
          min-height: 200px;
        }
        .quill-dark-theme .ql-stroke {
          stroke: #9ca3af;
        }
        .quill-dark-theme .ql-fill {
          fill: #9ca3af;
        }
        .quill-dark-theme .ql-picker-label {
          color: #9ca3af;
        }
        .quill-dark-theme .ql-picker-options {
          background-color: #1b1b1f;
          border-color: #3e3e42;
        }
        .quill-dark-theme .ql-picker-item {
          color: #9ca3af;
        }
        .quill-dark-theme .ql-picker-item:hover {
          color: #fff;
        }
        .quill-dark-theme .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: #3e3e42;
        }
      `}</style>
    </div>
  );
};

export default NotesModal;
