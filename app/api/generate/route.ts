import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { generateMeetingInsights } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json({ error: "Meeting ID required" }, { status: 400 });
    }

    const supabase = getServerSupabase();

    const { data: meeting, error: fetchError } = await supabase
      .from("meetings")
      .select("transcript, status")
      .eq("id", meetingId)
      .single();

    if (fetchError || !meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (!meeting.transcript) {
      return NextResponse.json({ error: "No transcript available for this meeting" }, { status: 400 });
    }

    const insights = await generateMeetingInsights(meeting.transcript);

    const { error: updateError } = await supabase
      .from("meetings")
      .update({
        summary: insights.summary,
        key_decisions: insights.keyDecisions,
        action_items: insights.actionItems,
        follow_up_email: insights.followUpEmail,
        meeting_minutes: insights.meetingMinutes,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", meetingId);

    if (updateError) {
      console.error("Failed to update meeting with insights:", updateError);
      return NextResponse.json({ error: "Failed to save insights" }, { status: 500 });
    }

    return NextResponse.json({ meetingId, ...insights });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
