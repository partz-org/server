import { RouteGenericInterface, RouteHandlerMethod } from "fastify/types/route";
import { Static, Type } from "@sinclair/typebox";
import { User } from "../../schemas/user";
import {
  CreateTempUserBodyJson,
  RegisterUserBodyJson,
  UpdateUserBodyJson,
  UserIdParamsJson,
} from "./validator";
import type {
  CreateTempUser,
  DeleteUser,
  GetOneUser,
  RegisterUser,
  UpdateUser,
} from "./validator";
import { encryptPassword } from "./helper";

export const getAllUsers: RouteHandlerMethod = async function (req, rep) {
  const allUsers = await User.find({});
  rep.status(200).send(allUsers);
};

const GetOneUserParamsJson = Type.Object({
  id: Type.String(),
});

export type GetOneUserParams = Static<typeof GetOneUserParamsJson>;

export interface GetOneUserRequest extends RouteGenericInterface {
  Params: GetOneUserParams;
}

export const getOneUser: GetOneUser = {
  schema: {
    tags: ["user"],
    params: GetOneUserParamsJson,
  },
  handler: async function (req, rep) {
    const userToFind = await User.findById(req.params.id).populate({
      path: "counts",
      populate: { path: "participants" },
    });

    if (!userToFind) {
      throw new Error("Cannot find this User");
    }

    rep.send(userToFind);
  },
};

export const createTempUser: CreateTempUser = {
  schema: {
    body: CreateTempUserBodyJson,
    tags: ["user"],
  },
  handler: async function (req, rep) {
    const newUser = new User(req.body);

    await newUser.save();

    const token = this.jwt.sign({ ...newUser.getProps() });

    rep.status(201).send({ ...newUser.getProps(), token });
  },
};

export const register: RegisterUser = {
  schema: {
    body: RegisterUserBodyJson,
    tags: ["user"],
  },
  handler: async function (req, rep) {
    const passwordHash = await encryptPassword(req.body.password);

    const tempUser = await User.findByIdAndUpdate(req.user.id, {
      ...req.body,
      passwordHash,
    }).populate({
      path: "counts",
      populate: { path: "participants" },
    });

    const token = this.jwt.sign({ ...tempUser?.getProps() });

    rep.status(201).send({ ...tempUser?.getProps(), token });
  },
};

export const updateUser: UpdateUser = {
  schema: {
    tags: ["user"],
    params: UserIdParamsJson,
    body: UpdateUserBodyJson,
  },
  handler: async function (req, rep) {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate({
      path: "counts",
      populate: { path: "participants" },
    });

    rep.send(updatedUser);
  },
};

export const deleteUser: DeleteUser = {
  schema: {
    tags: ["user"],
    params: UserIdParamsJson,
  },
  handler: async function (req, rep) {
    const userToDelete = await User.findByIdAndRemove(req.params.id);
    rep.send({
      message: `The user with id ${userToDelete?.id} was deleted.`,
    });
  },
};
