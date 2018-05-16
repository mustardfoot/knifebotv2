const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('hell yeah');
});
client.on('guildMemberAdd', function(member) {
 var serverjoined = member.guild;
 if(serverjoined.id === process.env.ENHANCED_SERVER){
   var theirid = member.user.id;
   var yeet = null;
   client.guilds.forEach(function(guild){
     if(guild.id === process.env.SYNAPSE_SERVER){
       yeet = guild;
     }
   })
   if(yeet !== null){
     var them = yeet.member(member.user);
     if(them){
       if(them.highestRole && them.highestRole.comparePositionTo(yeet.roles.find("name","Moderator")) >= 0){
         member.addRole(member.guild.roles.find("name","mods"));
         if(them.highestRole && them.highestRole.comparePositionTo(yeet.roles.find("name","Administrator")) >= 0){
           member.addRole(member.guild.roles.find("name","admins"));
         }
         if(them.highestRole && them.highestRole.comparePositionTo(yeet.roles.find("name","Enhanced Permissions")) >= 0){
           member.addRole(member.guild.roles.find("name","enhanced perms"));
         }
         member.user.createDM().then((boi) => {
            boi.send('Welcome, '+member.user.username+'.');
          });
       }else{
         member.user.createDM().then((boi) => {
            boi.send('You do not have the admin role or higher in Synapse.');
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
