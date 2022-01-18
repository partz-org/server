import { app } from "../setup";

import { createUserWithToken } from "../helpers";

describe("Should properly Logout", () => {
  test("should properly logout user with good statusCode and remove phone number", async () => {
    const { token: tokenWithoutPhone } = await createUserWithToken();

    const phoneNumber = "+33626280529";

    const { token: tokenWithPhone, ...userLoggedIn } = (
      await app.inject({
        method: "POST",
        url: "/login",
        headers: {
          authorization: `Bearer ${tokenWithoutPhone}`,
        },
        payload: { phoneNumber },
      })
    ).json();

    const userLoggedOut = (
      await app.inject({
        method: "POST",
        url: "/logout",
        headers: {
          authorization: `Bearer ${tokenWithPhone}`,
        },
        payload: { phoneNumber },
      })
    ).json();

    expect(userLoggedIn.phoneNumber).toEqual(phoneNumber);
    expect(userLoggedOut.phoneNumber).toBeUndefined();
  });
});
