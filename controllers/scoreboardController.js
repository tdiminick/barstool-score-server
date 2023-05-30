import getGameStats from "../services/gameService.js";

const getScoreboard = async (req, res, next) => {
    console.log("req(get scoreboard): ");
    
    // this would be done with a query instead of a list passed in
    const gamesToDisplay = [
        "6c974274-4bfc-4af8-a9c4-8b926637ba74",
        "eed38457-db28-4658-ae4f-4d4d38e9e212",
    ];

    try {
        // could add filtering to the request to only lookup certain sports, dates, etc
        // presumably this would be by date, you could do that by accepting a date parameter and looking up games by
        // that date. I just made it accept a list above.
        const db = req.app.locals.db;
        const scoreboardVM = await buildScoreboard(db, gamesToDisplay);
        res.json({ message: scoreboardVM });
        next();
    } catch (e) {
        console.error(e.message);
        res.sendStatus(500) && next(e);
    }
}

const buildScoreboard = async (db, gamesToDisplay) => {
    // presumably this would be by date, you could do that by accepting a date parameter and looking up games by
    // that date. since I was just given the two games, I just made a generic game lookup method that would look
    // up any games in the list above.
    const games = await Promise.all(gamesToDisplay.map(async (gameId) =>
        getScoreboardInfo(gameId, await getGameStats(gameId, db))
    ));

    // loop through games, push into {league, []} dict, where each entry is the league name and then the array of scores to display
    const leagueScoresDict = {};
    games.forEach(g => {
        if (!leagueScoresDict[g.league]) {
            leagueScoresDict[g.league] = [];
        }
        leagueScoresDict[g.league].push(g);
    });
    // create VM -> returns a list of objects
    // { league: 'sb', scores: [] } scores is the array of scores for each league
    const scoreboardVM = [];
    for (let key in leagueScoresDict) {
        scoreboardVM.push({ league: key, scores: leagueScoresDict[key] });
    }
    return scoreboardVM;
}

const getScoreboardInfo = (gameId, gameStats) => {
    if (gameStats.league == "MLB") {
        return getMlbScoreboardInfo(gameId, gameStats);
    } else if (gameStats.league == "NBA") {
        return getNbaScoreboardInfo(gameId, gameStats);
    } else {
        throw new Error("League type unknown");
    }
}

// this would be in an "MLB" VM class that would handle all things MLB VM related
const getMlbScoreboardInfo = (gameId, gameStats) => {
    return {
        "game_id": gameId,
        "league": gameStats.league,
        "away_team": gameStats.away_team.abbreviation,
        "home_team": gameStats.home_team.abbreviation,
        "away_team_score": gameStats.away_batter_totals.runs,
        "home_team_score": gameStats.home_batter_totals.runs,
        "game_state": getMlbGameState(gameStats),
        "game_date": gameStats.event_information.start_date_time
    }
}

// this would be in an "NBA" VM class that would handle all things MLB VM related
const getNbaScoreboardInfo = (gameId, gameStats) => {
    return {
        "game_id": gameId,
        "league": gameStats.league,
        "away_team": gameStats.away_team.abbreviation,
        "home_team": gameStats.home_team.abbreviation,
        "away_team_score": gameStats.away_totals.points,
        "home_team_score": gameStats.home_totals.points,
        "game_state": getNbaGameState(gameStats),
        "game_date": gameStats.event_information.start_date_time
    }
}

// this would be in an "NBA" VM class that would handle all things MLB VM related
const getNbaGameState = (gameStats) => {
    if (gameStats.event_information.status === "completed") {
        return "Final";
    } else {
        // the example is a completed game, so not sure how the in progress/pregame data looks
        // just a small snippet to show I thought about other cases
        return gameStats.home_period_scores.length + " period";
    }
}

// this would be in an "MLB" VM class that would handle all things MLB VM related
const getMlbGameState = (gameStats) => {
    if (gameStats.event_information.status === "completed") {
        return "Final";
    } else {
        // the example is a completed game, so not sure how the in progress/pregame data looks
        // just a small snippet to show I thought about other cases
        return gameStats.home_period_scores.length + " inning";
    }
}

export default getScoreboard
