"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile?.type.includes("pdf") && !selectedFile?.type.includes("text")) {
      alert("Please upload a PDF or text file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const dataString = encodeURIComponent(JSON.stringify(data));
    router.push(`/summary?data=${dataString}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Upload Document
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Upload a PDF or text file to start chatting with it
        </p>

        {/* Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition 
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <p className="text-gray-600 mb-2">
            Drag & drop your file here
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or
          </p>

          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
            Browse Files
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files[0])
              }
            />
          </label>
        </div>

        {/* File Preview */}
        {file && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-700">
              <strong>Selected:</strong> {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          disabled={!file}
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition 
            ${
              file
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          onClick={handleAnalyze}
        >
          Analyze Document
        </button>
      </div>
    </div>
  );
}