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

      const userdToLoggout = await User.findById(currentUserId);

      if (!userdToLoggout) {
        throw new Error(
          "Couldn't log you out. Try clearing out the app's cache."
        );
      }

      const newTempUser = await User.create({
        expoToken: userdToLoggout.expoToken,
      });

      const token = fastify.jwt.sign({ ...newTempUser.getProps() });

      rep.send({ ...newTempUser.getProps(), token });
    },
  });
};

export default loggout;
