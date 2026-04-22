"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Settings, Briefcase, MapPin, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormProps {
  onOptimizeStart: () => void;
  onOptimizeComplete: (data: any) => void;
  onError: () => void;
}

export default function ResumeOptimizerForm({ onOptimizeStart, onOptimizeComplete, onError }: FormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [country, setCountry] = useState("India");
  const [mode, setMode] = useState("FRESHER");
  const [extraInput, setExtraInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countries = ["India", "United Kingdom", "Germany", "Spain", "Norway", "United States", "Other"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jd) {
      alert("Please upload a resume and provide a job description.");
      return;
    }

    onOptimizeStart();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);
    formData.append("country", country);
    formData.append("mode", mode);
    if (extraInput) {
      formData.append("extra_input", extraInput);
    }

    try {
      const res = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Optimization failed");
      }

      const result = await res.json();
      if (result.success) {
        onOptimizeComplete(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred during optimization.");
      onError();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
      
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-purple-400" />
        Configuration
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-grow">
        
        {/* File Upload */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            file ? "border-green-400/50 bg-green-400/5" : "border-slate-600 hover:border-blue-400/50 hover:bg-blue-400/5"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx"
          />
          {file ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">Click to change</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-blue-400 mb-2" />
              <p className="text-sm font-medium text-slate-300">Upload Resume (PDF/DOCX)</p>
              <p className="text-xs text-slate-500 mt-1">Drag and drop or click to browse</p>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Job Description *
          </label>
          <textarea 
            required
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
            placeholder="Paste the target job description here..."
          />
        </div>

        {/* Target Country & Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Target Country
            </label>
            <select 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Settings className="w-4 h-4 text-purple-400" />
              Experience Level
            </label>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="FRESHER">Fresher</option>
              <option value="EXPERIENCED">Experienced</option>
            </select>
          </div>
        </div>

        {/* Extra Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Extra Information (Optional)
          </label>
          <textarea 
            value={extraInput}
            onChange={(e) => setExtraInput(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-20"
            placeholder="Any extra achievements, projects, or notes to include..."
          />
        </div>

        <button 
          type="submit"
          className="mt-auto w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25"
        >
          Optimize Resume
        </button>

      </form>
    </div>
  );
}
