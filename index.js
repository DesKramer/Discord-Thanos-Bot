const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = "YOUR_TOKEN_HERE"

// = new Discord.Guild(bot);
bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!\n`);

});

bot.on('message', msg => {
  const CURR_GUILD = msg.guild;
  let real_members = new Discord.Collection();  

  function banUser(target){
    target.ban({reason: "You didn't feel so good."}).then(console.log);
  }

  // Only allows the owner to run these commands
  if(msg.author.id !== bot.user.id) {
    if(msg.author.id === CURR_GUILD.ownerID){
      // bans users
      if (msg.content === '!snap') {
        
        // Gets the all the guild members 
        let memberPromise = msg.guild.members.fetch();

        // removes bots
        memberPromise.then(function(result) {
          real_members = result.filter(gm => gm.user.bot === false || gm.user.id !== CURR_GUILD.ownerID);
          const guild_size = result.size;
          console.log("Guild size: " +  guild_size);
          console.log("Real Users: " +  real_members.size);

          let targets = real_members.random(guild_size/2);
          console.log("Target size: " +  targets.length);
          for(i = 0; i < targets.length; i++){
            console.log("Targeted: " + targets[i].user.username);
            msg.channel.send(targets[i].user.username + " doesn't feel so good.");
            banUser(targets[i]);
          }
        }).catch();
      }

      // Invite banned users
      if(msg.content == '!revive'){
        console.log("Trying to revive");
        let banned_member_promise = CURR_GUILD.fetchBans();

        banned_member_promise.then(function(result) {
          result.each(user => {
            console.log("Unbanning: "  + user.user.username);
            msg.guild.members.unban(user.user.id);
            user.user.send("Thanos has unbanned you. You may return.");
            msg.channel.createInvite()
              .then(invite => user.user.send("Thanos has unbanned you. You may return for now." + invite.toString()))
              .catch();
          });
        }).catch();
      } 
    } else {
      msg.reply("You are not the owner, and therefore can't run commands.");
    } 
  }
});