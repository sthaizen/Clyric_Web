import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const defaultForm = {
  slug: "",
  title: "",
  difficulty: "Easy",
  descriptionText: "",
  categoryDisplay: "",
  notes: [],
  constraints: [],
  examples: [{ input: "", output: "", explanation: "" }],
  starterCode: {
    javascript: "function solution() {\n  \n}",
    python: "def solution():\n  pass",
    java: "class Solution {\n  public void solution() {\n    \n  }\n}",
    cpp: "class Solution {\npublic:\n  void solution() {\n    \n  }\n};"
  },
  expectedOutput: {
    javascript: "",
    python: "",
    java: "",
    cpp: ""
  }
};

export default function ProblemFormModal({ isOpen, onClose, onSubmit, initialData, isPending }) {
  const [form, setForm] = useState(defaultForm);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        descriptionText: initialData.description?.text || "",
        examples: initialData.examples?.length > 0 ? initialData.examples : defaultForm.examples,
        constraints: initialData.constraints?.length > 0 ? initialData.constraints : defaultForm.constraints,
        starterCode: { ...defaultForm.starterCode, ...(initialData.starterCode || {}) },
        expectedOutput: { ...defaultForm.expectedOutput, ...(initialData.expectedOutput || {}) }
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  const formRef = useRef(null);

  const canGoNext = () => {
    if (activeTab === "basic") {
      if (!form.slug || !form.title || !form.descriptionText) {
        toast.error("Please fill all required basic information");
        return false;
      }
    }
    if (activeTab === "technical") {
      const hasEmptyExample = form.examples.some(ex => !ex.input || !ex.output);
      if (hasEmptyExample) {
        toast.error("All examples must have an input and output");
        return false;
      }
    }
    return true;
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Final validation across all tabs
    if (!form.slug || !form.title || !form.descriptionText) {
      setActiveTab("basic");
      toast.error("Basic information is incomplete");
      return;
    }

    const payload = {
      slug: form.slug,
      title: form.title,
      difficulty: form.difficulty,
      categoryDisplay: form.categoryDisplay,
      description: { text: form.descriptionText },
      examples: form.examples,
      constraints: form.constraints.filter(c => c.trim() !== ""),
      starterCode: form.starterCode,
      expectedOutput: form.expectedOutput
    };
    onSubmit(payload);
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    
    if (activeTab === "basic") setActiveTab("technical");
    else if (activeTab === "technical") setActiveTab("code");
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-[18px] text-[#18181B] font-bold tracking-tight">
            {initialData ? "Edit Problem" : "Create New Problem"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition text-gray-400 hover:text-[#18181B]">
            <X strokeWidth={2.5} className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-6 pt-4 space-x-6 border-b border-gray-100 bg-white">
          <button 
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`pb-3 text-[13px] font-bold tracking-tight uppercase transition-colors relative ${activeTab === "basic" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            Basic Info
            {activeTab === "basic" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("technical")}
            className={`pb-3 text-[13px] font-bold tracking-tight uppercase transition-colors relative ${activeTab === "technical" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            Technical Details
            {activeTab === "technical" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("code")}
            className={`pb-3 text-[13px] font-bold tracking-tight uppercase transition-colors relative ${activeTab === "code" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            Code Settings
            {activeTab === "code" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-7 space-y-5 flex-1 overflow-y-auto transparent-scrollbar">
          
          <button type="submit" className="hidden" aria-hidden="true"></button>
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Problem Slug *</label>
                <input
                  required
                  value={form.slug}
                  disabled={!!initialData} // Usually bad to change slug after creation
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="two-sum"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#18181B] placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:bg-gray-50 disabled:text-gray-500 shadow-sm transition-shadow font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Two Sum"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#18181B] placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-sm transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Difficulty *</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#18181B] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-sm transition-shadow appearance-none cursor-pointer hover:bg-gray-50"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Category Display</label>
                <input
                  value={form.categoryDisplay}
                  onChange={(e) => setForm({ ...form, categoryDisplay: e.target.value })}
                  placeholder="Arrays & Hashing"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#18181B] placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-sm transition-shadow"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Description text *</label>
                <textarea
                  required
                  rows={8}
                  value={form.descriptionText}
                  onChange={(e) => setForm({ ...form, descriptionText: e.target.value })}
                  placeholder="Given an array of integers nums and an integer target..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-[#18181B] placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-sm transition-shadow resize-y"
                />
              </div>
            </div>
          )}

          {/* ----- TECHNICAL DETAILS TAB ----- */}
          {activeTab === "technical" && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              
              {/* Examples Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[13px] font-bold text-gray-900">Examples</h4>
                  <button type="button" onClick={() => setForm({ ...form, examples: [...form.examples, { input: "", output: "", explanation: "" }] })} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1">+ Add Example</button>
                </div>
                
                {form.examples.map((ex, index) => (
                  <div key={index} className="p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-4 relative group">
                    <button type="button" onClick={() => setForm({ ...form, examples: form.examples.filter((_, i) => i !== index) })} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input *</label>
                        <input required value={ex.input} onChange={(e) => { const newEx = [...form.examples]; newEx[index].input = e.target.value; setForm({ ...form, examples: newEx }); }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] font-mono focus:outline-none focus:border-indigo-400" placeholder="nums = [2,7,11,15], target = 9" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Output *</label>
                        <input required value={ex.output} onChange={(e) => { const newEx = [...form.examples]; newEx[index].output = e.target.value; setForm({ ...form, examples: newEx }); }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] font-mono focus:outline-none focus:border-indigo-400" placeholder="[0,1]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Explanation</label>
                      <input value={ex.explanation} onChange={(e) => { const newEx = [...form.examples]; newEx[index].explanation = e.target.value; setForm({ ...form, examples: newEx }); }} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:border-indigo-400" placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]." />
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[13px] font-bold text-gray-900">Constraints</h4>
                  <button type="button" onClick={() => setForm({ ...form, constraints: [...form.constraints, ""] })} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1">+ Add Constraint</button>
                </div>
                
                <div className="space-y-2">
                  {form.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        value={constraint} 
                        onChange={(e) => { const newC = [...form.constraints]; newC[index] = e.target.value; setForm({ ...form, constraints: newC }); }} 
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-mono focus:outline-none focus:border-indigo-400" 
                        placeholder="2 <= nums.length <= 10^4" 
                      />
                      <button type="button" onClick={() => setForm({ ...form, constraints: form.constraints.filter((_, i) => i !== index) })} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.constraints.length === 0 && <p className="text-sm text-gray-400 italic">No constraints added.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ----- CODE SETTINGS TAB ----- */}
          {activeTab === "code" && (
            <div className="grid grid-cols-2 gap-8 animate-in fade-in duration-200">
              {/* Javascript Configuration */}
              <div className="col-span-2 border border-yellow-200 bg-yellow-50/20 rounded-xl p-5 space-y-4">
                <h4 className="text-[13px] font-bold text-yellow-700 uppercase tracking-widest flex items-center gap-2">Javascript Config</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Starter Code</label>
                    <textarea value={form.starterCode.javascript || ""} onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, javascript: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Expected Output (Optional validation helper)</label>
                    <textarea value={form.expectedOutput.javascript || ""} onChange={(e) => setForm({ ...form, expectedOutput: { ...form.expectedOutput, javascript: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Python Configuration */}
              <div className="col-span-2 border border-blue-200 bg-blue-50/20 rounded-xl p-5 space-y-4">
                <h4 className="text-[13px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">Python Config</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Starter Code</label>
                    <textarea value={form.starterCode.python || ""} onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, python: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Expected Output</label>
                    <textarea value={form.expectedOutput.python || ""} onChange={(e) => setForm({ ...form, expectedOutput: { ...form.expectedOutput, python: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
              </div>

               {/* C++ Configuration */}
               <div className="col-span-2 border border-indigo-200 bg-indigo-50/20 rounded-xl p-5 space-y-4">
                <h4 className="text-[13px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">C++ Config</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Starter Code</label>
                    <textarea value={form.starterCode.cpp || ""} onChange={(e) => setForm({ ...form, starterCode: { ...form.starterCode, cpp: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Expected Output</label>
                    <textarea value={form.expectedOutput.cpp || ""} onChange={(e) => setForm({ ...form, expectedOutput: { ...form.expectedOutput, cpp: e.target.value } })} rows={5} className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] rounded-xl text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 mt-auto bg-gray-50/50 rounded-b-[28px]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-bold text-gray-500 hover:text-[#18181B] hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
          >
            Cancel
          </button>
          {activeTab !== "code" ? (
             <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full text-[13px] font-bold transition-all shadow-sm flex items-center gap-2"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[13px] font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isPending && <Loader2 strokeWidth={2.5} className="w-4 h-4 animate-spin" />}
              {initialData ? "Save All Changes" : "Create Official Problem"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
