const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())

const dbpath = path.join(__dirname, 'cricketTeam.db')
let database = null
const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB error : ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT
   * 
  FROM 
  cricket_team;`
  const playersList = await database.all(getPlayersQuery)
  const ans = playersList => {
    return {
      playerId: playersList.player_id,
      playerName: playersList.player_name,
      jerseyNumber: playersList.jersey_number,
      role: playersList.role,
    }
  }
  response.send(playersList.map(eachplayer => ans(eachplayer)))
})

//module.exports = app

/*
//API 2
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_name, jersey_number, role} = playerDetails
  const addPlayerQuery = `
  INSERT INTO cricket_team(player_name, jersey_number, role)
  VALUES ('${player_name}','${jersey_number}','${role}');
  `
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

//API 3
app.get('/players/:playerId/', async (request, response) => {
  const {player_Id} = request.params
  const getPlayersQuery = `
    SELECT *FROM cricket_team WHERE player_id = ${player_Id};
    `
  const dbResponse = await db.get(getPlayersQuery)
  response.send(dbResponse)
})

//API 4
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateTableQuery = `
   UPDATE
   cricket_team 
   SET 
   player_name = '${playerName}'
   jersey_number = '${jerseyNumber}'
   role = '${role}'
   WHERE
      player_id = ${playerId};`
  await database.run(updateTableQuery)
  response.send('Player Details Updated')
})

//API 5
*/
