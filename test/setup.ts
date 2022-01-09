// This file contains code that we reuse between our tests.
import Fastify from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import App from "../src/app";
import * as mongoose from "mongoose";
import { resetMongoose } from "../src/helpers/";

let mongod: any;

// Automatically build and tear down our instance
process.env.SECRET_KEY = "jemangedesfleurslmaoduculputaincestquoicesecret";

const app = Fastify();

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

  await app.register(App);
});

beforeEach(async () => {
  await resetMongoose(mongoose);
});

afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
  await app.close();
});

export { app };
