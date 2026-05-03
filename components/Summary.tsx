"use client";

import React from 'react';
import { 
  AlertTriangle, 
  Activity, 
  FileText, 
  Zap, 
  CalendarClock, 
  Settings2, 
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type SummaryData = {
  summary: string;
  keyPoints: string[];
  risks: string[];
  importantDates: Record<string, string>; 
  rawTextLength: number;
};

const SummaryUI = ({ data }: { data: SummaryData }) => {
  const router = useRouter();
  
  const safeData = data || {
    summary: "No analysis available. Please upload a document to get started.",
    keyPoints: [],
    risks: [],
    importantDates: {},
    rawTextLength: 0
  };

  // Calculate character limit percentage for the visual bar
  const charLimit = 6000;
  const usagePercent = Math.min((safeData.rawTextLength / charLimit) * 100, 100);

  const handleExport = () => {
    if (!safeData) return;

    const dataStr = JSON.stringify(safeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                DocuChat <span className="text-blue-600">AI</span>
              </h1>
            </div>
          </div>

    <div className="flex items-center gap-3">
        <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 cursor-pointer text-sm font-semibold bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
        >
            <FileText className="h-4 w-4 text-slate-500" />
            Export Insights
        </button>

        <button 
            className="group flex items-center gap-2 cursor-pointer text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-xl hover:bg-blue-600 active:scale-95 transition-all"
            onClick={() => router.push('/')}
          >
            <Sparkles className="h-4 w-4 text-blue-400 group-hover:text-white" />
            New Analysis
          </button>
    </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 2. Summary Hero Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Executive Summary
            </span>
          </div>
          <h2 className="text-4xl font-black text-slate-950 mb-6 tracking-tight">
            Report <span className="text-blue-600">Findings.</span>
          </h2>
          <div className="relative p-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
            <p className="text-xl text-slate-700 font-medium leading-relaxed">
              {safeData.summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            
            {/* Key Observations */}
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  Key Insights
                </h3>
                <span className="text-xs font-medium text-slate-400">{safeData.keyPoints.length} total points</span>
              </div>
              <div className="grid gap-4">
                {safeData.keyPoints.map((point, index) => (
                  <div key={index} className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                    <div className="mt-1 flex-shrink-0 h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <ChevronRight className="h-4 w-4 text-emerald-600 group-hover:text-white" />
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <CalendarClock className="h-6 w-6 text-purple-600" />
                Strategic Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(safeData.importantDates).map(([key, value]) => (
                  <div key={key} className="bg-white p-6 rounded-2xl border border-slate-100 border-l-4 border-l-purple-500 shadow-sm">
                    <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{key.replace(/_/g, ' ')}</span>
                    <span className="text-lg font-bold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 space-y-8 h-fit animate-in fade-in slide-in-from-right-8 duration-1000">
            
            {/* Critical Risks */}
            <section className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-lg font-bold text-red-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Critical Risks
              </h3>
              <div className="space-y-4">
                {safeData.risks.map((risk, index) => (
                  <div key={index} className="p-4 bg-white rounded-xl border border-red-100 shadow-sm text-sm font-medium text-red-800 leading-relaxed">
                    {risk}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Stats Card */}
            <section className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Settings2 className="h-24 w-24" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Metadata Analysis</h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-400">Context Usage</span>
                    <span className="text-xs font-mono text-blue-400">{usagePercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-mono font-bold text-white tracking-tighter">
                    {safeData.rawTextLength.toLocaleString()}
                  </p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Processed Characters</p>
                </div>
              </div>
            </section>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default SummaryUI;