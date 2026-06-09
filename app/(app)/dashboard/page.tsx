"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  FileAudio,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import type { MeetingListItem, MeetingStatus } from "@/types/meeting";

const statusConfig: Record<MeetingStatus, { label: string; icon: React.ElementType; color: string }> = {
  uploading: { label: "Uploading", icon: Loader2, color: "text-yellow-400" },
  transcribing: { label: "Transcribing", icon: Loader2, color: "text-blue-400" },
  generating: { label: "Generating", icon: Loader2, color: "text-purple-400" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
  error: { label: "Error", icon: AlertCircle, color: "text-red-400" },
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("meetings")
      .select("id, file_name, status, created_at, duration, summary")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMeetings(
        data.map((m) => ({
          id: m.id,
          fileName: m.file_name,
          status: m.status as MeetingStatus,
          createdAt: m.created_at,
          duration: m.duration,
          summary: m.summary,
        }))
      );
    }
    setLoading(false);
  }

  async function deleteMeeting(id: string) {
    await supabase.from("meetings").delete().eq("id", id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  }

  const filtered = meetings
    .filter(
      (m) =>
        m.fileName.toLowerCase().includes(search.toLowerCase()) ||
        m.summary.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.fileName.localeCompare(b.fileName);
      if (sortBy === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} processed
            </p>
          </motion.div>

          <Link href="/upload">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/25">
              <Plus className="mr-2 h-4 w-4" />
              New Meeting
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 focus:border-cyan-500/50"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-white/10">
                Sort by <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>By name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileAudio className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {search ? "No meetings found" : "No meetings yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {search
                ? "Try a different search term"
                : "Upload your first meeting recording to get started"}
            </p>
            {!search && (
              <Link href="/upload">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Meeting
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((meeting, i) => {
                const status = statusConfig[meeting.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link href={`/results/${meeting.id}`}>
                      <div className="group rounded-xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/20 hover:bg-white/[0.04] backdrop-blur-sm p-4 sm:p-5 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <div className="shrink-0 h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                              <FileAudio className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium truncate group-hover:text-cyan-400 transition-colors">
                                {meeting.fileName}
                              </h3>
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(meeting.duration)}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(meeting.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1.5 py-0 ${status.color} border-current/20`}
                                >
                                  <StatusIcon
                                    className={`h-3 w-3 mr-1 ${
                                      meeting.status === "uploading" ||
                                      meeting.status === "transcribing" ||
                                      meeting.status === "generating"
                                        ? "animate-spin"
                                        : ""
                                    }`}
                                  />
                                  {status.label}
                                </Badge>
                              </div>
                              {meeting.summary && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {meeting.summary.slice(0, 150)}...
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteMeeting(meeting.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
