import * as bcrypt from "bcrypt";

export const encryptPassword = async (password?: string) => {
  if (!password) {
    return;
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
};
