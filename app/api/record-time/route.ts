import { connectDB } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

async function recordTime() {
  try {
    await connectDB();
    const record = await TimeRecordModel.create({ time: new Date() });
    return Response.json({ ok: true, record }, { status: 201 });
  } catch (err) {
    console.error("[record-time]", err);
    return Response.json({ ok: false, error: "寫入資料庫失敗" }, { status: 500 });
  }
}

// GET 與 POST 都會存一筆，方便之後給 cron 服務呼叫
export const GET = recordTime;
export const POST = recordTime;
