const express = require('express');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const app = express();
app.use(express.json());

const initializeDbAndServer = async () => {
   try {
      db = await open({
         filename: dbPath,
         driver: sqlite3.Database,

      });
      app.listen(3000, () => {
         console.log("Server Running at http://localhost:3000/");

      });
   } catch (e) {
      console.log(`DB Error: ${e.message}`);
      process.exit(1);
   }
};
initializeDbAndServer();

convertDbObjectToResponseObject = (dbObject) => {
   return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
   };
}

//1 Get a list of all movie names in the movie table
app.get("/players/", async (request, response) => {
   const getPlayersQuery = `
   SELECT 
   * 
   FROM 
   cricket_team;`;
   const playersArray = await db.all(getPlayersQuery);
   response.send(playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
   ));

});

//2 ADD Player or a new movie in the movie table
app.post("/players/", async (request, response) => {
   const playerDetails = request.body;
   const { playerName, jerseyNumber, role } = playerDetails;
   const addPlayerQuery = `
   INSERT INTO cricket_team(player_name,jersey_number,role)
   VALUES(
      '${playerName}',
      '${jerseyNumber}',
      '${role}'
   );`;

   const dbResponse = await db.run(addPlayerQuery);
   const playerId = dbResponse.lastID;
   response.send("Player Added to Team");
});
//3 Get Player or a movie based on the movie ID 
app.get("/players/:playerId", async (request, response) => {
   const { playerId } = request.params;
   const getPlayerQuery = `
      SELECT * FROM cricket_team 
      WHERE player_id = ${playerId};`;
   const playersArray = await db.get(getPlayerQuery);
   response.send(playersArray);
});

//4 UPDATE player or details of a movie in the movie table based on the movie ID
app.put("/players/:playerId", async (request, response) => {
   const playerDetails = request.body;
   const { playerId } = request.params;
   const { playerName, jurseyNumber, role } = playerDetails;
   const updatePlayerQuery = `
   UPDATE cricket_team 
   SET 
      player_name = '${playerName}',
      jursey_number = '${jurseyNumber}',
      role = '${role}'
       WHERE player_id = ${playerId};`;
   await db.run(updatePlayerQuery);
   response.send("Player Details Updated")

});

// 5 DELETE player or Deletes a movie from the movie table based on the movie ID
app.delete("/players/:playerId", async (request, response) => {
   const { playerId } = request.params;
   const deletePlayerQuery = `
   DELETE FROM cricket_team 
       WHERE player_id = ${playerId};`;
   await db.run(deletePlayerQuery);
   response.send("Player Removed")

});

module.exports = app;

