import { FastifyPluginAsync } from "fastify";
import { User } from "../schemas/user";

const loggout: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post("/logout", {
    preValidation: fastify.getUserInfoIfLogged,
    schema: {
      body: { additionalProperties: false },
    },
    handler: async (req, rep) => {
      const {
        user: { id: currentUserId },
      } = req;

      const userdToLoggout = await User.findByIdAndUpdate(
        currentUserId,
        {
          isLoggedIn: false,
        },
        { new: true }
      );

      if (!userdToLoggout) {
        throw new Error(
          "Server error. Something went wrong while trying to log you in."
        );
      }

      const token = fastify.jwt.sign({ ...userdToLoggout.getProps() });

      rep.send({ ...userdToLoggout.getProps(), token });
    },
  });
};

export default loggout;
