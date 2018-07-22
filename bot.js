const Discord = require('discord.js');
const client = new Discord.Client();
var pref = "!"
var guild;
var commands = [];

function addcommand(name,aliases,desc,minrank,does){
    commands.push({name:name,aliases:aliases,desc:desc,minrank:minrank,does:does});
}

addcommand("test",["check"],"checks if the bot is online","",function(args,message){
    console.log('active');
});

process.on('unhandledRejection', (err, p) => {
});
client.on('ready', () => {
  console.log('hell yeah');
  client.user.setActivity('over the server (prefix is !)', { type: 'WATCHING' })
  .catch(console.error);
});
client.on('message', function(message) {
  if (message.author.equals(client.user)) return;
  var args = message.content.substring(pref.length).split(" ");
  if (!message.content.startsWith(pref)) return;
  if(!guild){
    client.guilds.forEach(function(g){
      if(g.id === process.env.SERVER_ID){
        guild = g;
      }
    });
  }
  var saidcommand = args[0].toLowerCase()
  var alreadycommanded = false;
  commands.forEach(function(command){
      if(alreadycommanded === false){
        var isalias = false;
        command.aliases.forEach(function(alias){
          if(saidcommand === alias){
            isalias = true;
          }
        });
      	if(command.name === saidcommand || isalias === true){
          if(command.minrank === ""){
            command.does(args,message);
          }else{
            if(guild){
              if(guild.roles.find("name",command.minrank)){
                guild.fetchMember(message.author).then((theirmember) => {
                  if(!theirmember){
                    message.channel.send(":no_entry_sign: Sorry, I can't find you in the server!")
                  }else{
                    if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                      command.does(args,message);
                    }else{
                      message.channel.send(":no_entry_sign: You need to have the *"+command.minrank+"* role or above to run this command.")
                    }
                  }
                })
                .catch(() => {
                  message.channel.send(":no_entry_sign: Sorry, I can't find you in the server!")
                })
              }else{
                message.channel.send(":no_entry_sign: Sorry, the required role *("+command.minrank+")* for this command doesn't exist!")
              }
            }
          }
        }
      }
  });
});

client.login(process.env.BOT_TOKEN);
