import { get } from 'node:https';
import { game_feed_url, database } from '../config.js';

const DB_NAME = database.db_name;
const COLL_NAME = database.coll_name;

// handle orchestrating data lookup and caching
const getGameStats = async (gameId, db) => {
    const updateCache = async (gameId, gameStats) => {
        const query = { gameId: gameId };
        const update = { $set: { gameId: gameId, lastModified: Date.now(), gameStats: gameStats }}
        const options = { upsert: true };

        await db.db(DB_NAME).collection(COLL_NAME).updateOne(query, update, options);
    }

    const gameDoc = await db.db(DB_NAME).collection(COLL_NAME).findOne({ gameId: gameId });

    // if we have a game doc and it is more recent than 15 secs ago - return happy
    if (gameDoc && gameDoc.lastModified >= Date.now() -15000) {
        return gameDoc.gameStats;
    }

    // either no saved doc or too old, so lets get a new one
    const gameStats = await callGameFeed(gameId);
    updateCache(gameId, gameStats, db);
    return gameStats;
}

// get latest data from game feed
const callGameFeed = async (gameId) => {
    const url = game_feed_url(gameId);

    return new Promise((resolve) => {
        let data = '';

        get(url, res => {
            res.on('data', chunk => { data += chunk });

            res.on ('end', () => {
            resolve(JSON.parse(data));
            })
        })
    })
}

export default getGameStats
