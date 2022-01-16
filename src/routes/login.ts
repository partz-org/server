import { FastifyPluginAsync } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { Static, Type } from "@sinclair/typebox";
import { mapTempUserToSavedOne } from "../helpers/mapTempUserToSavedOne";
import { User } from "../schemas/user";

const LoginBodyJson = Type.Object({
  phoneNumber: Type.String(),
});

type LoginBody = Static<typeof LoginBodyJson>;

interface LoginRequest extends RouteGenericInterface {
  Body: LoginBody;
}

const login: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post<LoginRequest>("/login", {
    schema: {
      body: LoginBodyJson,
    },
    preValidation: fastify.getUserInfoIfLogged,
    handler: async (req, rep) => {
      const {
        user: { id: currentUserId },
      } = req;

      const { phoneNumber } = req.body;

      let registeredUser;

      registeredUser = await User.findOne({
        phoneNumber,
      });

      if (registeredUser) {
        await mapTempUserToSavedOne(currentUserId, registeredUser);
        await registeredUser.save();
      } else {
        registeredUser = await User.findByIdAndUpdate(
          currentUserId,
          { phoneNumber },
          { new: true }
        );
      }

      if (!registeredUser) {
        throw new Error(
          "Server error. Something went wrong while trying to log you in."
        );
      }

      const token = fastify.jwt.sign({ ...registeredUser.getProps() });

      rep.send({ ...registeredUser.getProps(), token });
    },
  });
};

export default login;
