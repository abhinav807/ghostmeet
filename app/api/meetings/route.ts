import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
      }

      return NextResponse.json({
        id: data.id,
        userId: data.user_id,
        fileName: data.file_name,
        fileSize: data.file_size,
        fileType: data.file_type,
        duration: data.duration,
        status: data.status,
        transcript: data.transcript,
        summary: data.summary,
        keyDecisions: data.key_decisions,
        actionItems: data.action_items,
        followUpEmail: data.follow_up_email,
        meetingMinutes: data.meeting_minutes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    }

    const { data, error } = await supabase
      .from("meetings")
      .select("id, file_name, status, created_at, duration, summary")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
    }

    return NextResponse.json(
      data.map((m) => ({
        id: m.id,
        fileName: m.file_name,
        status: m.status,
        createdAt: m.created_at,
        duration: m.duration,
        summary: m.summary,
      }))
    );
  } catch (err) {
    console.error("Meetings API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Meeting ID required" }, { status: 400 });
    }

    const supabase = getServerSupabase();
    const { error } = await supabase.from("meetings").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
