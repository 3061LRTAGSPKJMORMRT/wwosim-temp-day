module.exports = {
  name: "day",
  run: async (message, args, client) => {
    
    const dayChat = message.guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
    const aliveRole = message.guild.roles.cache.find(r => r.name === "Alive") // get the alive role - Object
    const deadRole = message.guild.roles.cache.find(r => r.name === "Dead") // get the dead role - Object
    const players = db.get(`players`) // get the players
    const alivePlayers = players.fillter(player => db.get(`player_${player}`).status === "Alive")
    const deadPlayers = players.filter(player => !alivePlayers.includes(player))
    
    // get all the actions
    let { wolves, beastHunterKilling } = require("./day/wolves.js")
    let kittenwolf = require("./day/kittenWolf.js")
    let serialkillers = require("./day/serialkillers.js")
    let accomplices = require("./day/accomplices.js")
    let bandits = require("./day/bandits.js")
    let cannibals = require("./day/cannibals.js")
    let zombies = require("./day/zombies.js")
    let corruptors = require("./day/corruptors.js")
    let arsonists = require("./day/arsonists.js")
    let bombers = require("./day/wolves.js")
    let illusionists = require("./day/illusionists.js")
    let dreamcatchers = require("./day/dreamcatchers.js")
    let alchemists = require("./day/alchemists.js")
    let sectleaders = require("./day/sectleaders.js")
    let evildetectives = require("./day/evildetectives.js")
    let hackers = require("./day/hackers.js")
    let grumpygrandmas = require("./others/grumpygrandmas.js")
    let mediums = require("./others/mediums.js")
    
    // wolves function because berserk, urgh
    function theWolves() {
      let getWolves = await wolves(client, alivePlayers)
      if (getWolves !== false) { // checks if the wolves have killed someone

        // check if kww 
        if (db.get(`kittenWolfConvert`) === true) {
          await kittenwolf(client, getWolves.id)
        } else {
          if (getWolves.role === "Cursed") { // check if the role is cursed
             await kittenwolf(client, getWolves.id)
          } else {
            db.set(`player_${getWolves.id}.status`, "Dead") // otherwise kill the player normally
            let attackedPlayer = await message.guild.members.fetch(getWolves.id) // get the discord member - Object
            let attackedPlayerRoles = attackedPlayer.roles.cache.map(r => r.name === "Alive" ? "892046207428476989" : r.id) // get the discord roles - Array<Snowflake>
            await attackedPlayer.roles.set(attackedPlayerRoles) // set the correct roles
            await dayChat.send(`${getEmoji("werewolf", client)} The Werewolves killed **${players.indexOf(getWolves)+1} ${getWolves.username} (${getWolves.role} ${getEmoji(getWolves.role?.toLowerCase()?.replace(/\s/g, "_"))})**!`)
          }

          // check for berserk
          let allBerserks = db.get(`berserkProtected`) || []
          for (let bplayer of allBerserks) {
            if (db.get(`player_${bplayer}`).status === "Alive") {
              db.set(`player_${bplayer}.status`, "Dead")
              let attackedPlayer = await message.guild.members.fetch(bplayer) // get the discord member - Object
              let attackedPlayerRoles = attackedPlayer.roles.cache.map(r => r.name === "Alive" ? "892046207428476989" : r.id) // get the discord roles - Array<Snowflake>
              await attackedPlayer.roles.set(attackedPlayerRoles) // set the correct roles
              await dayChat.send(`${getEmoji("frenzy", client)} The Werewolf frenzy killed **${players.indexOf(bplayer)+1} ${db.get(`player_${bplayer}`).username} (${db.get(`player_${bplayer}`).role} ${getEmoji(db.get(`player_${bplayer}`).role?.toLowerCase()?.replace(/\s/g, "_"))})**!`)
            }
          }
        }
      } else { 

        // send a message to the chat
        let wolfy = db.get(`wolvesVote`) || "0"
        if (wolfy !== "0") wolfy = db.get(`player_${`wolvesVote`}`)
        let errMesg = "attacked!"
        if (db.get(`kittenWolfConvert`) === true) errMesg = "converted into a Werewolf! They were either protected, is a Headhunter's target, or they aren't from the village."
        await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(wolfy.id)+1} ${wolfy.username}** could not be ${errMesg}`)
      }
    }
    
    // forger doing their job

    // jack doing their job
    
    // prognosticator peace doing their job
    
    // if berserk is activated, wolves come first
    if (db.get(`isBerserkActive`) === true) {
      await theWolves()
    }
    
    // cannibal doing their job
    await cannibals(client, alivePlayers)
    
    // serial killer doing their job
    await serialkillers(client, alivePlayers)
    
    // bandits doing their job
    await accomplices(client, alivePlayers)
    
    // hacker doing their job
    await hackers(client, alivePlayers)
    
    // dreamcatcher doing their job
    await dreamcatchers(client, alivePlayers)
    
    // wolves doing their job last if berserk is not active
    if (db.get(`isBerserkActive`) !== true) {
      await theWolves()
    }
    
    // evil detective doing their job
    await evildetectives(client, alivePlayers)
    
    // bandit conversion
    await bandits(client)
    
    // bh killing a wolf
    await beastHunterKilling(client)
    
    // medium reviving
    await mediums(client)
    
    // grumpy grandma muting
    await grumpygrandmas(client)
    
    // zombies converting and biting
    await zombies(client, alivePlayers)
    
    // sect leader converting
    await sectleaders(client)
    
    // arsonist dousing
    await arsonists(client)
    
    // corruptor corrupting
    await corruptors(client)
    
    // alchemist giving potion
    await alchemists(client)
    
    // illusionist disguising
    await illusionists(client)
    
  }
}
