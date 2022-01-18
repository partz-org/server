import { CountDoc } from "../src/schemas/count";
import * as mongoose from "mongoose";
import { Participant, ParticipantProps } from "../src/schemas/participant";
import type { CreateTempUserBody } from "../src/routes/users/validator";
import type { CreateCountBody } from "../src/routes/counts/validator";

export const countBody: CreateCountBody = {
  title: "test 2",
  description: "tesqtzq",
  currency: "EUR",
  userToTag: "andré",
  participants: [
    { name: "andré" },
    { name: "firmin" },
    { name: "elisabeth" },
    { name: "andré" },
    { name: "alex" },
    { name: "eric" },
    { name: "olivier" },
  ],
};

export const newCount = {
  title: "test 2",
  description: "tesqtzq",
  currency: "EUR",
  participants: [new mongoose.Types.ObjectId().toHexString()],
};

export const newParticipant: ParticipantProps = {
  name: "andré",
  count: "61111696845bf47b9ba6b467" as any,
  balance: 1500,
  credit: 3000,
  debit: 1500,
  debtors: {} as any,
  creditors: {} as any,
};

export const newExpense = {
  title: "Dior",
  description: "tesqtzq",
  currency: "EUR",
  amount: 1500,
  payers: ["alex"],
  owers: ["eric", "andré", "elisabeth", "firmin", "olivier"],
  customOwers: [],
  customPayers: [],
  count: "61111696845bf47b9ba6b467",
};

export const newUser: CreateTempUserBody = {
  email: "firmin@gmail.com",
  password: "lolo",
  name: "Firmin",
  expoToken: "qzdqzd",
};

export const expenseDoc = {
  currency: "EUR",
  payers: ["andré", "louise"],
  owers: ["firmin", "andré", "louise", "elisabeth", "eric", "olivier"],
  title: "Dior",
  description: "tesqtzq",
  amount: 2500,
  count: "611816634e17533eca04f8b0",
  createdAt: "2021-08-14T19:20:56.441Z",
  updatedAt: "2021-08-14T19:20:56.441Z",
  __v: 0,
  id: "61181798317f964603d308d7",
};

const participants = [
  {
    balance: 0,
    credit: 0,
    debit: 0,
    name: "andré",
    debtors: [],
    creditors: [],
  },
  {
    balance: 0,
    credit: 0,
    debit: 0,
    name: "firmin",
    debtors: [],
    creditors: [],
  },
  {
    balance: 0,
    credit: 0,
    debit: 0,
    name: "elisabeth",
    debtors: [],
    creditors: [],
  },
  {
    balance: 0,
    credit: 0,
    debit: 0,
    name: "louise",
    debtors: [],
    creditors: [],
  },
];

export const invalidCount = {
  currency: "EUR",
  total: 954,
  participants: participants.map((p) => new Participant(p)),
  expenses: [
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 954,
      payers: ["louise", "andré", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 2954,
      payers: ["louise", "andré", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 5954,
      payers: ["louise", "andré", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 2554,
      payers: ["louise", "firmin", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 2954,
      payers: ["elisabeth"],
      owers: ["firmin", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
  ],
  title: "test 2",
  description: "tesqtzq",
  creatorId: "610e65de89932722398dcdab",
  createdAt: "2021-08-14T17:48:06.862Z",
  updatedAt: "2021-08-14T17:48:11.205Z",
  __v: 1,
  id: "611801d69c69e57d57b43d42",
} as unknown as CountDoc;

export const invalidCountWithCustomAmounts = {
  currency: "EUR",
  total: 954,
  participants: participants.map((p) => new Participant(p)),
  expenses: [
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 1000,
      customOwers: [
        { name: "andré", customAmount: 500 },
        { name: "louise", customAmount: 300 },
        { name: "elisabeth", customAmount: 100 },
        { name: "firmin", customAmount: 100 },
      ],
      customPayers: [
        { name: "firmin", customAmount: 500 },
        { name: "louise", customAmount: 300 },
        { name: "elisabeth", customAmount: 100 },
        { name: "andré", customAmount: 100 },
      ],
      payers: ["louise", "andré", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
    {
      title: "Dior",
      description: "tesqtzq",
      currency: "EUR",
      amount: 1000,
      customOwers: [
        { name: "andré", customAmount: 500 },
        { name: "louise", customAmount: 300 },
        { name: "elisabeth", customAmount: 100 },
        { name: "firmin", customAmount: 100 },
      ],
      customPayers: [
        { name: "louise", customAmount: 300 },
        { name: "elisabeth", customAmount: 100 },
        { name: "andré", customAmount: 100 },
      ],
      payers: ["louise", "andré", "elisabeth"],
      owers: ["firmin", "andré", "louise", "elisabeth"],
      count: "611801d69c69e57d57b43d42",
    },
  ],
  title: "test 2",
  description: "tesqtzq",
  creatorId: "610e65de89932722398dcdab",
  createdAt: "2021-08-14T17:48:06.862Z",
  updatedAt: "2021-08-14T17:48:11.205Z",
  __v: 1,
  id: "611801d69c69e57d57b43d42",
} as unknown as CountDoc;
