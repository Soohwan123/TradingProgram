import * as dbRtns from "./db_routines.js";
import * as cfg from "./config.js";
import axios from 'axios';
const resolvers = {
  users: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.coll, { status: args.status });
  },
  discussions: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, cfg.disscussioncoll, {
      status: args.status,
    });
  },
  deleteuser: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.deleteOne(db, cfg.coll, {
      email: args.email,
    });
  },
  deletefollowing: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.popOne(
      db,
      cfg.coll,
      { email: args.email },
      { account: args.account }
    );
    return results.acknowledged ? "Fail" : "Success";
  },
  deletediscussion: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.deleteOne(db, cfg.disscussioncoll, {
      opinion: args.opinion,
    });
  },
  adduser: async (args) => {
    let db = await dbRtns.getDBInstance();
    let user = {
      email: args.email,
      password: args.password,
      following: args.following,
    };
    let results = await dbRtns.addOne(db, cfg.coll, user);
    return results.acknowledged ? user : null;
  },
  addfollowing: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.pushOne(
      db,
      cfg.coll,
      { email: args.email },
      {
        account: args.account,
      }
    );
    return results.acknowledged ? "Fail" : "Success";
  },
  adddiscussion: async (args) => {
    let db = await dbRtns.getDBInstance();
    let discussion = {
      opinion: args.opinion,
      date: args.date,
      author: args.author,
    };
    let results = await dbRtns.addOne(db, cfg.disscussioncoll, discussion);
    return results.acknowledged ? discussion : null;
  },
  updateuser: async (args) => {
    let db = await dbRtns.getDBInstance();
    let updateResults = await dbRtns.updateOne(
      db,
      cfg.coll,
      {
        email: args.originalEmail,
      },
      {
        email: args.email,
        password: args.password,
      }
    );
    return updateResults.lastErrorObject.updatedExisting ? "Success" : "Fail";
  },
  updatefollowing: async (args) => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.replaceOne(
      db,
      cfg.coll,
      { email: args.email },
      { [`following.${args.index}`]: args.following }
    );
    return results.acknowledged ? "Fail" : "Success";
  },
  updatediscussion: async (args) => {
    let db = await dbRtns.getDBInstance();
    let updateResults = await dbRtns.updateOne(
      db,
      cfg.disscussioncoll,
      {
        opinion: args.originalOpinion,
      },
      {
        opinion: args.opinion,
        date: args.date,
        author: args.author,
      }
    );
    return updateResults.lastErrorObject.updatedExisting ? "Success" : "Fail";
  },

  snps: async (args) => {
    try {  
      const response = await axios.get(
        `https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC`
      );
      console.log(response.data.chart.result[0].indicators.quote[0].high);
      console.log(response.data.chart.result[0].timestamp);
      let result = {
        timestamp : [],
        indicators : [],
      };
      result.timestamp = response.data.chart.result[0].timestamp;
      result.indicators =response.data.chart.result[0].indicators.quote[0].high;
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }

    return response;
  },
};
export { resolvers };
