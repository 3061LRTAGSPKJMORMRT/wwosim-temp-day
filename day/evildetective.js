const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions
const doctor = require("./protection/doctor.js") // doctor protection
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const witch = require("./protection/witch.js") // witch protection
const jailer = require("./protection/jailer.js") // jailer protection
const redLady = require("./protection/redLady.js") // red lady protection
const bodyguard = require("./protection/bodyguard.js") // bodyguard protection
const toughGuy = require("./protection/toughGuy.js") // tough guy protection
const forger = require("./protection/forger.js") // forger protection
const ghostLady = require("./protection/ghostLady.js") // ghost lady protection

async function getProtections(client, guy, attacker) {
    
  let getResult;
  
  // check if the player they are attacking is healed by the beast hunter
  getResult = await beastHunter(client, guy, attacker) // checks if a beast hunter has a trap on them
  if (getResult === true) return false // exits early if a beast hunter DOES have a trap on them

  // check if the player they are attacking is jailed
  getResult = await jailer(client, guy, attacker) // checks if they are jailed
  if (getResult === true) return false // exits early if they are jailed

  // check if the player they are attacking is healed by the ghost lady
  getResult = await ghostLady(client, guy, attacker) // checks if a ghost lady is protecting them
  if (getResult === true) return false // exits early if a ghost lady IS protecting them

  // check if the player they are attacking is healed by the doctor
  getResult = await doctor(client, guy, attacker) // checks if a doctor is protecting them
  if (getResult === true) return false // exits early if a doctor IS protecting them

  // check if the player they are attacking is healed by the witch
  getResult = await witch(client, guy, attacker) // checks if a witch is protecting them
  if (getResult === true) return false // exits early if a witch IS protecting them

  // check if the player they are attacking is healed by the bodyguard
  getResult = await bodyguard(client, guy, attacker) // checks if a bodyguard is protecting them
  if (getResult === true) return false // exits early if a bodyguard IS protecting them

  // check if getResult isn't an object
    if (typeof getResult !== "object") {

    // check if the player they are attacking is healed by the tough guy
    getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
    if (getResult === true) return false // exits early if a tough guy IS protecting them

    // check if the player they are attacking is a red lady that got away visiting someone else
    getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
    if (getResult === true) return false // exits early if the red lady IS not home

    // check if the player they are protecting has the forger's sheild
    getResult = await forger(client, guy) // checks if the player has the forger's sheild
    if (getResult === true) return false // exits early if the player DOES have the forger's sheild
  }

  return typeof getResult === "object" ? getResult : guy // looks like there were no protections 

}

module.exports = async (client, alivePlayersBefore) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const evilDetectives = alivePlayersBefore.filter(p => db.get(`player_${p}`).role === "Evil Detective") // get the alive Evil Detectives array - Array<Snowflake>
  
  // loop through each evil detective
  for (let det of evilDetectives) {
    
    let attacker = db.get(`player_${det}`) // the attacker object - Object
    
    // check if the evil detective selected someone
    if (attacker.target) {
      
      // check if both of the target don't belong to the same team
      let [guy1, guy2] = attacker.target.map(t => db.get(`player_${t}`))
      if (guy1.team !== guy2.team || [guy1.team, guy2.team].includes("Solo")) {
        
        [guy1, guy2]
      
      } else {
        
        let channel = guild.channels.cache.get(attacker.channel)
        channel.send(``)
        
      }
    }
    
  }
  
  return true // exit early
  
}
