module.exports = {
  name: "day",
  run: async (message, args, client) => {
    
    const dayChat = message.guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
    const aliveRole = message.guild.roles.cache.find(r => r.name === "Alive") // get the alive role - Object
    const deadRole = message.guild.roles.cache.find(r => r.name === "Dead") // get the dead role - Object
    const players = db.get(`players`) // get the players
    
    let wolves = require("./day/wolves.js")
    let kittenwolf = require("./day/kittenWolf.js")
    let serialkillers = require("./day/wolves.js")
    let bandits = require("./day/wolves.js")
    let cannibals = require("./day/wolves.js")
    let zombies = require("./day/wolves.js")
    let corruptors = require("./day/wolves.js")
    let arsonists = require("./day/wolves.js")
    let bombers = require("./day/wolves.js")
    let illusionists = require("./day/wolves.js")
    let alchemists = require("./day/wolves.js")
    let sectleader = require("./day/wolves.js")
    let grumpygrandmas = require("./day/wolves.js")
    let beasthunters = require("./day/wolves.js")
    
    // forger doing their job

    // jack doing their job
    
    // prognosticator peace doing their job
    
    // serial killer doing their job
    
    // cannibal doing their job
    
    // hacker doing their job
    
    // dreamcatcher doing their job
    
    // wolves doing their job
    let getWolves = await wolves(client)
    if (getWolves !== false) { // checks if the wolves have killed someone
      
      // check if kww 
      if (db.get(`kittenWolfConvert`) === true) {
        await kittenwolf(client, getWolves.id)
      } else {
        if (getWolves.role === "Cursed") { // check if the role is cursed
           await kittenwolf(client, getWolves.id)
        } else {
          db.set(`player_${getWolves.id}.status`, "Dead") // otherwise kill the player normally
          await message.guild.members.cache.get(getWolves.id)?.roles.add(deadRole.id)
          await message.guild.members.cache.get(getWolves.id)?.roles.remove(aliveRole.id)
          await dayChat.send(`${getEmoji("werewolf", client)} The Werewolves killed **${players.indexOf(getWolves)+1} ${getWolves.username} (${getWolves.role} ${getEmoji(getWolves.role?.toLowerCase()?.replace(/\s/g, "_"))})**!`)
        }
        
        // check for berserk
        let allBerserks = db.get(`berserkProtected`) || []
        for (let bplayer of allBerserks) {
          if (db.get(`player_${bplayer}`).status === "Alive") {
            db.set(`player_${bplayer}.status`, "Dead")
            await message.guild.members.cache.get(bplayer)?.roles.add(deadRole.id) // add the dead role
            await message.guild.members.cache.get(bplayer)?.roles.remove(aliveRole.id) // remove the alive role
            await dayChat.send(`${getEmoji("frenzy", client)} The Werewolf frenzy killed **${players.indexOf(bplayer)+1} ${db.get(`player_${bplayer}`).username} (${db.get(`player_${bplayer}`).role} ${getEmoji(db.get(`player_${bplayer}`).role?.toLowerCase()?.replace(/\s/g, "_"))})**!`)
          }
        }
      }
    } else { 
      
      // send a message to the chat
      let wolfy = db.get(`wolvesVote`) || "0"
      if (wolfy !== "0") wolfy = db.get(`player_${`wolvesVote`}`)
      let errMesg = "attacked!"
      if (db.get(`kittenWolfConvert`) === true) errMesg = "could not be converted into a Werewolf! They were either protected, is a Headhunter's target, or they aren't from the village."
      await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(wolfy.id)+1} ${wolfy.username}** could not be ${errMesg}`)
    } 
    
  }
}


