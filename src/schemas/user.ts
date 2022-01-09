/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as mongoose from "mongoose";
import { CountDoc } from "./count";

export interface UserProps {
  name?: string;
  email?: string;
  phoneNumber?: string;
  expoToken: string;
  role: "guest" | "user" | "premium" | "admin";
  isLoggedIn: boolean;
  counts: CountDoc[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDoc extends mongoose.Document, UserProps {
  getProps: () => UserProps;
}

type UserModel = mongoose.Model<UserDoc>;

const UserSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    name: {
      type: String,
      default: "Guest",
    },
    email: {
      type: String,
      validate: {
        validator: async function (email: string) {
          // @ts-ignore
          const user = await this.constructor.findOne({ email });
          if (user) {
            // @ts-ignore
            if (this.id === user.id) {
              return true;
            }
            return false;
          }
          return true;
        },
        message: () => "The specified email address is already in use.",
      },
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      maxlength: 12,
      match: [
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        "Veuillez utiliser un numéro de téléphone valide.",
      ],
    },
    expoToken: String,
    role: {
      type: String,
      enum: ["guest", "user", "premium", "admin"],
      default: "guest",
    },
    isLoggedIn: Boolean,
    counts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Count",
        default: [],
      },
    ],
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

UserSchema.methods.getProps = function () {
  const user = this.toObject();

  user.id = user._id;
  delete user._id;

  return user;
};

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
