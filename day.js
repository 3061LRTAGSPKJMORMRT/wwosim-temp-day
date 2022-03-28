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
    let { wolves, beastHunterKilling } = require("./killingActions/wolves.js")
    let kittenwolf = require("./killingActions/kittenWolf.js")
    let serialkillers = require("./killingActions/serialkillers.js")
    let accomplices = require("./killingActions/accomplices.js")
    let bandits = require("./killingActions/bandits.js")
    let cannibals = require("./killingActions/cannibals.js")
    let zombies = require("./killingActions/zombies.js")
    let corruptors = require("./killingActions/corruptors.js")
    let arsonists = require("./killingActions/arsonists.js")
    let bombers = require("./killingActions/wolves.js")
    let illusionists = require("./killingActions/illusionists.js")
    let dreamcatchers = require("./killingActions/dreamcatchers.js")
    let alchemists = require("./killingActions/alchemists.js")
    let sectleaders = require("./killingActions/sectleaders.js")
    let evildetectives = require("./killingActions/evildetectives.js")
    let hackers = require("./killingActions/hackers.js")
    let grumpygrandmas = require("./others/grumpygrandmas.js")
    let mediums = require("./others/mediums.js")
    let forgers = require("./others/forgers.js")
    let graverobbers = require("./others/graverobbers.js")
    let channels = require("./others/channels.js")
    
    // forger doing their job
    await forgers(client)

    // jack doing their job
    
    // prognosticator peace doing their job
    
    // if berserk is activated, wolves come first
    if (db.get(`isBerserkActive`) === true) {
      await wolves(client, alivePlayers)
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
      await wolves(client, alivePlayers)
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
    
    // grave robber getting role
    await graverobbers(client)
    
    // arsonist dousing
    await arsonists(client)
    
    // corruptor corrupting
    await corruptors(client)
    
    // alchemist giving potion
    await alchemists(client)
    
    // illusionist disguising
    await illusionists(client)
    
    // configuring jailer and nightmare permissions
    await channels(client)
    
  }
}
