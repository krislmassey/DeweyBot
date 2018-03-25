var logger = require('winston');
var love_messages = require('./messages/i-love-you.json');
var ask_dewey = require('./messages/ask-dewey.json');


var TESTMODE = false;
var RELEASEMODE = true;
var mention = '<@426826780465168384>';
 

//logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize : true
});
logger.level = 'debug';


//FUNCTION DEFINITIONS
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  function getRandom(min, max) {
      return Math.floor(Math.random() * (max-min) + min);
  }

  function ask(user, userID, channelID, message, evt){
      //get size of ask messages
      var range = ask_dewey.messages1.length;
      //get random seed1
      var seed = getRandom(0, range);

      var memo = ask_dewey.messages1[seed];

      bot.sendMessage({
          to: channelID,
          message: memo
      })
  }

  function tryKeyPhrases(user, userID, channelID, message, evt){
    lowermessage = message.toLowerCase();
    var FOUND = false

    if (message.includes(mention) && (lowermessage.includes('i love you') || lowermessage.includes('you are loved'))){
        FOUND = true
        var range = love_messages.love1.length;
        var seed = getRandom(0, range);
        var memo = love_messages.love1[seed];

        bot.sendMessage({
            to: channelID,
            message: memo
        });
    }

    else {  //if dewey is contacted with no other matching phrase say this
        bot.sendMessage({
            to: channelID,
            message: 'I am Dewey!'
        });
    }

    return FOUND;
}

function sayYouDontKnow(user, userID, channelID, message, evt){
      bot.sendMessage({
          to:channelID,
          message: 'This is outside the scope of Dewey\'s current programming.'
      });
}

function parseMessage(user, userID, channelID, message, evt){
    lowermessage = message.toLowerCase();
    var args = message.split(' ');

    if(args[0] == mention) {
        var cmd = args[1];
        args = args.splice(1);

        switch(cmd.toLowerCase()) {
            //@Dewey ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'pong!'
                });
                break;
            case 'echo':
                bot.sendMessage({
                    to:channelID,
                    message: "echo"
                });
                break;

            //ASK DEWEY BLOCK 
            case 'am':
                ask(user, userID, channelID, message, evt);
                break;
            case 'is':
                ask(user, userID, channelID, message, evt);
                break;
            case 'are':
                ask(user, userID, channelID, message, evt);
                break;
            case 'was':
                ask(user, userID, channelID, message, evt);
                break;
            case 'were':
                ask(user, userID, channelID, message, evt);
                break;
            case 'have':
                ask(user, userID, channelID, message, evt);
                break;
            case 'has':
                ask(user, userID, channelID, message, evt);
                break;
            case 'had':
                ask(user, userID, channelID, message, evt);
                break;
            case 'do':
                ask(user, userID, channelID, message, evt);
                break;
            case 'does':
                ask(user, userID, channelID, message, evt);
                break;
            case 'did':
                ask(user, userID, channelID, message, evt);
                break;
            case 'shall':
                ask(user, userID, channelID, message, evt);
                break;
            case 'will':
                ask(user, userID, channelID, message, evt);
                break;
            case 'should':
                ask(user, userID, channelID, message, evt);
                break;
            case 'would':
                ask(user, userID, channelID, message, evt);
                break;
            case 'may':
                ask(user, userID, channelID, message, evt);
                break;
            case 'might':
                ask(user, userID, channelID, message, evt);
                break;
            case 'must':
                ask(user, userID, channelID, message, evt);
                break;
            case 'can':
                ask(user, userID, channelID, message, evt);
                break;
            case 'could':
                ask(user, userID, channelID, message, evt);
                break;
            //give vague/avoiding answers for these
            case 'who':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            case 'where':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            case 'what':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            case 'when':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            case 'why':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            case 'how':
                sayYouDontKnow(user, userID, channelID, message, evt)
                break;
            default:
                tryKeyPhrases(user, userID, channelID, message, evt);
                break;
            }
    }
    
    else if(message.includes(mention)) {
        tryKeyPhrases(user, userID, channelID, message, evt);
        //possible answer "my programming does not cover the scope of this query" or the like
        }

    else {
        //do nothing
        }
    }




//INIT BOT
if(RELEASEMODE){  //for heroku deployment
    var Discord = require('discord.js');
    var bot = new Discord.Client();
    bot.login(process.env.TOKEN);
}
else {  //for test/local deployment
    var Discord = require('discord.io');
    var auth = require('./auth.json');
    var bot = new Discord.Client({
        token: auth.token,
        autorun: true
    });
}


//BOT EVENTS
bot.on('ready', function (evt) {
    logger.info('INITIATING.  DEWEY IS NOW OPERATIONAL');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//make sure bot doesnt respond to its own messages
bot.on('message', function (user, userID, channelID, message, evt) {
    //dont be a dummy and reply to yourself
    if(userID == 426826780465168384) {return;}
    else {
        if(TESTMODE && channelID != 426846974055153665){
            return;
        }
        else {
            if(message === mention){
                //default message
                bot.sendMessage({
                    to: channelID,
                    message: 'Yes?'
                });
            }
            else {
                parseMessage(user, userID, channelID, message, evt);
            }
            
        } 
    }     
    
});