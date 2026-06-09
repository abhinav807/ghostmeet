"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileAudio,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/mp3",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

type UploadStage = "idle" | "uploading" | "transcribing" | "generating" | "completed" | "error";

const stageConfig: Record<Exclude<UploadStage, "idle" | "error">, { label: string; progress: number }> = {
  uploading: { label: "Uploading audio file...", progress: 20 },
  transcribing: { label: "Transcribing with AI...", progress: 55 },
  generating: { label: "Generating insights...", progress: 85 },
  completed: { label: "Complete!", progress: 100 },
};

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(mp3|wav|m4a)$/i)) {
      setErrorMessage("Please upload an MP3, WAV, or M4A file");
      setStage("error");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setErrorMessage("File size must be under 100MB");
      setStage("error");
      return;
    }
    setFile(f);
    setStage("idle");
    setErrorMessage("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  async function startProcessing() {
    if (!file) return;

    setStage("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Transcription failed");
      }

      setStage("transcribing");
      const { meetingId } = await res.json();

      setStage("generating");
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error || "Generation failed");
      }

      setStage("completed");
      setTimeout(() => {
        router.push(`/results/${meetingId}`);
      }, 1000);
    } catch (err) {
      setStage("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  const currentStage = stage !== "idle" && stage !== "error" ? stageConfig[stage] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Upload Meeting</h1>
          <p className="text-muted-foreground mt-1">
            Drop your audio recording and let AI do the rest
          </p>
          {isDemo && (
            <Badge
              variant="outline"
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-400"
            >
              <FlaskConical className="h-3 w-3" />
              Demo Mode — simulated AI processing
            </Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
              dragActive
                ? "border-cyan-400 bg-cyan-500/5"
                : file
                ? "border-cyan-500/30 bg-cyan-500/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            {file ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
                  <FileAudio className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{file.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
                {stage === "idle" && (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={startProcessing}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/25"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Process Meeting
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFile(null);
                        setStage("idle");
                      }}
                      className="text-muted-foreground"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 sm:p-16 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-white/5 text-muted-foreground mb-4">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  Drop your meeting recording here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports MP3, WAV, and M4A up to 100MB
                </p>
                <label>
                  <input
                    type="file"
                    accept=".mp3,.wav,.m4a,audio/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <Button
                    variant="outline"
                    className="border-white/10 hover:border-cyan-500/30 cursor-pointer"
                    asChild
                  >
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {currentStage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                {stage === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                )}
                <span className="text-sm font-medium">{currentStage.label}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStage.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "error" && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-6"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-400">{errorMessage}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-400 hover:text-red-300"
                    onClick={() => {
                      setStage("idle");
                      setErrorMessage("");
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: "1", title: "Upload", desc: "Drop your audio file" },
            { icon: "2", title: "Transcribe", desc: "AI converts speech to text" },
            { icon: "3", title: "Analyze", desc: "Get summaries & action items" },
          ].map((step) => (
            <div
              key={step.icon}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center"
            >
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold mb-2">
                {step.icon}
              </div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
