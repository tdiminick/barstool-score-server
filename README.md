
# barstool-score-app

Barstool full stack code challenge

## Quick Start

1. open shell in folder you want project

2. clone project into folder - `git clone https://github.com/tdiminick/barstool-score-server.git`

3. install dependencies and start server - `cd barstool-score-server && npm install && npm start`

## Notes

**MongoDB** connection string, database name, collection name located in `server/config.js`

**PORT:** Server uses `process.env.PORT` if set, or `3001` as default; if not using `3001`, update the client, `client/package.json > proxy`, to use the *PORT* you have set
