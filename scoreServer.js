import express from "express";
import getScoreboard from "./controllers/scoreboardController.js";
import getStatsForGameId from "./controllers/gameController.js";
import { MongoClient } from "mongodb";
import { database } from './config.js';

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/scoreboard", getScoreboard);

app.get("/game/:game_id", getStatsForGameId);

MongoClient.connect(database.uri)
    .catch(err => console.error(err.stack))
    .then(db => {
        app.locals.db = db;
        app.listen(PORT, () => {
            console.log(`node.js server listening on port: ${PORT}`);
        });
    });
