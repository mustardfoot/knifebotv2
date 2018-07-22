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
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          if (message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0 ) {
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "mutes"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if (card.name === mentionedmember.user.id){
                      t.del('1/cards/'+card.id,function(err,returns){});
                    }
                  })
                });
              }else{
                message.channel.send("**Something seems to be wrong with the mute database, please contact mustardfoot about this issue.**")
              }
            });
            mentionedmember.user.createDM().then((boi) => {
              var good = true;
              boi.send('**You have been unmuted in the server. You may now talk again.**')
            })
            var roles = mentionedmember.roles
            roles.forEach(function(role){
              if (role.name === "muted") {
                mentionedmember.removeRole(role)
              }
            })
            message.channel.send(":white_check_mark: <@"+mentionedmember.id+"> has been unmuted.")
          }else{
            message.channel.send("**:no_entry_sign: You are not able to moderate this user.**")
          }
        }
      }else{
        message.channel.send("**:no_entry_sign: This is not a valid user.**")
      }
    }
  }else{
    message.channel.send("**:no_entry_sign: This command cannot be used in DMs.**")
  }
});

addcommand("mute",[],"prevents the mentioned user from talking in text and voice channels","helper",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          if (message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0 ) {
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
            var today = new Date();
            var m = today.getMinutes();
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "mutes"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if(card.name === mentionedmember.id){
                      t.del('1/cards/'+card.id,function(err,returns){});
                    }
                  })
                  t.post('/1/cards?name='+mentionedmember.id+'&desc='+time+'&pos=top&idList='+hwids,function(err,returns){
                    if(guild.roles.find("name","muted")){
                      var good = true;
                      mentionedmember.addRole(guild.roles.find("name","muted"))
                      .catch(() => {
                        good = false;
                        message.channel.send("**:no_entry_sign: There has been an error giving the user the muted role. Please attempt to re-mute them.**")
                      }).then(() => {
                        mentionedmember.user.createDM().then((boi) => {
                          if(displaytime !== "forever"){
                            boi.send("You have been muted in the server for **"+displaytime+"**. You are unable to speak in text and voice chats until the time is up or a staff member unmutes you. \n \n **Reason:** \n ``` \n "+reason+" \n ```")
                          }else{
                            boi.send("You have been muted in the server **forever**. You are unable to speak in text and voice chats unless a staff member unmutes you.")
                          }
                        })
                        if(good === true){
                          if(displaytime !== "forever"){
                            message.channel.send(":white_check_mark: The user <@"+mentionedmember.id+"> has been muted for **"+displaytime+"**. \n \n **Reason:** \n ``` \n "+reason+" \n ```")
                          }else{
                            message.channel.send(":white_check_mark: The user <@"+mentionedmember.id+"> has been muted **forever**.")
                          }
                        }
                      });
                    }else{
                      message.channel.send(":no_entry_sign: **The muted role doesn't exist. Please contact mustardfoot to fix this.**")
                    }
                  });
                });
              }else{
                message.channel.send("**Something seems to be wrong with the mute database, please contact mustardfoot about this issue.**")
              }
            });
          }else{
            message.channel.send("**:no_entry_sign: You are not able to moderate this user.**")
          }
        }else{
          message.channel.send("**:no_entry_sign: You can't mute the bot.**")
        }
      }else{
        message.channel.send("**:no_entry_sign: This is not a valid user.**")
      }
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
