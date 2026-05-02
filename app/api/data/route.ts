import { NextRequest, NextResponse } from "next/server";
import { 
  initializeDatabases, 
  saveUser, 
  getUser, 
  saveAssessment, 
  getLatestAssessment,
  saveJournalEntry,
  getJournals
} from "@/lib/cloudant/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, data } = body;

    // A hardcoded anonymous user ID for the demo since we removed Auth earlier
    const effectiveUserId = userId || "demo_user_001";

    switch (action) {
      case "init":
        const initialized = await initializeDatabases();
        return NextResponse.json({ success: initialized });

      case "save_user":
        await saveUser(effectiveUserId, data);
        return NextResponse.json({ success: true });

      case "get_user":
        const user = await getUser(effectiveUserId);
        return NextResponse.json({ user });

      case "save_assessment":
        await saveAssessment(effectiveUserId, data);
        return NextResponse.json({ success: true });

      case "get_assessment":
        const assessment = await getLatestAssessment(effectiveUserId);
        return NextResponse.json({ assessment });

      case "save_journal":
        await saveJournalEntry(effectiveUserId, data.entry, data.mood, data.aiReflection);
        return NextResponse.json({ success: true });

      case "get_journals":
        const journals = await getJournals(effectiveUserId);
        return NextResponse.json({ journals });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Data API error:", error);
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
  }
}
