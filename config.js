export const game_feed_url = (gameId) => `https://chumley.barstoolsports.com/dev/data/games/${gameId}.json`;

export const database = {
    uri: "mongodb+srv://node-bs:nodeBS1234@dev-cluster-0.dp2zdw4.mongodb.net/?retryWrites=true&w=majority",
    db_name: "barstool-games",
    coll_name: "games"
}