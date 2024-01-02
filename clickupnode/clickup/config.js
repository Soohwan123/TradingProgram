import { config } from "dotenv";
config();
export const atlas = process.env.DBURL;
export const appdb = process.env.DB;
export const coll = process.env.COLLECTION;
export const disscussioncoll = process.env.DISCUSSIONCOLLECTION;
export const port = process.env.PORT;
export const graphql = process.env.GRAPHQLURL;
