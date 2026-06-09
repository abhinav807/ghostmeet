"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileAudio,
  Clock,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Download,
  ChevronDown,
  User,
  Calendar,
  Flag,
  Mail,
  FileText,
  List,
  Brain,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { MeetingResult, ActionItem, KeyDecision, MeetingStatus } from "@/types/meeting";

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={copy}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [meeting, setMeeting] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTranscript, setExpandedTranscript] = useState(false);

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meetings?id=${id}`);
        if (!res.ok) throw new Error("Meeting not found");
        const data = await res.json();
        setMeeting(data);

        if (data.status === "transcribing" || data.status === "generating") {
          const interval = setInterval(async () => {
            const pollRes = await fetch(`/api/meetings?id=${id}`);
            if (pollRes.ok) {
              const pollData = await pollRes.json();
              setMeeting(pollData);
              if (pollData.status === "completed" || pollData.status === "error") {
                clearInterval(interval);
              }
            }
          }, 3000);
          return () => clearInterval(interval);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load meeting");
      } finally {
        setLoading(false);
      }
    }
    fetchMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading meeting results...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-medium">{error || "Meeting not found"}</p>
        </div>
      </div>
    );
  }

  const isProcessing = meeting.status === "transcribing" || meeting.status === "generating";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileAudio className="h-5 w-5 text-cyan-400" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{meeting.fileName}</h1>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(meeting.duration)}
                </div>
                <Badge
                  variant="outline"
                  className={
                    meeting.status === "completed"
                      ? "text-emerald-400 border-emerald-500/20"
                      : "text-cyan-400 border-cyan-500/20"
                  }
                >
                  {isProcessing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  {meeting.status === "completed" ? "Completed" : "Processing..."}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10"
                onClick={() => {
                  const content = [
                    `# Meeting: ${meeting.fileName}`,
                    `Duration: ${formatDuration(meeting.duration)}`,
                    "",
                    "## Summary",
                    meeting.summary,
                    "",
                    "## Key Decisions",
                    ...((meeting.keyDecisions as KeyDecision[]).map((d) => `- ${d.decision} (Context: ${d.context})`)),
                    "",
                    "## Action Items",
                    ...((meeting.actionItems as ActionItem[]).map((a) => `- [${a.priority.toUpperCase()}] ${a.task} — ${a.assignee} (${a.deadline})`)),
                    "",
                    "## Follow-Up Email",
                    meeting.followUpEmail,
                    "",
                    "## Meeting Minutes",
                    meeting.meetingMinutes,
                    "",
                    "## Transcript",
                    meeting.transcript,
                  ].join("\n");
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${meeting.fileName.replace(/\.[^.]+$/, "")}-results.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 flex items-center gap-3"
          >
            <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
            <div>
              <p className="text-sm font-medium">
                {meeting.status === "transcribing"
                  ? "AI is transcribing your meeting..."
                  : "AI is generating insights..."}
              </p>
              <p className="text-xs text-muted-foreground">Results will appear automatically</p>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-auto flex-wrap">
            <TabsTrigger value="summary" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Brain className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <List className="mr-2 h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="decisions" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Gavel className="mr-2 h-4 w-4" />
              Decisions
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="minutes" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <FileText className="mr-2 h-4 w-4" />
              Minutes
            </TabsTrigger>
            <TabsTrigger value="transcript" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              <FileAudio className="mr-2 h-4 w-4" />
              Transcript
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="summary" className="mt-0">
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    Executive Summary
                  </h2>
                  <CopyButton text={meeting.summary} />
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  {meeting.summary.split("\n").map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="actions" className="mt-0">
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <List className="h-5 w-5 text-cyan-400" />
                    Action Items
                  </h2>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-500/20">
                    {(meeting.actionItems as ActionItem[]).length} items
                  </Badge>
                </div>
                {(meeting.actionItems as ActionItem[]).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No action items extracted from this meeting.</p>
                ) : (
                  <div className="space-y-3">
                    {(meeting.actionItems as ActionItem[]).map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-4 hover:border-cyan-500/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.task}</p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              {item.assignee && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  {item.assignee}
                                </div>
                              )}
                              {item.deadline && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {item.deadline}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${priorityColors[item.priority] || priorityColors.medium}`}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {item.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="decisions" className="mt-0">
              <motion.div
                key="decisions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-cyan-400" />
                    Key Decisions
                  </h2>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-500/20">
                    {(meeting.keyDecisions as KeyDecision[]).length} decisions
                  </Badge>
                </div>
                {(meeting.keyDecisions as KeyDecision[]).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No key decisions identified from this meeting.</p>
                ) : (
                  <div className="space-y-3">
                    {(meeting.keyDecisions as KeyDecision[]).map((decision, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-4 hover:border-cyan-500/10 transition-colors"
                      >
                        <p className="font-medium text-sm">{decision.decision}</p>
                        {decision.context && (
                          <p className="text-xs text-muted-foreground mt-1.5">Context: {decision.context}</p>
                        )}
                        {decision.decidedBy && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            Decided by: {decision.decidedBy}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="email" className="mt-0">
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    Follow-Up Email Draft
                  </h2>
                  <CopyButton text={meeting.followUpEmail} />
                </div>
                <div className="rounded-lg border border-white/5 bg-background/50 p-4 font-mono text-sm">
                  <ScrollArea className="max-h-[600px]">
                    {meeting.followUpEmail.split("\n").map((line, i) => (
                      <p key={i} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {line}
                      </p>
                    ))}
                  </ScrollArea>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="minutes" className="mt-0">
              <motion.div
                key="minutes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    Meeting Minutes
                  </h2>
                  <CopyButton text={meeting.meetingMinutes} />
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  {meeting.meetingMinutes.split("\n").map((line, i) => {
                    if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
                      const level = line.match(/^#+/)?.[0].length || 2;
                      const HeadingTag = `h${Math.min(level, 3)}` as keyof JSX.IntrinsicElements;
                      return (
                        <HeadingTag key={i} className="text-foreground font-semibold mt-4 mb-2">
                          {line.replace(/^#+\s*/, "")}
                        </HeadingTag>
                      );
                    }
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      return (
                        <p key={i} className="text-muted-foreground leading-relaxed pl-4">
                          {line}
                        </p>
                      );
                    }
                    if (line.trim() === "") return <Separator key={i} className="my-3 opacity-20" />;
                    return (
                      <p key={i} className="text-muted-foreground leading-relaxed mb-2">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-0">
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileAudio className="h-5 w-5 text-cyan-400" />
                    Transcript
                  </h2>
                  <div className="flex items-center gap-2">
                    <CopyButton text={meeting.transcript} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setExpandedTranscript(!expandedTranscript)}
                    >
                      {expandedTranscript ? "Collapse" : "Expand"}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${expandedTranscript ? "rotate-180" : ""}`} />
                    </Button>
                  </div>
                </div>
                <ScrollArea className={expandedTranscript ? "" : "max-h-[500px]"}>
                  <div className="space-y-2">
                    {meeting.transcript.split("\n").map((line, i) => {
                      const speakerMatch = line.match(/^(Speaker \d+):/);
                      if (speakerMatch) {
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono text-sm shrink-0">
                              {speakerMatch[1]}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {line.slice(speakerMatch[0].length)}
                            </span>
                          </div>
                        );
                      }
                      const timeMatch = line.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?/);
                      if (timeMatch) {
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-teal-400 font-mono text-sm shrink-0">
                              {timeMatch[1]}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {line.slice(timeMatch[0].length)}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </ScrollArea>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
