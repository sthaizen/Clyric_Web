import React, { useState } from "react";
import { X, LayoutTemplate, Code2, Keyboard, Beaker, Timer } from "lucide-react";

// 1. Moved static data outside the component to prevent recreation on every render
const TABS = [

  { name: "Code Editor", icon: <Code2 className="w-4 h-4" /> },

];

// 2. Created reusable sub-components to DRY up the code
const SettingRow = ({ label, children }) => (
  <div className="flex justify-between items-center">
    <span className="text-[14px] font-medium text-white">{label}</span>
    {children}
  </div>
);

const SelectControl = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-[#3e3e42]/50 text-white text-[13px] px-3 py-1.5 rounded outline-none border border-transparent focus:border-gray-500 cursor-pointer w-[140px]"
  >
    {options.map((opt) => (
      <option key={opt.value ?? opt} value={opt.value ?? opt}>
        {opt.label ?? opt}
      </option>
    ))}
  </select>
);

// 3. Fixed accessibility and removed inline styles in favor of pure Tailwind
const ToggleSwitch = ({ isOn, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors focus:outline-none ${
      isOn ? "bg-blue-500" : "bg-[#3e3e42]/50"
    }`}
  >
    <div
      className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
        isOn ? "translate-x-[20px]" : "translate-x-0"
      }`}
    />
  </button>
);

export default function SettingsModal({ isOpen, onClose, settings, setSettings }) {
  const [activeTab, setActiveTab] = useState("Code Editor");

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    // Removed backdrop-blur-sm, slightly darkened background to black/60 for good contrast
    <div className="fixed inset-0 z-[100] flex items-center justify-center ">
      <div className="w-[700px] h-[450px] bg-[#282828] rounded-xl shadow-2xl flex overflow-hidden border border-[#3e3e42]">
        
        {/* Sidebar */}
        <div className="w-[200px] bg-[#191919] border-r border-[#3e3e42] flex flex-col py-4 shrink-0">
          <h2 className="text-xl font-bold text-white px-6 mb-6">Settings</h2>
          <nav className="flex flex-col gap-1 px-2">
            {TABS.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  activeTab === tab.name
                    ? "bg-[#3e3e42]/50 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#3e3e42]/50"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#191919] p-6 relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>

          {activeTab === "Code Editor" ? (
            <div className="flex flex-col gap-6 mt-10">
              
              <SettingRow label="Font">
                <SelectControl
                  value={settings.fontFamily}
                  onChange={(val) => handleChange("fontFamily", val)}
                  options={["Default", "Consolas", "JetBrains Mono", "Fira Code"]}
                />
              </SettingRow>

              <SettingRow label="Font size">
                <SelectControl
                  value={settings.fontSize}
                  onChange={(val) => handleChange("fontSize", parseInt(val))}
                  options={[
                    { label: "12px", value: 12 },
                    { label: "13px", value: 13 },
                    { label: "14px", value: 14 },
                    { label: "15px", value: 15 },
                    { label: "16px", value: 16 },
                    { label: "18px", value: 18 },
                    { label: "20px", value: 20 },
                  ]}
                />
              </SettingRow>

              <SettingRow label="Font ligatures">
                <ToggleSwitch
                  isOn={settings.fontLigatures}
                  onToggle={() => handleChange("fontLigatures", !settings.fontLigatures)}
                />
              </SettingRow>

              <SettingRow label="Key binding">
                <SelectControl
                  value={settings.keyBinding}
                  onChange={(val) => handleChange("keyBinding", val)}
                  options={["Standard", "Vim", "Emacs"]}
                />
              </SettingRow>

              <SettingRow label="Tab size">
                <SelectControl
                  value={settings.tabSize}
                  onChange={(val) => handleChange("tabSize", parseInt(val))}
                  options={[
                    { label: "2 spaces", value: 2 },
                    { label: "4 spaces", value: 4 },
                    { label: "8 spaces", value: 8 },
                  ]}
                />
              </SettingRow>

              <SettingRow label="Word Wrap">
                <ToggleSwitch
                  isOn={settings.wordWrap}
                  onToggle={() => handleChange("wordWrap", !settings.wordWrap)}
                />
              </SettingRow>

              <SettingRow label="Relative Line Number">
                <ToggleSwitch
                  isOn={settings.relativeLineNumbers}
                  onToggle={() => handleChange("relativeLineNumbers", !settings.relativeLineNumbers)}
                />
              </SettingRow>

            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              {activeTab} settings coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}