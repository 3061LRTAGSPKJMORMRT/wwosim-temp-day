const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions

module.exports = async (client, guy) => {
  
  if (typeof guy !== "object") return false // makes sure if "guy" is an object, otherwise exit early
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  
  let isProtected = false
  // loop through each player to see if they are a doctor
  for (let player of alivePlayers) {
    
    // check and see if the player is a Doctor
    if (db.get(`player_${player}`).role === "Doctor") {
      
      // check and see if the Doctor protected the attacked player
      if (db.get(`player_${player}`).protection === guy.id) {
        
        // alert and exit early
        isProtected = true // set the protection to true
        let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
        await channel.send(`${getEmoji("heal", client)} Your protection saved **${players.indexOf(guy.id)+1} ${guy.username}**!`) // sends the message that they got alerted
        await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings alive in the channel
        break;
      }
    }
  }
  
  // return the isProtected value
  return isProtected 
  
}