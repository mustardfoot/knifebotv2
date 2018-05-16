const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('hell yeah');
});
client.on('guildMemberAdd', function(member) {
 var serverjoined = member.guild;
 if(serverjoined === 446110564822024203){
   console.log('right server');
   var theirid = member.user.id;
   var yeet = null;
   client.guilds.forEach(function(guild){
     if(guild.id === 443971401741893635){
       yeet = guild;
     }
   })
   if(yeet !== null){
     var them = yeet.member(member.user);
     if(them){
       if(them.highestRole && them.highestRole.comparePositionTo(message.member.guild.roles.find("name","Enhanced Permissions")) >= 0){
         member.addRole(member.guild.roles.find("name","verified"));
       }else{
         member.user.createDM().then((boi) => {
            boi.send('You do not have the enhanced permissions role in Synapse.');
           member.kick()
          });
       }
     }else{
       member.user.createDM().then((boi) => {
            boi.send('You are not in the Synapse server.');
           member.kick()
          });
     }
   }else{
     member.user.createDM().then((boi) => {
        boi.send("Sorry, the Synapse server has been recently deleted and the bot is not currently in it! We can't check if you're enhanced perms or not automatically.");
     });
     console.log('bot is not in synapse');
   }
 }
});

client.login(process.env.BOT_TOKEN);
