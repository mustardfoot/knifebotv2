const Discord = require('discord.js');
const Trello = require("node-trello");
const t = new Trello(process.env.T_KEY,process.env.T_TOKEN);
const client = new Discord.Client();
var pref = "!"
var guild;
var commands = [];

function getmemberfromid(id){
  if(id.substring(0,2) === "<@" && id.substring(id.length-1) === ">" && Number(id.substring(2,id.length-1))){
    return guild.members.get(id.substring(2,id.length-1));
  }else if(id.substring(0,3) === "<@!" && id.substring(id.length-1) === ">" && Number(id.substring(3,id.length-1))){
    return guild.members.get(id.substring(3,id.length-1));
  }else{
    return null
  }
}

function addcommand(name,aliases,desc,minrank,does){
    commands.push({name:name,aliases:aliases,desc:desc,minrank:minrank,does:does});
}

addcommand("test",["check"],"checks if the bot is online","",function(args,message){
    message.channel.send(":white_check_mark: **The bot is active!**");
});

addcommand("unmute",[],"unmutes a user who was previously muted","helper",function(args,message){
  message.channel.send("**Command not yet added**");
});

addcommand("mute",[],"prevents the mentioned user from talking in text and voice channels","helper",function(args,message){
  if(message.guild){
    var mentionedmember = getmemberfromid(args[1]);
    if (mentionedmember){
      var time;
      var displaytime = "forever";
      var reason = "No Reason Provided";
      if(args[2]){
        if(Number(args[2])){
          time = args[2];
          displaytime = args[2]+" minutes";
        }else if(Number(args[2].substring(0,args[2].length-1))){
          if(args[2].substring(args[2].length-1) === "d"){
            time = Number(args[2].substring(0,args[2].length-1))*1440;
            if(args[2].substring(0,args[2].length-1) !== "1"){
              displaytime = args[2].substring(0,args[2].length-1)+" days";
            }else{
              displaytime = args[2].substring(0,args[2].length-1)+" day";
            }
          }else if(args[2].substring(args[2].length-1) === "m"){
            time = Number(args[2].substring(0,args[2].length-1));
            if(args[2].substring(0,args[2].length-1) !== "1"){
              displaytime = args[2].substring(0,args[2].length-1)+" minutes";
            }else{
              displaytime = args[2].substring(0,args[2].length-1)+" minute";
            }
          }else if(args[2].substring(args[2].length-1) === "s"){
            time = Number(args[2].substring(0,args[2].length-1))/60;
            if(args[2].substring(0,args[2].length-1) !== "1"){
              displaytime = args[2].substring(0,args[2].length-1)+" seconds";
            }else{
              displaytime = args[2].substring(0,args[2].length-1)+" second";
            }
          }else if(args[2].substring(args[2].length-1) === "h"){
            time = Number(args[2].substring(0,args[2].length-1))*60;
            if(args[2].substring(0,args[2].length-1) !== "1"){
              displaytime = args[2].substring(0,args[2].length-1)+" hours";
            }else{
              displaytime = args[2].substring(0,args[2].length-1)+" hour";
            }
          }else if(args[2].substring(args[2].length-1) === "w"){
            time = Number(args[2].substring(0,args[2].length-1))*10080;
            if(args[2].substring(0,args[2].length-1) !== "1"){
              displaytime = args[2].substring(0,args[2].length-1)+" weeks";
            }else{
              displaytime = args[2].substring(0,args[2].length-1)+" week";
            }
          }
        }
      }
      var adjustment = 0;
      if(!time){
        adjustment = 1;
        time = 0;
      }
      if(args.length > 3){
        reason = "";
        args.forEach(function(arg,n){
          if(n > 2-adjustment){
            if(n > 3-adjustment){
              reason = reason+" "
            }
            reason = reason+arg
          }
        });
      }
      if(displaytime !== "forever"){
        message.channel.send("**:white_check_mark: The user <@"+mentionedmember.id+"> would be muted for **"+displaytime+"**.** ["+reason+"]")
      }else{
        message.channel.send("**:white_check_mark: The user <@"+mentionedmember.id+"> would be muted **forever**.** ["+reason+"]")
      }
    }else{
      message.channel.send("**:no_entry_sign: This is not a valid user.**")
    }
  }else{
    message.channel.send("**:no_entry_sign: This command cannot be used in DMs.**")
  }
});

addcommand("verify",[],"verifies an unverified user","",function(args,message){
    if(message.channel.guild && message.channel.name && message.channel.name === "✅verify"){
      if(message.member){
        var good = true;
        if(guild.roles.find("name","verified")){
          message.member.addRole(message.member.guild.roles.find("name","verified"))
          .catch(() => {
            good = false;
            message.channel.send("**:no_entry_sign: There has been an error verifying you,** <@"+message.author.id+">**. If this problem persists, please rejoin or contact mustardfoot.**")
          }).then(() => {
            if(good === true){
              message.channel.send("**:white_check_mark: You have been verified,** <@"+message.author.id+">**.**")
            }
          });
        }else{
          message.channel.send(":no_entry_sign: **The verified role doesn't exist. Please contact mustardfoot to fix this.**")
        }
      }else{
        message.channel.send("**:no_entry_sign: There has been an error verifying you,** <@"+message.author.id+">**. Please rejoin the server.**")
      }
    }
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
                    message.channel.send(":no_entry_sign: **Sorry, I can't find you in the server!**")
                  }else{
                    if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                      command.does(args,message);
                    }else{
                      message.channel.send(":no_entry_sign: **You're not a high enough role to run this command** (requires the [*"+command.minrank+"*] rank)")
                    }
                  }
                })
                .catch(() => {
                  message.channel.send(":no_entry_sign: **Sorry, I can't find you in the server!**")
                })
              }else{
                message.channel.send(":no_entry_sign: **Sorry, the required role** (*"+command.minrank+"*) **for this command doesn't exist!**")
              }
            }
          }
        }
      }
  });
});

client.login(process.env.BOT_TOKEN);
