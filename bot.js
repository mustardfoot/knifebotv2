const Discord = require('discord.js');
const Trello = require("node-trello");
const t = new Trello(process.env.T_KEY,process.env.T_TOKEN);
const client = new Discord.Client();
var pref = "!"
var guild;
var commands = [];

function addcommand(name,aliases,desc,minrank,does){
    commands.push({name:name,aliases:aliases,desc:desc,minrank:minrank,does:does});
}

addcommand("test",["check"],"checks if the bot is online","",function(args,message){
    message.channel.send(":white_check_mark: **The bot is active!**");
});

addcommand("unmute",[],"unmutes a user who was previously muted","helper",function(args,message){
  var userlist = message.mentions.members;
  if(message.member){
    userlist.forEach(function(user){
      if (message.member.highestRole.comparePositionTo(user.highestRole) > 0 ) {
        t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
          datas.forEach(function(data){
            if (data.name === "mutes"){
              hwids = data.id;
            }
          })
          if(hwids){
            t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
              cards.forEach(function(card){
                if (card.name === user.id){
                  t.del('1/cards/'+card.id,function(err,returns){
                    if(err){
                      console.log(err);
                    }
                  });
                }
              })
            });
          }else{
            message.channel.send("**:no_entry_sign: Something seems to be wrong with the mute databases, and the user could not be unmuted properly.**")
          }
        });
        var roles = user.roles
        roles.forEach(function(role){
          if (role.name === "muted") {
            user.removeRole(role)
            message.channel.send("**:white_check_mark: <@"+user.id+"> has been successfully unmuted.**")
            user.user.createDM().then((boi) => {
              boi.send("**:white_check_mark: You have been unmuted.**")
            });
          }
        })
      }else{
        message.channel.send("**:no_entry_sign: You do not have permission to moderate this user.**")
      }
    })
  }
});

addcommand("mute",[],"prevents the mentioned user from talking in text and voice channels","helper",function(args,message){
  var userlist = message.mentions.members;
  var muser = null;
  var curnum = 0;
  userlist.forEach(function(thatoneguythatgotmentioned){
    if(muser === null){
      muser = thatoneguythatgotmentioned;
    }
  });
  var reason = "No Reason Provided";
  args.forEach(function(role){
    if(curnum > 2){
      if(curnum === 3){
        reason = role;
      }else{
        reason = reason+" "+role;
      }
    }
    curnum = curnum+1;
  })
  if (muser){
    if (message.member) {
      if(message.member.highestRole.comparePositionTo(muser.highestRole) > 0){
        if (message.member.guild.roles.find("name","muted")) {
          muser.addRole(message.member.guild.roles.find("name","muted"))
          var today = new Date();
          var m = today.getMinutes();
          if (args) {
            if (!args[2] || !parseInt(args[2])){
              args[2] = 0;
            };
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "mutes"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if(card.name === muser.id){
                      t.del('1/cards/'+card.id,function(err,returns){
                        if(err){
                          console.log(err);
                        }
                      });
                    }
                  })
                  t.post('/1/cards?name='+muser.id+'&desc='+args[2]+'&pos=top&idList='+hwids,function(err,returns){
                    if(err){
                      console.log(err);
                    }
                  });
                });
              }else{
                message.channel.send("**:no_entry_sign: Something seems to be wrong with the mute databases, automatic unmute will not work.**")
              }
          });
          }
          var time = "Forever"
          if (args && parseInt(args[2])){
            time = parseInt(args[2])+" Minutes";
          }
          if(time === "Forever"){
            cmdoutput("**<@"+muser.id+"> has been muted forever.**",message.channel)
            muser.muser.createDM().then((boi) => {
              boi.send("**:no_entry_sign: You have been muted forever.**")
            });
          }else{
            cmdoutput("**<@"+muser.id+"> has been muted by <@"+message.user.id+"> for "+time+" minutes.**",message.channel)
            muser.muser.createDM().then((boi) => {
              boi.send("**:no_entry_sign: You have been muted for "+time+" minutes.**")
            });
          }
        } else {
          message.channel.send("**:no_entry_sign: We cannot mute the user due to there being no muted role.**")
        }
      }else{
        message.channel.send("**:no_entry_sign: You do not have permission to moderate this user.**")
      }
    }
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
