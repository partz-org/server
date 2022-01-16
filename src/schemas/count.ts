import * as mongoose from "mongoose";
import { MONGOOSE_METHODS, saveToRedis } from "../utils/redis";
import { ExpenseDoc } from "./expense";
import { ParticipantDoc } from "./participant";
import { UserDoc } from "./user";

export interface CountProps {
  title: string;
  description?: string;
  currency: "EUR" | "USD" | "CAD";
  total: number;
  participants: ParticipantDoc[];
  expenses: ExpenseDoc[];
  creatorId?: UserDoc;
  createdAt: Date;
  updatedAt: Date;
  userToTag: string;
}

export interface CountDoc extends mongoose.Document, CountProps {}

export type CountModel = mongoose.Model<CountDoc>;

const CountSchema = new mongoose.Schema<CountDoc, CountModel>(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currency: {
      type: String,
      enum: ["EUR", "USD", "CAD"],
      default: "EUR",
    },
    description: {
      type: String,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Participant",
        },
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    expenses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Expense",
        },
      ],
      default: [],
    },
    userToTag: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

CountSchema.post(MONGOOSE_METHODS as any, saveToRedis);

const Count = mongoose.model<CountDoc, CountModel>("Count", CountSchema);

export { Count };
