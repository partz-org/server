import { encryptPassword } from "../../../src/routes/users/helper";
import { User } from "../../../src/schemas/user";
import { newUser } from "../../mocks";
import { app } from "../../setup";

describe("Should properly create a user", () => {
  test("should return an error if no valid user id is provided", async () => {
    const passwordHash = await encryptPassword(newUser.password);

    const result = await app.inject({
      method: "POST",
      url: "/users",
      payload: { ...newUser, passwordHash },
    });

    expect(result.payload).toContain(newUser.name);
    expect(result.statusCode).toEqual(201);
  });
});

describe("Should properly get users", () => {
  test("should return all users", async () => {
    const passwordHash = await encryptPassword(newUser.password);

    const createdUserOne = await User.create({ ...newUser, passwordHash });
    const createdUserTwo = await User.create({
      ...newUser,
      email: "Second@email.com",
      passwordHash,
    });

    const result = await app.inject({
      method: "GET",
      url: "/users",
    });

    expect(result.payload).toContain(createdUserOne.name);
    expect(result.payload).toContain(createdUserTwo.name);
  });
});

describe("Should properly udpate a newly created user", () => {
  test("should update the user with new data", async () => {
    const passwordHash = await encryptPassword(newUser.password);

    const createdUser = await User.create({ ...newUser, passwordHash });

    const result = await app.inject({
      method: "PUT",
      url: `/users/${createdUser.id}`,
      payload: {
        name: "New name!",
      },
    });

    expect(result.payload).toContain("New name!");
  });
});

describe("Should properly delete a newly created user", () => {
  test("should delete an user", async () => {
    const passwordHash = await encryptPassword(newUser.password);

    const createdUser = await User.create({ ...newUser, passwordHash });

    const result = await app.inject({
      method: "DELETE",
      url: `/users/${createdUser.id}`,
    });

    expect(result.payload).toEqual(
      `{"message":"The user with id ${createdUser.id} was deleted."}`
    );
  });
});
