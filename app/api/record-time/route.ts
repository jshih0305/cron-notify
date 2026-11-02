import { timingSafeEqual } from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import { TimeRecordModel } from "@/models/TimeRecord";

// 檢查 Authorization: Bearer <CRON_SECRET>
function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[record-time] 尚未設定 CRON_SECRET，拒絕所有請求");
    return false;
  }

  const auth = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(auth);

  // 用 timingSafeEqual 比對，避免透過回應時間猜出 secret
  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function recordTime(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
