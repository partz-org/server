import { newUser } from "./mocks";
import { app } from "./setup";

export const createUserWithToken = async () =>
  (
    await app.inject({
      method: "POST",
      url: "/users",
      payload: newUser,
    })
  ).json();
