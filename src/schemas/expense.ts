import * as mongoose from "mongoose";
import { MONGOOSE_METHODS, saveToRedis } from "../utils/redis";
import { CountDoc } from "./count";

interface CustomParticipant {
  name: string;
  customAmount: number;
}
export interface ExpenseProps {
  title: string;
  description: string;
  mutatedBy: string;
  amount: number;
  currency: "EUR" | "USD" | "CAD";
  payers: string[];
  customPayers: CustomParticipant[];
  customOwers: CustomParticipant[];
  owers: string[];
  count: CountDoc;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseDoc extends mongoose.Document, ExpenseProps {}

type ExpenseModel = mongoose.Model<ExpenseDoc>;

const ExpenseSchema = new mongoose.Schema<ExpenseDoc, ExpenseModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    mutatedBy: String,
    amount: {
      type: Number,
      validate: {
        validator: (number: number) => number > 0,
        message: "Amount must be positive.",
      },
      required: true,
    },
    currency: {
      type: String,
      enum: ["EUR", "USD", "CAD"],
      default: "EUR",
    },
    payers: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    customPayers: [
      {
        type: {
          name: {
            type: String,
          },
          customAmount: {
            type: Number,
          },
        },
        default: [],
      },
    ],
    customOwers: [
      {
        type: {
          name: {
            type: String,
          },
          customAmount: {
            type: Number,
          },
        },
        default: [],
      },
    ],
    owers: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    count: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Count",
      required: true,
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

ExpenseSchema.post(MONGOOSE_METHODS as any, saveToRedis);

const Expense = mongoose.model<ExpenseDoc, ExpenseModel>(
  "Expense",
  ExpenseSchema
);

export { Expense };
