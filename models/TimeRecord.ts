import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TimeRecordSchema = new Schema(
  {
    time: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

export type TimeRecord = InferSchemaType<typeof TimeRecordSchema>;

// 避免熱重載時重複編譯 model
export const TimeRecordModel: Model<TimeRecord> =
  (mongoose.models.TimeRecord as Model<TimeRecord>) ||
  mongoose.model<TimeRecord>("TimeRecord", TimeRecordSchema);
