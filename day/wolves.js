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

module.exports = async client => {
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const strongWolves = [
    "Werewolf", 
    "Junior Werewolf",
    "Split Wolf",
    "Nightmare Werewolf", 
    "Kitten Wolf", 
    "Wolf Shaman", 
    "Wolf Pacifist",
    "Shadow Wolf", 
    "Guardian Wolf", 
    "Werewolf Berserk", 
    "Alpha Werewolf", 
    "Wolf Trickster",
    "Wolf Seer", 
    "Lone Wolf"
  ] // list the wolves from weakest to strongest

  
  let votes = {} // make an object to store the votes - Object<UserId, Vote>
  let toKill = "0" // store a player to kill, in string - String
  
  // get the wekeast wolf in game
  let weakestWolf = alivePlayers.filter(a => strongWolves.includes(db.get(`player_${a}`))).map(a => [a, db.get(`player_${a}`).role]).sort((a, b) => strongWolves.indexOf(b[1]) - strongWolves.indexOf(a[1])) // fillter the wolves and check if there are any
  if (!weakestWolf) return toKill // exit early if no wolf was found
  
  let attacker = db.get(`player_${weakestWolf[0][0]}`) // get the attacker object
  
  // loop through all the alive players and get the votes from werewolves
  alivePlayers.forEach(player => {
    
    // check if the player belongs to the werewolf team
    if (db.get(`player_${player}`).team === "Werewolf") {
      if (!votes[player]) votes[player] = 0 // if the key doesn't exist, create one
      votes[player] = db.get(`player_${player}`).vote // adds the vote      
      db.delete(`player_${player}.vote`) // delete the votes to reset for the next night
    }
  })
  
  // define an object to store a key value pair 
  let voteObject = {} // normal vote object - Object
  
  // loop through each vote and add it to the object
  Object.values(votes).forEach(vote => {
    if (!voteObject[vote]) voteObject[vote] = 0 // if the key doesn't exist, create one
    voteObject[vote]++ // increment the value by 1 for the key
  })
  
  // make a 2d array with [vote, quantity] pair and sort them
  let totalVotes = Object.entries(voteObject).sort((a, b) => b[1] - a[1]) // makes a 2d array, ands sorts them by vote count
  
  // check if there are more than 0 votes
  if (totalVotes.length > 0) {
    
    // check if there are more than 1 vote
    if (totalVotes.length === 1) toKill = totalVotes[0][0]
        
    // check if there is a tied voted
    if (totalVotes[0][1] === totalVotes[1][1]) {
        
      let allSameVotes = totalVotes.filter(v => v[1] === totalVotes[0][1]) // filter to only votes that are tied
      let filteredVotes = Object.entries(votes).filter(x => allSameVotes.map(a => a[0]).includes(x[1])) // get the votes in an array but filtered 
      let wolvesRank = filteredVotes.map(x => db.get(`role_${x[0]}`).role) // get all werewolves' role
      
      // sort the wolves in wolvesRank from weakest to strongest
      let sortedWolves = wolvesRank.map(a => strongWolves.indexOf(a)).sort((a, b) => b - a) // we map the wolves into numbers, then sort the numbers from big to small
      
      // check if the first and second wolf number is same
      if (sortedWolves[0] === sortedWolves[1]) {
        
         // get the last strongest wolf who votes the player
        toKill = Object.entries(votes).filter(v => strongWolves.indexOf(db.get(`player_${v[0]}`).role) === sortedWolves[0]).pop()[1] // gets the last strongest werewolf who voted
      } else {
        
        // get the voted player by the strongest wolf
        toKill = Object.entries(votes).filter(v => db.get(`player_${v[0]}`).role === strongWolves[sortedWolves[0]]).pop()[1] // gets the strongest werewolf who voted
      }
      
    }
    
    let guy = db.get(`player_${players[Number(toKill)-1]}`) // get the user for the voted player
    let role = guy.role
    
    let kwwDied = db.get(`kittenWolfConvert`)
    
    // protection part
    
    // check if the player is a solo killer
    if (["Bandit", "Corruptor", "Cannibal", "Illusionist", "Serial Killer", "Arsonist", "Bomber", "Alchemist", "Hacker", "Dreamcatcher"].includes(role)) return false // exit early if they are a solo killer
    
    let getResult;    
    
    // check if kwwDied and check if they do not belong to the village or are the headhunter's target
    if (kwwDied === true) {
      
      let headhunterTargets = [] // an array of headhunter targets to be put in - Array<Snowflake>
      
      // get all the headhunter targets
      alivePlayers.forEach(player => {
        
        // check if their role is Headhunter
        if (db.get(`player_${player}`).role === "Headhunter") { 
          headhunterTargets.push(db.get(`player_${player}`).headhunterTarget) // adds the headhunter's target to the list
        }
      })
      
      // check if they are a headhunter's target or do not belong to the village team
      if (guy.team !== "Village" || headhunterTargets.includes(guy.id)) return false // exit early since they do not belong to the village or are the headhunter's target
      
    }
    
    // check if the player they are attacking is healed by the beast hunter
    getResult = await beastHunter(client, guy) // checks if a beast hunter has a trap on them
    if (getResult === true) return false // exits early if a beast hunter DOES have a trap on them
    
    // check if the player they are attacking is jailed
    getResult = await jailer(client, guy) // checks if they are jailed
    if (getResult === true) return false // exits early if they are jailed
    
    // check if the player they are attacking is healed by the ghost lady
    getResult = await ghostLady(client, guy) // checks if a ghost lady is protecting them
    if (getResult === true) return false // exits early if a ghost lady IS protecting them
    
    // check if the player they are attacking is healed by the doctor
    getResult = await doctor(client, guy) // checks if a doctor is protecting them
    if (getResult === true) return false // exits early if a doctor IS protecting them
    
    // check if the player they are attacking is healed by the witch
    getResult = await witch(client, guy) // checks if a witch is protecting them
    if (getResult === true) return false // exits early if a witch IS protecting them
    
    // check if the player they are attacking is healed by the bodyguard
    getResult = await bodyguard(client, guy) // checks if a bodyguard is protecting them
    if (getResult === true) return false // exits early if a bodyguard IS protecting them
    
    // check if getResult isn't an object
      if (typeof getResult !== "object") {
        
      // check if the player they are attacking is healed by the tough guy
      getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
      if (getResult === true) return false // exits early if a tough guy IS protecting them

      // check if the player they are attacking is a red lady that got away visiting someone else
      getResult = await redLady(client, guy) // checks if the red lady is not home
      if (getResult === true) return false // exits early if the red lady IS not home

      // check if the player they are protecting has the forger's sheild
      getResult = await forger(client, guy) // checks if the player has the forger's sheild
      if (getResult === true) return false // exits early if the player DOES have the forger's sheild
    }
    
    return typeof getResult === "object" ? getResult : guy // looks like there were no protections    
    
  } else {
    return false // exit early if wolves selected no one to kill
  }
  
  
}
