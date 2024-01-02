"use strict";
import * as cfg from "./config.js";
import Fastify from "fastify";
import mercurius from "mercurius";
import cors from "@fastify/cors";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";


const app = Fastify();
app.get('/api/stock-data', async (req, res) => {
  try {
    const apiUrl = `https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC`;

    const response = await axios.get(apiUrl);

    res.send(response.data.chart.result);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.register(cors, {
  origin: 'http://localhost:5173',
});
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});
app.listen({ port: cfg.port });
