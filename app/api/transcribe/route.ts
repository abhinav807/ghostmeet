import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { transcribeAudio } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validTypes = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/m4a"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
      return NextResponse.json({ error: "Invalid file type. Use MP3, WAV, or M4A" }, { status: 400 });
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 100MB" }, { status: 400 });
    }

    const supabase = getServerSupabase();

    const meetingId = crypto.randomUUID();

    const { error: insertError } = await supabase.from("meetings").insert({
      id: meetingId,
      user_id: "00000000-0000-0000-0000-000000000000",
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      status: "transcribing",
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to create meeting record" }, { status: 500 });
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
      console.error("Transcription error:", transcriptionError);

      await supabase
        .from("meetings")
        .update({ status: "error", updated_at: new Date().toISOString() })
        .eq("id", meetingId);

      return NextResponse.json(
        { error: "Transcription failed. Please check your GEMINI_API_KEY and try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
