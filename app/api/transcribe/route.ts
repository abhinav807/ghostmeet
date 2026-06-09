import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { transcribeAudio } from "@/lib/gemini";
import { isDemoMode } from "@/lib/mock-data";

const VALID_EXTENSIONS = /\.(mp3|wav|m4a)$/i;
const VALID_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/mp3",
  "video/mp4",
]);
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isValidType = VALID_MIME_TYPES.has(file.type) || VALID_EXTENSIONS.test(file.name);
    if (!isValidType) {
      return NextResponse.json(
        { error: "Invalid file type. Use MP3, WAV, or M4A" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Max 100MB" }, { status: 400 });
    }

    if (isDemoMode()) {
      await sleep(2000);
    }

    const supabase = getServerSupabase();
    const meetingId = crypto.randomUUID();

    const { error: insertError } = await supabase.from("meetings").insert({
      id: meetingId,
      user_id: "00000000-0000-0000-0000-000000000000",
      file_name: file.name,
      file_size: file.size,
      file_type: file.type || "audio/mpeg",
      status: "transcribing",
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create meeting record: " + insertError.message },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "audio/mpeg";

    try {
      const { transcript, duration } = await transcribeAudio(buffer, mimeType);

      const { error: updateError } = await supabase
        .from("meetings")
        .update({
          transcript,
          duration,
          status: "generating",
          updated_at: new Date().toISOString(),
        })
        .eq("id", meetingId);

      if (updateError) {
        console.error("Failed to update meeting with transcript:", updateError);
      }

      return NextResponse.json({ meetingId, transcript, duration });
    } catch (transcriptionError) {
      const message =
        transcriptionError instanceof Error
          ? transcriptionError.message
          : "Transcription failed";
      console.error("Transcription error:", transcriptionError);

      await supabase
        .from("meetings")
        .update({ status: "error", updated_at: new Date().toISOString() })
        .eq("id", meetingId);

      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Upload error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
