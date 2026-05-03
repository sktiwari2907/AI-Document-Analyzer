"use client";

import ParticlesBackground from "@/components/Background";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50">
      
      
      <ParticlesBackground />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="w-full flex justify-between items-center px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            DocuChat <span className="text-blue-600">AI</span>
          </h1>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center flex-1 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Analyze your <span className="text-blue-600">documents</span> <br /> using AI
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mb-10">
            Upload PDFs/Text Files and instantly extract insights — 
            all powered by advanced AI models.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 hover: cursor-pointer"
              onClick={() => router.push('/upload')}
            >
              Upload Document
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white/30 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Everything you need
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
            icon="🚀" 
            title="Intelligent Analysis" 
            desc="Instantly extract key insights, strategic timelines, and executive summaries from any PDF." 
          />
          <FeatureCard 
            icon="⚠️" 
            title="Risk Detection" 
            desc="Automatically identify critical risks and bottlenecks hidden within your complex documents." 
          />
          <FeatureCard 
            icon="📥" 
            title="Professional Export" 
            desc="Generate and download high-fidelity PDF reports of your findings with a single click." 
          />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white/70 p-8 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}