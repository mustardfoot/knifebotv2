const Discord = require('discord.js');
const Trello = require("node-trello");
const t = new Trello(process.env.T_KEY,process.env.T_TOKEN);
const client = new Discord.Client();
var pref = "!"
var sEmoji;
var fEmoji;
var guild;
var commands = [];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function diff_minutes(dt2, dt1, add)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.round(diff-add);

 }

 function checkpermit(message,oldmessage){
   var good = true;
   if(!oldmessage){
     var links = false;
     var attachments = false;
     if(message.guild && message.guild === guild){
       if (message.content.toLowerCase().indexOf('http') !== -1 || message.content.toLowerCase().indexOf('discord.gg') !== -1 || message.content.toLowerCase().indexOf('://') !== -1){
         links = true;
         good = false;
         if(message.member){
           if(guild.roles.find("name","helper")){
             if(message.member.highestRole.comparePositionTo(guild.roles.find("name","helper")) >= 0){
               good = true;
             }
           }
           var roles = message.member.roles
           roles.forEach(function(role){
             if (role.name === "permit") {
               good = true;
               message.member.removeRole(role);
             }
           })
           if(good === false){
             links = false;
           }
         }

       }
       message.attachments.forEach(function(att){
         attachments = true;
       })
       if (attachments === true && links === false){
         if(message.member){
           if(guild.roles.find("name","helper")){
             if(message.member.highestRole.comparePositionTo(guild.roles.find("name","helper")) >= 0){
               good = true;
             }
           }
           var roles = message.member.roles
           roles.forEach(function(role){
             if (role.name === "permit") {
               good = true;
               message.member.removeRole(role);
             }
           })
         }
       }
     }
   }
   if(good === false){
     message.delete();
   }
 }

var getuserfromid = function(id) {
  return new Promise(function(resolve, reject){
     if(id.substring(0,2) === "<@" && id.substring(id.length-1) === ">" && Number(id.substring(2,id.length-1))){
       client.fetchUser(id.substring(2,id.length-1)).then((user) => {
         if(user){
           resolve(user);
         }else{
           reject(null);
         }
       });
     }else if(id.substring(0,3) === "<@!" && id.substring(id.length-1) === ">" && Number(id.substring(3,id.length-1))){
       client.fetchUser(id.substring(3,id.length-1)).then((user) => {
         if(user){
           resolve(user);
         }else{
           reject(null);
         }
       });
     }else{
       reject(null);
     }
  })
}

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

addcommand("test",["check"],"This command will respond if the bot is online. A simple test to make sure the bot isn't down.","",function(args,message){
    message.channel.send(sEmoji+" **The bot is active!**");
});

addcommand("getpicture",["getprofile","getprofilepicture","getpfp","pfp","picture","getprofile"],"This command will reply with the profile picture of the user specified.","",function(args,message){
    if(message.guild && message.guild === guild && message.channel.guild && message.channel.name && message.channel.name === "bot"){
      if(args[1]){
        var user = getuserfromid(args[1]).then((mentioneduser) => {
          if(mentioneduser){
            if(mentioneduser.avatarURL){
              message.channel.send(sEmoji+" Here is **"+mentioneduser.tag+"'s** profile picture: "+mentioneduser.avatarURL);
            }
          }else{
            message.channel.send(fEmoji+" **Sorry, I can't find that user!**")
          }
        }).catch(() => {
          message.channel.send(fEmoji+" **Sorry, I can't find that user!**")
        });
      }else{
        message.channel.send(fEmoji+" **You need to specify a user to get their profile picture.**");
      }
    }else{
      message.channel.send(fEmoji+" **This command can only be used in the bot commands channel.**");
    }
});

addcommand("ban",["bean"],"This command will ban someone from joining the server permanently.","moderator",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      getuserfromid(args[1]).then((mentioneduser) => {
        if (mentionedmember){
          if(mentionedmember.user !== client.user){
            if(message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0){
              var reason = "No Reason Provided"
              if(args[2]){
                reason = "";
                args.forEach(function(arg,n){
                  if(n > 1){
                    if(n > 2){
                      reason = reason+" "
                    }
                    reason = reason+arg
                  }
                });
              }
              mentionedmember.user.createDM().then((boi) => {
                boi.send('**You have been banned from the server for ['+reason+']**')
                guild.ban(mentionedmember,{reason: reason})
                message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been banned.**");
                guild.channels.forEach(function(channel){
                  if(channel.name === "logs"){
                    channel.send({"embed": {
                      "description":"Ban",
                      "timestamp": new Date(),
                      "fields": [
                        {
                          "name": "Staff Member",
                          "value": "<@"+message.author.id+">",
                          "inline": true
                        },
                        {
                          "name": "User",
                          "value": "<@"+mentionedmember.id+">",
                          "inline": true
                        },
                        {
                          "name": "Reason",
                          "value": reason
                        }
                      ]
                    }})
                  }
                });
              });
            }else{
              message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
            }
          }else{
            message.channel.send("**"+fEmoji+" You can't ban the bot.**")
          }
        }else if(mentioneduser){
          if(mentioneduser !== client.user){
            var reason = "No Reason Provided"
            if(args[2]){
              reason = "";
              args.forEach(function(arg,n){
                if(n > 1){
                  if(n > 2){
                    reason = reason+" "
                  }
                  reason = reason+arg
                }
              });
            }
            guild.ban(mentioneduser,{reason: reason})
            message.channel.send(sEmoji+" **"+mentioneduser.tag+" has been banned.**");
            guild.channels.forEach(function(channel){
              if(channel.name === "logs"){
                channel.send({"embed": {
                  "description":"Ban",
                  "timestamp": new Date(),
                  "fields": [
                    {
                      "name": "Staff Member",
                      "value": "<@"+message.author.id+">",
                      "inline": true
                    },
                    {
                      "name": "User",
                      "value": mentioneduser.tag,
                      "inline": true
                    },
                    {
                      "name": "Reason",
                      "value": reason
                    }
                  ]
                }})
              }
            });
          }else{
            message.channel.send("**"+fEmoji+" You can't ban the bot.**")
          }
        }
      }).catch(() => {
        message.channel.send(fEmoji+" **Sorry, I can't find that user!**")
      });
    }
  }
});

addcommand("kick",[],"This command will kick someone out of the server.","moderator",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          if(message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0){
            var reason = "No Reason Provided"
            if(args[2]){
              reason = "";
              args.forEach(function(arg,n){
                if(n > 1){
                  if(n > 2){
                    reason = reason+" "
                  }
                  reason = reason+arg
                }
              });
            }
            mentionedmember.user.createDM().then((boi) => {
              boi.send('**You have been kicked from the server for ['+reason+']**')
              mentionedmember.kick()
              message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been kicked.**");
              guild.channels.forEach(function(channel){
                if(channel.name === "logs"){
                  channel.send({"embed": {
                    "description":"Kick",
                    "timestamp": new Date(),
                    "fields": [
                      {
                        "name": "Staff Member",
                        "value": "<@"+message.author.id+">",
                        "inline": true
                      },
                      {
                        "name": "User",
                        "value": "<@"+mentionedmember.id+">",
                        "inline": true
                      },
                      {
                        "name": "Reason",
                        "value": reason
                      }
                    ]
                  }})
                }
              });
            });
          }else{
            message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
          }
        }else{
          message.channel.send("**"+fEmoji+" You can't kick the bot.**")
        }
      }
    }
  }
});

addcommand("rerole",["rerank"],"This command will give back a user's premium role if their whitelist is in the database.","helper",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
            datas.forEach(function(data){
              if (data.name === "mains"){
                hwids = data.id;
              }
            })
            if(hwids){
              var alreadyfound = false;
              t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                cards.forEach(function(card){
                  if(card.name === mentionedmember.id){
                    alreadyfound = true;
                  }
                })
                if(alreadyfound === true){
                  if(guild.roles.find("name","premium")){
                    mentionedmember.addRole(guild.roles.find("name","premium"))
                    message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been given back their role.**");
                  }else{
                    message.channel.send("**"+fEmoji+" The premium role does not exist.**")
                  }
                }else{
                  message.channel.send("**"+fEmoji+" This user is not whitelisted.**")
                }
              });
            }else{
              message.channel.send("**Something seems to be wrong with the whitelist database, please contact mustardfoot about this issue.**")
            }
          });
        }
      }
    }
  }
});

addcommand("unwhitelist",["removewhitelist","revokewhitelist"],"This command will remove a user's whitelist from the database.","owner",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
            datas.forEach(function(data){
              if (data.name === "mains"){
                hwids = data.id;
              }
            })
            if(hwids){
              var alreadyfound = false;
              t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                cards.forEach(function(card){
                  if(card.name === mentionedmember.id){
                    t.del('1/cards/'+card.id,function(err,returns){
                      var roles = mentionedmember.roles
                      roles.forEach(function(role){
                        if (role.name === "premium") {
                          mentionedmember.removeRole(role)
                        }
                      })
                      message.channel.send(sEmoji+" **<@"+mentionedmember.id+">'s whitelist has been revoked.**");
                    });
                    alreadyfound = true;
                  }
                })
                if(alreadyfound === false){
                  message.channel.send("**"+fEmoji+" This user is not whitelisted.**")
                }
              });
            }else{
              message.channel.send("**Something seems to be wrong with the whitelist database, please contact mustardfoot about this issue.**")
            }
          });
        }
      }
    }
  }
});

addcommand("whitelist",[],"This command will whitelist a user after they purchase the product.","owner",function(args,message){
  if(message.guild && message.guild === guild){
    if(args[1]){
      var mentionedmember = getmemberfromid(args[1]);
      if (mentionedmember){
        if(mentionedmember.user !== client.user){
          t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
            datas.forEach(function(data){
              if (data.name === "mains"){
                hwids = data.id;
              }
            })
            if(hwids){
              var alreadyfound = false;
              t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                cards.forEach(function(card){
                  if(card.name === mentionedmember.id){
                    alreadyfound = true;
                  }
                })
                if(alreadyfound === false){
                  t.post('/1/cards?name='+mentionedmember.id+'&pos=top&idList='+hwids,function(err,returns){
                    if(guild.roles.find("name","premium")){
                      mentionedmember.addRole(guild.roles.find("name","premium"))
                      message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been whitelisted!**");
                    }else{
                      message.channel.send("**"+fEmoji+" The premium role does not exist.**")
                    }
                  });
                }else{
                  message.channel.send("**"+fEmoji+" This user is already whitelisted.**")
                }
              });
            }else{
              message.channel.send("**Something seems to be wrong with the whitelist database, please contact mustardfoot about this issue.**")
            }
          });
        }
      }
    }
  }
});

addcommand("permit",[],"Permitting a user allows them to post an image, file, or link. The link or image should then be moderated by the user issuing the permit to make sure it follows the rules.","helper",function(args,message){
    if(message.guild && message.guild === guild){
      if(args[1]){
        var theirmember = getmemberfromid(args[1])
        if(theirmember){
          if(guild.roles.find("name","permit")){
            var alreadypermitted = false;
            var roles = theirmember.roles
            roles.forEach(function(role){
              if (role.name === "permit") {
                alreadypermitted = true;
              }
            })
            if(alreadypermitted === false){
              theirmember.addRole(guild.roles.find("name","permit"));
              message.channel.send("**"+sEmoji+" <@"+theirmember.id+"> has been permitted to post an image, file, or link.**");
            }else{
              message.channel.send("**"+fEmoji+" This user is already permitted.**")
            }
          }else{
            message.channel.send("**"+fEmoji+" The permit role cannot be found.**")
          }
        }else{
          message.channel.send("**"+fEmoji+" This is not a valid user.**")
        }
      }
    }
});

addcommand("revokepermit",["removepermit","unpermit"],"Removes a user's permit if they refuse to post a file, image, or link after receiving one.","helper",function(args,message){
    if(message.guild && message.guild === guild){
      if(args[1]){
        var theirmember = getmemberfromid(args[1])
        if(theirmember){
          var unpermitted = false;
          var roles = theirmember.roles
          roles.forEach(function(role){
            if (role.name === "permit") {
              unpermitted = true;
              theirmember.removeRole(role);
              message.channel.send("**"+sEmoji+" <@"+theirmember.id+">'s permit has been removed.**");
            }
          })
          if(unpermitted === false){
            message.channel.send("**"+fEmoji+" <@"+theirmember.id+"> is not permitted.**");
          }
        }else{
          message.channel.send("**"+fEmoji+" This is not a valid user.**")
        }
      }
    }
});

addcommand("commands",["cmds","help","?"],"This command displays all the commands avaliable for use by the user running the command. Supplying it with a command to look up will provide further detail on said command.","",function(args,message){
    if(message.guild && message.guild === guild){
      if(!args[1]){
        var commandsamount = 0
        var viablecommands = ""
        var firstone = true;
        var theirmember = message.member
        commands.forEach(function(command){
          if(command.minrank === "" || guild.roles.find("name",command.minrank)){
            if(command.minrank === "" || theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
              if(firstone === true){
                firstone = false;
                viablecommands = viablecommands+capitalizeFirstLetter(command.name);
              }else{
                viablecommands = viablecommands+", "+capitalizeFirstLetter(command.name);
              }
              commandsamount = commandsamount+1;
            }
          }
        });
        message.channel.send({"embed": {
          "title": "You have access to ("+commandsamount+") commands",
          "description": "``"+viablecommands+"``",
          "footer": {
            "text": "To learn more about a command, say !help [command name] and you will be shown more information about it."
          }
        }})
      }else{
        var saidcommand = args[1].toLowerCase();
        var alreadycommanded = false;
        var theirmember = message.member
        commands.forEach(function(command){
            if(alreadycommanded === false){
              var isalias = false;
              var firstone = true;
              var aliases = ""
              command.aliases.forEach(function(alias){
                if(firstone === true){
                  firstone = false;
                  aliases = aliases+capitalizeFirstLetter(alias);
                }else{
                  aliases = aliases+", "+capitalizeFirstLetter(alias);
                }
                if(saidcommand === alias){
                  isalias = true;
                }
              });
              if(aliases === ""){
                aliases = "None";
              }
              var itsminrank = "None"
              if(command.minrank !== ""){
                itsminrank = capitalizeFirstLetter(command.minrank);
              }
            	if(command.name === saidcommand || isalias === true){
                if(command.minrank === ""){
                  message.channel.send({"embed": {
                  	"description": "`Displaying Info About: ["+capitalizeFirstLetter(command.name)+"]`",
                  	"fields": [
                  		{
                  			"name": "Aliases:",
                  			"value": aliases
                  		},
                  		{
                  			"name": "Description:",
                  			"value": command.desc
                  		},
                  		{
                  			"name": "Minimum Rank:",
                  			"value": "None"
                  		}
                  	]
                  }})
                }else{
                  if(guild){
                    if(guild.roles.find("name",command.minrank)){
                      guild.fetchMember(message.author).then((theirmember) => {
                        if(!theirmember){
                          message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                        }else{
                          if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                            message.channel.send({"embed": {
                              "description": "`Displaying Info About: ["+capitalizeFirstLetter(command.name)+"]`",
                              "fields": [
                                {
                                  "name": "Aliases:",
                                  "value": aliases
                                },
                                {
                                  "name": "Description:",
                                  "value": command.desc
                                },
                                {
                                  "name": "Minimum Rank:",
                                  "value": capitalizeFirstLetter(command.minrank)
                                }
                              ]
                            }})
                          }else{
                            message.channel.send(fEmoji+" **You're not a high enough role to see this command** (requires the *"+command.minrank+"* rank)")
                          }
                        }
                      })
                      .catch(() => {
                        message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                      })
                    }else{
                      message.channel.send(fEmoji+" **Sorry, the required role** (*"+command.minrank+"*) **for this command doesn't exist!**")
                    }
                  }
                }
              }
            }
        });
      }
    }else{
      message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
    }
});

addcommand("unmute",[],"This command unmutes a user who was previously muted.","helper",function(args,message){
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
            guild.channels.forEach(function(channel){
              if(channel.name === "logs"){
                channel.send({"embed": {
                  "description":"Unmute",
                  "timestamp": new Date(),
                  "fields": [
                    {
                      "name": "Staff Member",
                      "value": "<@"+message.author.id+">"
                    },
                    {
                      "name": "User",
                      "value": "<@"+mentionedmember.id+">"
                    }
                  ]
                }})
              }
            });
            message.channel.send("**"+sEmoji+" <@"+mentionedmember.id+"> has been unmuted.**")
          }else{
            message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
          }
        }
      }else{
        message.channel.send("**"+fEmoji+" This is not a valid user.**")
      }
    }
  }else{
    message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
  }
});

addcommand("mute",[],"Prevents the specified user from speaking in text and voice channels until they're unmuted or their mute time is up.\n\n**Examples:**\n!mute [user] 50 (mutes for 50 minutes)\n!mute [user] 30s (mutes for 30 seconds)\n!mute [user] 5h (mutes for 5 hours)\n!mute [user] 2d (mutes for 2 days)\n!mute [user] 1w (mutes for 1 week)","helper",function(args,message){
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
                if(args[2] !== "1"){
                  displaytime = args[2]+" minutes";
                }else{
                  displaytime = args[2]+" minute";
                }
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
                        message.channel.send("**"+fEmoji+" There has been an error giving the user the muted role. Please attempt to re-mute them.**")
                      }).then(() => {
                        mentionedmember.user.createDM().then((boi) => {
                          if(displaytime !== "forever"){
                            boi.send("You have been muted in the server for **"+displaytime+"**. You are unable to speak in text and voice chats until the time is up or a staff member unmutes you.\n\n**Reason:**\n```"+reason+"```")
                          }else{
                            boi.send("You have been muted in the server **forever**. You are unable to speak in text and voice chats unless a staff member unmutes you.\n\n**Reason:**\n```"+reason+"```")
                          }
                        })
                        if(good === true){
                          guild.channels.forEach(function(channel){
                            if(channel.name === "logs"){
                              channel.send({"embed": {
                                "description":"Mute",
                                "timestamp": new Date(),
                                "fields": [
                                  {
                                    "name": "Staff Member",
                                    "value": "<@"+message.author.id+">",
                                    "inline": true
                                  },
                                  {
                                    "name": "Time",
                                    "value": displaytime,
                                    "inline": true
                                  },
                                  {
                                    "name": "User",
                                    "value": "<@"+mentionedmember.id+">"
                                  },
                                  {
                                    "name": "Reason",
                                    "value": reason
                                  }
                                ]
                              }})
                            }
                          });
                          if(displaytime !== "forever"){
                            message.channel.send(sEmoji+" The user <@"+mentionedmember.id+"> has been muted for **"+displaytime+"**.")
                          }else{
                            message.channel.send(sEmoji+" The user <@"+mentionedmember.id+"> has been muted **forever**.")
                          }
                        }
                      });
                    }else{
                      message.channel.send(fEmoji+" **The muted role doesn't exist. Please contact mustardfoot to fix this.**")
                    }
                  });
                });
              }else{
                message.channel.send("**Something seems to be wrong with the mute database, please contact mustardfoot about this issue.**")
              }
            });
          }else{
            message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
          }
        }else{
          message.channel.send("**"+fEmoji+" You can't mute the bot.**")
        }
      }else{
        message.channel.send("**"+fEmoji+" This is not a valid user.**")
      }
    }
  }else{
    message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
  }
});

addcommand("verify",[],"This command is used only in the #verify channel and is used to make sure users are not bots and aren't glitched.","",function(args,message){
    if(message.channel.guild && message.channel.name && message.channel.name === "verify"){
      if(message.member){
        var good = true;
        if(guild.roles.find("name","verified")){
          message.member.addRole(message.member.guild.roles.find("name","verified"))
          .catch(() => {
            good = false;
            message.channel.send("**"+fEmoji+" There has been an error verifying you,** <@"+message.author.id+">**. If this problem persists, please rejoin or contact mustardfoot.**")
          }).then(() => {
            if(good === true){
              message.channel.send("**"+sEmoji+" You have been verified,** <@"+message.author.id+">**.**")
            }
          });
        }else{
          message.channel.send(fEmoji+" **The verified role doesn't exist. Please contact mustardfoot to fix this.**")
        }
      }else{
        message.channel.send("**"+fEmoji+" There has been an error verifying you,** <@"+message.author.id+">**. Please rejoin the server.**")
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

client.on('messageUpdate', (omessage, message) => {
  checkpermit(message,omessage);
});

client.on('message', function(message) {
  if (message.author.equals(client.user)) return;
  checkpermit(message);
  var args = message.content.substring(pref.length).split(" ");
  if(message.content.toLowerCase().indexOf('this is so sad') !== -1){
    message.channel.send(':musical_note: **Now playing Despacito.**')
  }
  if(message.content.toLowerCase().indexOf("what's ligma") !== -1 || message.content.toLowerCase().indexOf("what is ligma") !== -1 || message.content.toLowerCase().indexOf("whats ligma") !== -1){
    message.channel.send('ligma balls XD')
  }else if(message.content.toLowerCase().indexOf("what's sugma") !== -1 || message.content.toLowerCase().indexOf("what is sugma") !== -1 || message.content.toLowerCase().indexOf("whats sugma") !== -1){
    message.channel.send('sugma dick XD')
  }else if(message.content.toLowerCase().indexOf("what's updog") !== -1 || message.content.toLowerCase().indexOf("what is updog") !== -1 || message.content.toLowerCase().indexOf("whats updog") !== -1){
    message.channel.send('not much, whats up with you XD')
  }else if(message.content.toLowerCase().indexOf("what's sugondese") !== -1 || message.content.toLowerCase().indexOf("what is sugondese" || message.content.toLowerCase().indexOf("whats sugondese") !== -1) !== -1){
    message.channel.send('sugondese nuts XD')
  }

  if (!message.content.startsWith(pref)) return;
  if(!guild){
    client.guilds.forEach(function(g){
      if(g.id === process.env.SERVER_ID){
        guild = g;
      }
    });
  }
  sEmoji = client.emojis.find("name", "mustardGood").toString()
  fEmoji = client.emojis.find("name", "mustardBad").toString()
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
                    message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                  }else{
                    if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                      command.does(args,message);
                    }else{
                      message.channel.send(fEmoji+" **You're not a high enough role to run this command** (requires the *"+command.minrank+"* rank)")
                    }
                  }
                })
                .catch(() => {
                  message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                })
              }else{
                message.channel.send(fEmoji+" **Sorry, the required role** (*"+command.minrank+"*) **for this command doesn't exist!**")
              }
            }
          }
        }
      }
  });
});

var myInterval = setInterval(function() {
  t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
    if(datas){
    datas.forEach(function(data){
      if (data.name === "mutes"){
        hwids = data.id;
      }
    })
    if(hwids){
      t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
        cards.forEach(function(card){
          t.get('1/cards/'+card.id+'/dateLastActivity',function(err,date){
            if(date){
              var goaltime = new Date(date._value);
              var todaytime = new Date();
              var todaymin = diff_minutes(todaytime,goaltime,card.desc);
              if (todaymin >= 0 && card.desc !== 0 && card.desc !== "0"){
                var cardname = card.name;
                var carddesc = card.desc;
                t.del('1/cards/'+card.id,function(err,returns){});
                client.fetchUser(cardname).then((thatuser) => {
                  if(thatuser){
                    guild.fetchMember(thatuser).then((muser) => {
                      if(muser){
                        var roles = muser.roles
                        roles.forEach(function(role){
                          if (role.name === "muted") {
                            muser.removeRole(role)
                            muser.createDM().then((boi) => {
                              boi.send('**Your mute time has run out and you have been unmuted in the server. You may now talk again.**')
                            })
                            guild.channels.forEach(function(channel){
                              if(channel.name === "logs"){
                                channel.send({"embed": {
                                  "description":"Automatic Unmute",
                                  "timestamp": new Date(),
                                  "fields": [
                                    {
                                      "name": "User",
                                      "value": "<@"+muser.id+">"
                                    }
                                  ]
                                }})
                              }
                            });
                          }
                        })
                      }
                    })
                  }
                })
              }else{
                var cardname = card.name;
                var carddesc = card.desc;
                client.fetchUser(cardname).then((thatuser) => {
                  if(thatuser && thatuser !== undefined){
                    guild.fetchMember(thatuser).then((muser) => {
                      if(muser && muser !== undefined){
                        if (guild.roles.find("name","muted")) {
                          muser.addRole(guild.roles.find("name","muted"))
                        }
                      }
                    })
                  }
                })
              }
            }
          });
        })
      });
    }
  }
});
}, 5000);

client.login(process.env.BOT_TOKEN);
