import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ActionItem, KeyDecision, GenerationResponse } from "@/types/meeting";
import { isDemoMode, mockTranscribeAudio, mockGenerateMeetingInsights } from "@/lib/mock-data";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<{ transcript: string; duration: number }> {
  if (isDemoMode()) {
    return mockTranscribeAudio(audioBuffer, mimeType);
  }

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: audioBuffer.toString("base64"),
        mimeType,
      },
    },
    "Transcribe this audio recording verbatim. Include speaker labels if possible (Speaker 1:, Speaker 2:, etc.). Preserve all spoken content accurately. If you cannot transcribe something, indicate [unintelligible]. Return only the transcript text.",
  ]);

  const transcript = result.response.text();
  const estimatedDuration = Math.max(1, Math.round(transcript.length / 15));

  return { transcript, duration: estimatedDuration };
}

export async function generateMeetingInsights(transcript: string): Promise<GenerationResponse> {
  if (isDemoMode()) {
    return mockGenerateMeetingInsights(transcript);
  }

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [summaryResult, decisionsResult, actionsResult, emailResult, minutesResult] = await Promise.all([
    model.generateContent([
      `Based on the following meeting transcript, write a concise executive summary (3-5 paragraphs). Focus on the main topics discussed, key points raised, and overall outcomes. Write in a professional tone.\n\nTranscript:\n${transcript}`,
    ]),
    model.generateContent([
      `Based on the following meeting transcript, identify all key decisions made. For each decision, provide: the decision itself, the context/reasoning, and who made or proposed the decision. Return as a JSON array with objects having keys: "decision", "context", "decidedBy". If no decisions were made, return an empty array.\n\nTranscript:\n${transcript}`,
    ]),
    model.generateContent([
      `Based on the following meeting transcript, extract all action items. For each action item, provide: the task description, the assignee (person responsible), the deadline or timeframe mentioned (or "Not specified" if none), and the priority (high/medium/low based on urgency). Return as a JSON array with objects having keys: "task", "assignee", "deadline", "priority". If no action items exist, return an empty array.\n\nTranscript:\n${transcript}`,
    ]),
    model.generateContent([
      `Based on the following meeting transcript, draft a professional follow-up email. Include: a subject line, a brief recap of the meeting, key decisions and action items mentioned, and next steps. The email should be polite, professional, and actionable. Format it as a complete email ready to send with Subject: line, greeting, body, and sign-off.\n\nTranscript:\n${transcript}`,
    ]),
    model.generateContent([
      `Based on the following meeting transcript, generate formal meeting minutes. Include: Meeting header (date, attendees if mentioned), Agenda items discussed, Key discussion points under each item, Decisions made, Action items with assignees, Next meeting details if mentioned. Format in a clean, professional structure.\n\nTranscript:\n${transcript}`,
    ]),
  ]);

  const summary = summaryResult.response.text();
  const email = emailResult.response.text();
  const minutes = minutesResult.response.text();

  let keyDecisions: KeyDecision[] = [];
  try {
    const decisionsText = decisionsResult.response.text();
    const cleaned = decisionsText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    keyDecisions = JSON.parse(cleaned);
  } catch {
    keyDecisions = [];
  }

  let actionItems: ActionItem[] = [];
  try {
    const actionsText = actionsResult.response.text();
    const cleaned = actionsText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    actionItems = JSON.parse(cleaned);
  } catch {
    actionItems = [];
  }

  return {
    summary,
    keyDecisions,
    actionItems,
    followUpEmail: email,
    meetingMinutes: minutes,
  };
}
