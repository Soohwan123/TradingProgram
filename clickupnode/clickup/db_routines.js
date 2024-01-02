import { MongoClient } from "mongodb";
import got from "got";
import * as cfg from "./config.js";
let db;
const getDBInstance = async () => {
  if (db) {
    console.log("using established connection");
    return db;
  }
  try {
    const client = new MongoClient(cfg.atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("establishing new connection to Atlas");
    const conn = await client.connect();
    db = conn.db(cfg.appdb);
  } catch (err) {
    console.log(err);
  }
  return db;
};

const createNewArrayWithSpecificProperties = async (alertJSON, countryJSON) => {
  try {
    if (alertJSON === null || countryJSON == null) {
      console.log("Error occured");
    } else {
      let result = countryJSON.map((countryItem) => {
        let alert = Object.values(alertJSON.data).find(
          (alertItem) => alertItem["country-iso"] === countryItem["alpha-2"]
        );
        return {
          country: countryItem["alpha-2"], //country
          name: countryItem["name"], //country
          text: alert ? alert.eng["advisory-text"] : `No travel alerts`, //alert
          date: alert ? alert["date-published"]["date"] : ``, //alert
          region: countryItem["region"], //country
          subregion: countryItem["sub-region"], //country
        };
      });
      return result;
    }
  } catch (err) {
    console.log(err);
  }
};
const getJSONFromWWWPromise = (url) => got(url).json();
const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);
const count = (db, coll) => db.collection(coll).countDocuments();
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});
const deleteOne = (db, coll, criteria) =>
  db.collection(coll).deleteOne(criteria);
const addMany = (db, coll, docs) => db.collection(coll).insertMany(docs);
const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);
const findAll = (db, coll, criteria, projection) =>
  db.collection(coll).find(criteria).project(projection).toArray();
const findUniqueValues = (db, coll, field) =>
  db.collection(coll).distinct(field);
const updateOne = (db, coll, criteria, projection) =>
  db
    .collection(coll)
    .findOneAndUpdate(criteria, { $set: projection }, { rawResult: true });
const pushOne = (db, coll, criteria, projection) =>
  db.collection(coll).findOneAndUpdate(
    criteria,
    {
      $push: {
        following: projection,
      },
    },
    { rawResult: true }
  );
const popOne = (db, coll, criteria, projection) =>
  db.collection(coll).findOneAndUpdate(
    criteria,
    {
      $pull: {
        following: projection,
      },
    },
    { rawResult: true }
  );
const replaceOne = (db, coll, criteria, projection) =>
  db
    .collection(coll)
    .findOneAndUpdate(criteria, { $set: projection }, { rawResult: true });
export {
  findUniqueValues,
  getDBInstance,
  getJSONFromWWWPromise,
  addOne,
  count,
  deleteAll,
  deleteOne,
  addMany,
  findOne,
  findAll,
  createNewArrayWithSpecificProperties,
  updateOne,
  pushOne,
  popOne,
  replaceOne,
};
