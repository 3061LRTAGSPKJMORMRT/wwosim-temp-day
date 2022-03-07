const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions

module.exports = async (client, guy, attacker) => {
  
  if (typeof guy !== "object" || typeof attacker !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  
  let isProtected = false
  // loop through each player to see if they are a tough guy
  for (let player of alivePlayers) {
    
    // check and see if the player is a tough guy
    if (db.get(`player_${player}`).role === "Tough Guy") {
      
      // check and see if the tough guy protected the attacked player or is the attacked player
      if (db.get(`player_${player}`).protection === guy.id || guy.id === player) {
        
        // alert and exit early
        isProtected = true // set the protection to true
        let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
        await channel.send(`${getEmoji("guard", client)} Your fought off an attack ${guy.id === player.id ? "" : `while protecting **${players.indexOf(guy.id)+1} ${guy.username}**`} and saw that **${players.indexOf(attacker.id)+1} ${attacker.username} (attacker.role ${getEmoji(attacker.role?.toLowerCase().replace(/\s/g, "_"))})** was the attacker!\n\nYou will die at the end of the day.`) // sends the message that they got alerted
        await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings alive in the channel
        db.set(`player_${player}.wounded`, true) // set that they are wounded
        break; // break out of the loop
      }
    }
  }
  
  // return the isProtected value
  return isProtected 
  
}
