import getGameStats from "../services/gameService.js";

const getStatsForGameId = async (req, res, next) => {
    console.log("req(get stats for game id): ", req.params.game_id);
    
    const gameId = req.params.game_id;
    try {
        const db = req.app.locals.db;
        const stats = await getGameStats(gameId, db);
        res.json({ message: stats });
        next();
    } catch (e) {
        console.error(e.message);
        res.sendStatus(500) && next(e);
    }
}

export default getStatsForGameId
