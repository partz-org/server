import { app } from "../setup";

import { createUserWithToken } from "../helpers";

describe("Should properly Login", () => {
  test("should properly login user with good statusCode when correct payload is provided", async () => {
    const { token } = await createUserWithToken();

    const phoneNumber = "+33626280529";
    const result = await app.inject({
      method: "POST",
      url: "/login",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: { phoneNumber },
    });

    expect(result.payload).toContain(phoneNumber);
    expect(result.statusCode).toEqual(200);
  });

  test("should not log user with invalid body", async () => {
    const { token } = await createUserWithToken();

    const result = await app.inject({
      method: "POST",
      url: "/login",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {},
    });

    expect(result.payload).toContain("Bad Request");
    expect(result.payload).toContain(
      "body should have required property 'phoneNumber"
    );
    expect(result.statusCode).toEqual(400);
  });
});
