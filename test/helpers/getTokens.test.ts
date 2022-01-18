import { getTokensExceptOwner } from "../../src/utils/notifications";
import { ParticipantDoc } from "../../src/schemas/participant";

const mockParticipants = [
  {
    name: "Zdzd",
    balance: 0,
    credit: 309,
    debit: 309,
    debtors: [],
    creditors: [],
  },
  {
    name: "Qzdqzd",
    balance: 0,
    credit: 309,
    debit: 309,
    debtors: [],
    creditors: [],
    user: {
      name: "Guest",
      expoToken: "cE7rtzqGR-qWmKfe5TIJbI7WQZGVZL1oVGI4rZ9Ht",
      role: "guest",
      __v: 2,
      id: "6171a6851d32b026d0d36e44",
    },
  },
  {
    name: "Zzf",
    balance: 0,
    credit: 309,
    debit: 309,
    debtors: [],
    creditors: [],
  },
  {
    name: "Qzd",
    balance: 0,
    credit: 309,
    debit: 309,
    debtors: [],
    creditors: [],
    user: {
      name: "Guest",
      expoToken:
        "cE7rtzqGR-qWmKfe5TIJps:APA91bG3swBbkVN_cNmmnvDOKPqbOvUcfRVC8z9dk0tR2HCq9e_FHQnJwdet5dn_mfBhseqC-qj7hh_eZgYxH0SoxVYcyN9mVQr2XSzRlQZ1rzeJSPC1XCWbI7WQZGVZL1oVGI4rZ9Ht",
      role: "guest",
      __v: 2,
      id: "6171a6851d32b026d0d36e44",
    },
  },
];

describe("Should properly return user tokens", () => {
  test("should properly get the token expected", () => {
    const tokens = getTokensExceptOwner(
      mockParticipants as unknown as ParticipantDoc[],
      "owner"
    );

    expect(tokens).toEqual([
      "cE7rtzqGR-qWmKfe5TIJbI7WQZGVZL1oVGI4rZ9Ht",
      "cE7rtzqGR-qWmKfe5TIJps:APA91bG3swBbkVN_cNmmnvDOKPqbOvUcfRVC8z9dk0tR2HCq9e_FHQnJwdet5dn_mfBhseqC-qj7hh_eZgYxH0SoxVYcyN9mVQr2XSzRlQZ1rzeJSPC1XCWbI7WQZGVZL1oVGI4rZ9Ht",
    ]);
  });

  test("should not return the token of the owner", () => {
    const tokens = getTokensExceptOwner(
      mockParticipants as unknown as ParticipantDoc[],
      "Qzdqzd"
    );

    expect(tokens).toEqual([
      "cE7rtzqGR-qWmKfe5TIJps:APA91bG3swBbkVN_cNmmnvDOKPqbOvUcfRVC8z9dk0tR2HCq9e_FHQnJwdet5dn_mfBhseqC-qj7hh_eZgYxH0SoxVYcyN9mVQr2XSzRlQZ1rzeJSPC1XCWbI7WQZGVZL1oVGI4rZ9Ht",
    ]);
  });
});
