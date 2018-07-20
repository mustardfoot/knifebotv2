const Discord = require('discord.js');
const client = new Discord.Client();
var pref = "+"
process.on('unhandledRejection', (err, p) => {
});
client.on('ready', () => {
  console.log('hell yeah');
  client.user.setActivity('the staff team sleep', { type: 'WATCHING' })
  .catch(console.error);
});
client.on('message', function(message) {
  if (message.author.equals(client.user)) return;
  var args = message.content.substring(pref.length).split(" ");
  var word = message.content.toLowerCase()
  if (!message.content.startsWith(pref)) return;
  switch(args[0].toLowerCase()) {
    case "setupserver" :
      if(message.member && message.member.guild && message.member.guild.id === process.env.SYNAPSE_SERVER){
        var sentserver = message.member.guild;
        var them = message.member
        if(them.highestRole && them.highestRole.comparePositionTo(sentserver.roles.find("name","Enhanced Permissions")) >= 0){
          var yeet = null;
          client.guilds.forEach(function(guild){
            if(guild.id === process.env.ENHANCED_SERVER){
              yeet = guild;
            }
          })
          if(yeet !== null){
            if(yeet.name !== process.env.FAN_SQUAD+' Fan Squad'){
              message.channel.send("Working...")
              yeet.channels.forEach(function(chan){
                 chan.delete();
               })
              yeet.roles.forEach(function(role){
                if(role.name !== "@everyone"){
                 role.delete();
                }
               })
              yeet.createRole({
                name: 'mods',
                color: 'GREEN',
                position: 1,
                permissions: 104189120,
                mentionable: false,
                hoist: true
               })
              .then(() => {
                      yeet.createRole({
                name: 'admins',
                color: 'GOLD',
                position: 2,
                permissions: 1341516998,
                mentionable: false,
                hoist: true
               })
              .then(() => {
                    yeet.createRole({
                name: 'enhanced perms',
                color: 'DEFAULT',
                position: 3,
                permissions: 1341648070,
                mentionable: false,
                hoist: false
               })
              .then(() => {
                    yeet.createRole({
                name: '3dsboi',
                color: '#d1a6ff',
                position: 4,
                permissions: 8,
                mentionable: false,
                hoist: true
               })
              .then(() => {
                    yeet.createChannel('unverified', 'text', [
                 {
                  id: yeet.roles.find("name","mods"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","admins"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","enhanced perms"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","@everyone"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY']
                 }
               ])
               .then(() => {
                     yeet.createChannel('all-staff', 'text', [
                 {
                  id: yeet.roles.find("name","@everyone"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","mods"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","admins"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","enhanced perms"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 }
               ])
               .then(() => {
                     yeet.createChannel('admin-chat', 'text', [
                 {
                  id: yeet.roles.find("name","@everyone"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","mods"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","admins"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","enhanced perms"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 }
               ])
               .then(() => {
                     yeet.createChannel('enhanced-chat', 'text', [
                 {
                  id: yeet.roles.find("name","@everyone"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","mods"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","admins"),
                  deny: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 },
                 {
                  id: yeet.roles.find("name","enhanced perms"),
                  allow: ['READ_MESSAGES','READ_MESSAGE_HISTORY','SEND_MESSAGES']
                 }
               ])
               .then(() => {
                     yeet.setName(process.env.FAN_SQUAD+' Fan Squad')
                      .then(() => {message.channel.send("Staff chat successfully set up!")})
                      .catch(console.error);
                     })
               .catch(console.error);
                     })
               .catch(console.error);
                     })
               .catch(console.error);
                     })
               .catch(console.error);
                    })
              .catch(console.error)
                    })
               .catch(console.error)
                    })
               .catch(console.error)
                    })
               .catch(console.error)
            }else{
              message.channel.send("The server is already set up!")
            }
          }else{
            message.channel.send("Sorry, the bot cannot find the server.")
          }
        }
      }
      break;
    case "invite" :
        if(message.member && message.member.guild && message.member.guild.id === process.env.SYNAPSE_SERVER){
          var sentserver = message.member.guild;
        var them = message.member
        var mod = false;
       them.roles.forEach(function(role){
         if(role.name === "Moderator"){
           mod = true;
         }else if(role.name === "Administrator"){
         mod = true;
         }else if(role.name === "Enhanced Permissions"){
           mod = true;
         }else if(role.name === "Real Owner"){
           mod = true;
         }
       })
       if(mod !== false){
            var yeet = null;
            client.guilds.forEach(function(guild){
              if(guild.id === process.env.ENHANCED_SERVER){
                yeet = guild;
              }
            });
            if(yeet !== null){
               var yote = null;
               yeet.channels.forEach(function(chan){
                if(chan.name === "unverified"){
                  yote = chan;
                }
               });
               if(yote !== null){
                  yote.createInvite({maxAge : 600 , maxUses : 1 , unique : true},message.author.username+"#"+message.author.tag)
                  .then(inv => {if(inv !== null){
                    message.author.createDM().then((boi) => {
                      var good = true;
                      boi.send('Here is an invite to the mod chat (one use, expires 10 minutes after being sent): discord.gg/'+inv.code);
                      .catch(() => {
                        good = false;
                        message.channel.send("I can't DM you, <@"+message.author.id+">. Please unblock me or allow DMs from this server.")
                      });
                      if(good === true){
                         message.channel.send("An invite to the mod chat has been sent to your DMs, <@"+message.author.id+">!")
                      };
                    }).catch(() => {
                      message.channel.send("An error has occured while trying to DM you the invite, <@"+message.author.id+">.")
                     });
                  }else{
                    message.channel.send("Sorry, the bot is currently unable to send invites, <@"+message.author.id+">. (error creating an invite)")
                  }})
                  .catch(console.error);
               }else{
                  message.channel.send("Sorry, the bot is currently unable to send invites, <@"+message.author.id+">. (unverified channel not found)")
               }
            }else{
              message.channel.send("Sorry, the bot is currently unable to send invites, <@"+message.author.id+">. (staff server not found)")
            }
          }else{
            message.channel.send("Sorry, you need the moderator role or higher to join the staff chat, <@"+message.author.id+">.")
          }
        }
      break;
  };
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
       var mod = false;
       them.roles.forEach(function(role){
         if(role.name === "Moderator"){
           mod = true;
           member.addRole(member.guild.roles.find("name","mods"));
         }else if(role.name === "Administrator"){
         mod = true;
          member.addRole(member.guild.roles.find("name","admins"));
         }else if(role.name === "Enhanced Permissions"){
           mod = true;
           member.addRole(member.guild.roles.find("name","enhanced perms"));
         }else if(role.name === "Real Owner"){
           mod = true;
           member.addRole(member.guild.roles.find("name","3dsboi"));
         }
       })
       if(mod !== false){
         member.user.createDM().then((boi) => {
            boi.send('Welcome, '+member.user.username+'.');
          })
       }else{
         member.user.createDM().then((boi) => {
            boi.send('You do not have the moderator role or higher in Synapse.');
            member.kick()
          })
          .catch(() => {
            member.kick();
          });
       }
     }else{
       member.user.createDM().then((boi) => {
            boi.send('You are not in the Synapse server.');
           member.kick()
          })
          .catch(() => {
            member.kick();
          });
     }
   }else{
     member.user.createDM().then((boi) => {
        boi.send("Sorry, the Synapse server has been recently deleted and the bot is not currently in it! We can't check if you're enhanced perms or not automatically.");
        member.kick()
     })
     .catch(() => {
            member.kick();
          });
     console.log('bot is not in synapse');
   }
 }
});

client.login(process.env.BOT_TOKEN);
