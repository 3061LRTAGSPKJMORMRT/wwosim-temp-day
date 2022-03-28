const db = require("quick.db") // database
const { getEmoji } = require("../../../config") // functions

module.export = async client => {

  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) // get the players array - Array<Snowflake>
  const cupids = players.filter(p => db.get(`player_${p}`).role === "Cupid") // get all cupids - Array<Snowflake>
  
  // loop through each cupid
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
    let couple1 = db.get(`player_${lovemaker.target[0]}`) // get the first couple player
    let couple2 = db.get(`player_${lovemaker.target[1]}`) // get the second couple player
    let channel = guild.channels.cache.get(lovemaker.channel) // get the cupid's channel
    let channel1 = guild.channels.cache.get(couple1.channel) // get the first couple's channel
    let channel2 = guild.channels.cache.get(couple2.channel) // get the second couple'c channel
    await channel1.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple2.id)+1} ${couple2.username} (${getEmoji(couple2.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple2.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`) // sends the love message
    await channel1.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player
    await channel2.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple1.id)+1} ${couple1.username} (${getEmoji(couple1.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple1.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`) // sends the love message
    await channel2.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player
    await channel.send(`${getEmoji("couple", client)} Player **${players.indexOf(couple1.id)+1} ${couple1.username}** and **${players.indexOf(couple2.id)} ${couple2.username}** are in love!`) // sends the confirmation message
    
    db.set(`player_${couple1.id}.couple`, couple2.id) // set the coupled player with the other player
    db.set(`player_${couple2.id}.couple`, couple1.id) // set the coupled player with the other player
    
    // remove bomb, douse, corruption, and disguise from the player if their couple is the attacker
    if (["Bomber", "Arsonist", "Corruptor", "Illusionist"].includes(couple1.role) || ["Bomber", "Arsonist", "Corruptor", "Illusionist"].includes(couple2.role)) {
    
      // now check if the first couple has targetted their second couple
      if (couple1.target === couple2.id || couple1.target.includes(couple2.id)) {
        
        // send a message regarding the action of canceling their abilities on thier couple
        await channel1.send(`${getEmoji("couple", client)} Since you have unconditional love with player **${players.indexOf(couple2.id)+1} ${couple2.username}**, you decided to cancel your action on this player.`)
        await channel1.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
        
        // check if it's an array
        if (Array.isArray(couple1.target)) {
          
          // delete the player from the array
          let arr = couple1.target
          delete arr[arr.indexOf(couple2.id)]
          db.set(`player_${couple1.id}.target`, arr.filter(Boolean))
          
        } else {
          
          // delete the target database
          db.delete(`player_${couple1.id}.target`)
          
        }
      } 
      
      // now check if the second couple has targetted their first couple
      if (couple2.target === couple1.id || couple2.target.includes(couple1.id)) {
        
        // send a message regarding the action of canceling their abilities on thier couple
        await channel2.send(`${getEmoji("couple", client)} Since you have unconditional love with player **${players.indexOf(couple2.id)+1} ${couple2.username}**, you decided to cancel your action on this player.`)
        await channel2.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
      
        // check if it's an array
        if (Array.isArray(couple2.target)) {
          
          // delete the player from the array
          let arr = couple2.target
          delete arr[arr.indexOf(couple1.id)]
          db.set(`player_${couple2.id}.target`, arr.filter(Boolean))
          
        } else {
          
          // delete the target database
          db.delete(`player_${couple2.id}.target`)
          
        }
      
      }
    
    }
  }

}
