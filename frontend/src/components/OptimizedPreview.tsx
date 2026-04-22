"use client";

import { useState } from "react";
import { Download, FileJson, FileText, Check } from "lucide-react";
import { motion } from "framer-motion";

interface PreviewProps {
  data: any;
}

export default function OptimizedPreview({ data }: PreviewProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("http://localhost:8000/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume_data: data }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const result = await res.json();
      if (result.success && result.pdf_base64) {
        // Decode base64 and trigger download
        const linkSource = `data:application/pdf;base64,${result.pdf_base64}`;
        const downloadLink = document.createElement("a");
        const fileName = `${data.name ? data.name.replace(/\s+/g, "_") : "Optimized"}_Resume.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col relative overflow-hidden border border-slate-700/50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "visual" ? "bg-blue-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Visual Preview
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "json" ? "bg-purple-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileJson className="w-4 h-4" /> JSON
          </button>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            downloaded 
              ? "bg-green-500 text-white" 
              : "bg-white text-slate-900 hover:bg-blue-50"
          }`}
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : downloaded ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Generating..." : downloaded ? "Downloaded!" : "Download PDF"}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === "json" ? (
          <motion.pre 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-950 p-4 rounded-xl text-xs sm:text-sm text-green-400 font-mono overflow-x-auto"
          >
            {JSON.stringify(data, null, 2)}
          </motion.pre>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white text-slate-900 p-8 rounded-xl shadow-inner min-h-[600px]"
          >
            <h1 className="text-3xl font-serif text-center mb-1">{data.name}</h1>
            <p className="text-center text-slate-600 text-sm mb-6">{data.contact}</p>

            {data.summary && (
              <div className="mb-6">
                <p className="text-sm leading-relaxed">{data.summary}</p>
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 border-slate-200 mb-3 pb-1 uppercase tracking-wider text-slate-800">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, i: number) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.experience && data.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 border-slate-200 mb-3 pb-1 uppercase tracking-wider text-slate-800">Experience</h2>
                {data.experience.map((exp: any, i: number) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-slate-800">{exp.role}</h3>
                        <p className="text-slate-600 font-medium text-sm">{exp.company}</p>
                      </div>
                      <span className="text-slate-500 text-xs font-medium bg-slate-50 px-2 py-1 rounded">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-2 text-sm text-slate-700 space-y-1">
                      {exp.points.map((pt: string, j: number) => (
                        <li key={j} className="pl-1">{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {data.projects && data.projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 border-slate-200 mb-3 pb-1 uppercase tracking-wider text-slate-800">Projects</h2>
                {data.projects.map((proj: any, i: number) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-bold text-slate-800 mb-2">{proj.name}</h3>
                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                      {proj.points.map((pt: string, j: number) => (
                        <li key={j} className="pl-1">{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {data.education && data.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold border-b-2 border-slate-200 mb-3 pb-1 uppercase tracking-wider text-slate-800">Education</h2>
                {data.education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                      <p className="text-slate-600 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-slate-500 text-xs bg-slate-50 px-2 py-1 rounded">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}
