export type MeetingStatus = "uploading" | "transcribing" | "generating" | "completed" | "error";

export interface ActionItem {
  task: string;
  assignee: string;
  deadline: string;
  priority: "high" | "medium" | "low";
}

export interface KeyDecision {
  decision: string;
  context: string;
  decidedBy: string;
}

export interface MeetingResult {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  duration: number;
  status: MeetingStatus;
  transcript: string;
  summary: string;
  keyDecisions: KeyDecision[];
  actionItems: ActionItem[];
  followUpEmail: string;
  meetingMinutes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingListItem {
  id: string;
  fileName: string;
  status: MeetingStatus;
  createdAt: string;
  duration: number;
  summary: string;
}

export interface TranscriptionResponse {
  transcript: string;
  duration: number;
}

export interface GenerationResponse {
  summary: string;
  keyDecisions: KeyDecision[];
  actionItems: ActionItem[];
  followUpEmail: string;
  meetingMinutes: string;
}

export interface UploadProgress {
  stage: "uploading" | "transcribing" | "generating" | "completed" | "error";
  progress: number;
  message: string;
}
