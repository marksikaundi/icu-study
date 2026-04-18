import {
  Account,
  Client,
  Databases,
  ID,
  InputFile,
  Permission,
  Query,
  Role,
  Storage,
} from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69e351c40030ad9ed4d3");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, InputFile, Permission, Query, Role };
