import { Mongoose } from "mongoose";

export const resetMongoose = async (mongoose: Mongoose) => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.drop();
  }
};
