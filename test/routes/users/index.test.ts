import { User } from "../../../src/schemas/user";
import { newUser } from "../../mocks";
import { app } from "../../setup";

const createUser = async () => await User.create(newUser);

describe("Should properly create a user", () => {
  test("should properly create a user", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/users",
      payload: newUser,
    });

    expect(result.payload).toContain(newUser.expoToken);
    expect(result.statusCode).toEqual(201);
  });
});

describe("Should properly get users", () => {
  test("should return all users", async () => {
    const createdUserOne = await createUser();
    const createdUserTwo = await User.create({ expoToken: "hrererfplze^f" });

    const result = await app.inject({
      method: "GET",
      url: "/users",
    });

    expect(result.payload).toContain(createdUserOne.expoToken);
    expect(result.payload).toContain(createdUserTwo.expoToken);
  });
});

describe("Should properly udpate a newly created user", () => {
  test("should update the user with new data", async () => {
    const createdUser = await createUser();

    const result = await app.inject({
      method: "PUT",
      url: `/users/${createdUser.id}`,
      payload: {
        expoToken: "New token!",
      },
    });

    expect(result.payload).toContain("New token!");
  });
});

describe("Should properly delete a newly created user", () => {
  test("should delete an user", async () => {
    const createdUser = await createUser();
    const result = await app.inject({
      method: "DELETE",
      url: `/users/${createdUser.id}`,
    });

    expect(result.payload).toEqual(
      `{"message":"The user with id ${createdUser.id} was deleted."}`
    );
  });
});
