import * as mongoose from "mongoose";
import { CountDoc } from "./count";
import { UserDoc } from "./user";

interface DebtorOrCreditorDetails {
  name: string;
  amount: number;
}

export type DebtorOrCreditor = DebtorOrCreditorDetails[];

export interface ParticipantProps {
  name: string;
  user?: UserDoc;
  balance: number;
  credit: number;
  debit: number;
  debtors: DebtorOrCreditor;
  creditors: DebtorOrCreditor;
  count: CountDoc;
}

export interface ParticipantDoc extends mongoose.Document, ParticipantProps {}

type ParticipantModel = mongoose.Model<ParticipantDoc>;

const ParticipantSchema = new mongoose.Schema<ParticipantDoc, ParticipantModel>(
  {
    name: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    debit: {
      type: Number,
      default: 0,
    },
    debtors: {
      type: [
        {
          name: { type: String },
          amount: { type: Number },
        },
      ],
      default: [],
    },
    creditors: {
      type: [
        {
          name: { type: String },
          amount: { type: Number },
        },
      ],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    count: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Count",
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

const Participant = mongoose.model<ParticipantDoc, ParticipantModel>(
  "Participant",
  ParticipantSchema
);

export { Participant };
