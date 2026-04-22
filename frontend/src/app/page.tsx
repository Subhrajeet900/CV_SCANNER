"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeOptimizerForm from "@/components/ResumeOptimizerForm";
import OptimizedPreview from "@/components/OptimizedPreview";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AI Resume Engine
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Upload your resume, paste the job description, and let our intelligent engine tailor your profile to perfection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`transition-all duration-500 ${
              optimizedData ? "lg:col-span-4" : "lg:col-span-8 lg:col-start-3"
            }`}
          >
            <ResumeOptimizerForm 
              onOptimizeStart={() => setIsOptimizing(true)} 
              onOptimizeComplete={(data) => {
                setOptimizedData(data);
                setIsOptimizing(false);
              }} 
              onError={() => setIsOptimizing(false)}
            />
          </motion.div>

          <AnimatePresence>
            {optimizedData && (
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-8 h-full"
              >
                <OptimizedPreview data={optimizedData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isOptimizing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-xl font-medium text-white tracking-wide animate-pulse">
                Optimizing your resume...
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Analyzing gap, matching JD, and applying country rules.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
