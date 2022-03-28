const db = require("quick.db") // database
const { getEmoji } = require("../../../config") // functions

module.export = async client => {

  // let's get cupid's couple
  const guild = client.guilds.cache.get("890234659965898813")
  const players = db.get(`players`)
  const cupids = players.filter(p => db.get(`player_${p}`).role === "Cupid") // get all cupids - Array<Snowflake>
  
  for (const cupid of cupids) {
  
    let lovemaker = db.get(`player_${cupid}`) // get the couple - Array<Snowflake>
    
    db.delete(`player_${cupid}.target`) // delete the database targets (this won't affect the current target, don't worry)
    
    // check if the cupid has enough alive targets. Otherwise assign the targets.
    if (!lovemaker.target || lovemaker.target.filter(t => db.get(`player_${t}`).status === "Alive").length < 2) {
    
      // asign the targets
      let target = lovemaker.target?.filter(t => db.get(`player_${t}`)) || []
      
      // check how many players are there
      if (target.length === 1) {
        
        // if there is only 1 couple alive, assign a random target
        let newTarget = players.filter(t => db.get(`player_${t}`).status === "Alive" && !["Cupid", "President"].includes(db.get(`player_${t}`).role) && t !== target[0])
        
        // check if there aren't any valid targets
        if (newTarget.length === 0) {
          
          // get the channel and send the unsuccesful message
          let channel = guild.channels.cache.get(lovemaker.channel) // get the message
          await channel.send(`${getEmoji("lovers", client)} There were not enough valid roles to make your couple!`)  // send the unsuccessful message
          await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // ping the player
          break;
        
        } else { 
          
          // get a new couple
          let theCouple = newTarget[Math.floor(Math.random() * target.length)] // get a random player
          target.push(theCouple) // push into the array
          lovemaker.target = target // assign the cupid's target as the current one.
        
        }
      
      } else { // so both couple died
        
        // filter the current players and see if there are any eligible targets
        let newTarget = players.filter(t => db.get(`player_${t}`).status === "Alive" && !["Cupid", "President"].includes(db.get(`player_${t}`).role) && t !== target[0])
        
        // check if there aren't enough valid targets
        if (newTarget.length < 2) {
        
          // get the channel and send the unsuccesful message
          let channel = guild.channels.cache.get(lovemaker.channel) // get the message
          await channel.send(`${getEmoji("lovers", client)} There were not enough valid roles to make your couple!`)  // send the unsuccessful message
          await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // ping the player
          break;
        
        } else { // noice there were enough targets
        
          // get a new couple
          let theFirstCouple = newTarget[Math.floor(Math.random() * target.length)] // get a random player
          let theSecondCouple = newTarget.filter(d => d !== theFirstCouple)[Math.floor(Math.random() * target.length)] // get a random player
          
          // push the couple into the array
          target.push(theFirstCouple) // push the first couple
          target.push(theSecondCouple) // push the second couple
          lovemaker.target = target // assign the cupid's target as the current one.
        
        }
        
      }
      
    }
    
    
    // send a message to both players
    let couple1 = db.get(`player_${lovemaker.target[0]}`)
    let couple2 = db.get(`player_${lovemaker.target[1]}`)
    let channel1 = guild.channels.cache.get(couple1.channel)
    let channel2 = guild.channels.cache.get(couple2.channel)
    await channel1.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple2.id)+1} ${couple2.username} (${getEmoji(couple2.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple2.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`)
    await channel1.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
    await channel2.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple1.id)+1} ${couple1.username} (${getEmoji(couple1.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple1.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`)
    await channel2.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
    await 
  }

}
