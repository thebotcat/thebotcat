const Discord = require('discord.js');
const client = new Discord.Client();

client.setMaxListeners(999)
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('ready', () => {
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`)
})
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);

client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`)
    //Your other stuff like adding to guildArray
})

//removed from a server
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);

   client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`)
 //remove from guildArray
})
client.on('reconnecting', () => {
  console.log(`Reconnecting!`);
});

client.on('disconnect', () => {
  console.log(`Disconnect!`);
});

const prefix = '!';

client.on('message', message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'rps') {
        let replies = ['rock', 'paper', 'scissors'];
        let result = Math.floor((Math.random() * replies.length));

        let uReply = args[0];
        if (!uReply) return message.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
        if (!replies.includes(uReply)) return message.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);

        if (replies[result] === uReply) {
            console.log(replies[result]);
            return message.channel.send('It\'s a tie! We had the same choice.');
        } else if (uReply === 'rock') {
            console.log(replies[result]);
            if (replies[result] === 'paper') return message.channel.send('I won!');
            else return message.channel.send('You won!');
        } else if (uReply === 'scissors') {
            console.log(replies[result]);
            if (replies[result] === 'rock') return message.channel.send('I won!');
            else return message.channel.send('You won!');
        } else if (uReply === 'paper') {
            console.log(replies[result]);
            if (replies[result] === 'scissors') return message.channel.send('I won!');
            else return message.channel.send('You won!');
        }
    }
});

client.on('message' , msg  => {
  if (msg.content === '!ping') {
   msg.channel.send('Checking Ping').then(m => {
      var ping = m.createdTimestamp - msg.createdTimestamp;
      var botPing = Math.round(ping);

      m.edit(`*Bot Ping:* **${ping}**\n*API Ping:* **${botPing}**`);
  })
    }
});

client.on('message', msg => {
  if (msg.content === '!hey') {
    msg.reply('wassup boi');
  }
});

client.on('message', msg => {
  if (msg.content === '!Ameyyuu') {
    msg.reply('Ameyyuu is who made me thanks for asking!');
  }
});

client.on('message', msg => {
  if (msg.content === '!commit die') {
    msg.reply('well just commit die?');
  }
});

client.on('message', msg => {
  if (msg.content === '!do i suck') {
    msg.reply('I mean i suppose so but idk ask someone else im only a robot');
  }
});

client.on('message', msg => {
  if (msg.content === '!who am i') {
    msg.reply('well you are you i suppose or maybe you are nothing....');
  }
});

client.on('message', msg => {
  if (msg.content === '!joke ') {
    msg.reply('what do you call the security at a samsung store? GUARDIANS OF THE GALAXY he he he he');
  }
});

client.on('message', msg => {
  if (msg.content === '!staff') {
    msg.reply('The staff are <@571752439263526913> <@525753318576750612> <@642796707138240534> <@434431665914511366> <@427874667227774976> Thats all!');
  }
});

client.on('message', msg => {
  if (msg.content === '!joke 2') {
    msg.reply('Why are there no migit accountants? BECAUSE THEY ALL COME UP SHORT he he he');
  }
});

client.on('message', msg => {
  if (msg.content === '!joke 3') {
    msg.reply('what do you call a fat pumpkin A PLUMPKIN he he he');
  }
});

client.on('message', msg => {
  if (msg.content === '!temmie') {
    msg.reply('Do Yo U wA nNa HA vE a B aD TEM?');
  }
});

client.on('message', msg => {
  if (msg.content === '!vsco') {
    msg.reply('And i oop sksk and i oop sksks pls save the turtles');
  }
});

client.on('message', msg => {
  if (msg.content === '!reee') {
    msg.reply('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
  }
});

client.on('message', msg => {
  if (msg.content === '!fun fact') {
    msg.reply('Did you know that Mars used to have an ocean?');
  }
});

client.on('message', msg => {
  if (msg.content === '!fun fact 2') {
    msg.reply('did you know some cacti can go 2 years without water?');
  }
});

client.on('message', msg => {
  if (msg.content === '!fun fact 3') {
    msg.reply('Did you know that Atacama Desert is the driest desert in the world?');
  }
});

client.on('message', msg => {
  if (msg.content === '!why am i stupid') {
    msg.reply('i dont know why are you stupid?');
  }
});

client.on('message', msg => {
  if (msg.content === '!ur mom gay') {
    msg.reply('well yeah she is...');
  }
});

client.on('message', msg => {
  if (msg.content === '!bot') {
    msg.reply('Hello im Thebotcat i was made using Javascript pls no bully me im swag');
  }
});

client.on('message', msg => {
  if (msg.content === '!goose') {
    msg.reply('Honk');
  }
});

client.on('message', msg => {
  if (msg.content === '!system 32') {
    msg.reply('uninstall system 32 and you will get free vouchers');
  }
});

client.on('message', msg => {
  if (msg.content === '!joke 4') {
    msg.reply('What is a vampires favourite drink? B POSITIVE he he he');
  }
});


client.on('message', msg => {
  if (msg.content === '!pls money') {
    msg.reply('oh sorry dude i dont have any change on me');
  }
});

client.on('message', msg => {
  if (msg.content === '!bitcoin') {
    msg.reply('I have hacked all your devices if you do not give 1000000 bitcoin then you will never get them back');
  }
});

client.on('message', msg => {
  if (msg.content === '!pun 1') {
    msg.reply('The first computer dates back to Adam and Eve. It was an Apple with limited memory, just one byte. And then everything crashed.');
  }
});

client.on('message', msg => {
  if (msg.content === '!pun 2') {
    msg.reply('The future, the present and the past walked into a bar. Things got a little tense.');
  }
}); 

client.on('message', msg => {
  if (msg.content === '!pun 3') {
    msg.reply('I wasnt originally going to get a brain transplant but then I changed my mind.');
  }
}); 

client.on('message', msg => {
  if (msg.content === '!pun 4') {
    msg.reply('Im reading a book about anti gravity. Its impossible to put down.');
  }
}); 

client.on('message', msg => {
  if (msg.content === '!pun 5') {
    msg.reply('How did I escape Iraq? Iran.');
  }
}); 

client.on('message', msg => {
  if (msg.content === '!pun 6') {
    msg.reply('Dont spell part backwards. Its a trap.');
  }
}); 

client.on('message' , msg  => {
  if (msg.content === '!meme 1') {
    wholesome3 = new Discord.RichEmbed() .setImage('https://i.redd.it/eigm3xcqb4021.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 2') {
    wholesome3 = new Discord.RichEmbed() .setImage('https://i.redd.it/4k77d475ssr11.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 3') {
    wholesome3 = new Discord.RichEmbed() .setImage('https://i.imgflip.com/19k1e4.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 4') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2017/10/mom-meme-13.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 5') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2019/06/z-funny-19.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 6') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.pinimg.com/736x/c7/e0/4a/c7e04a34e0615b1002971ca2c33c39bf--funny-harry-potter-memes-harry-potter-images.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 7') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://4.bp.blogspot.com/-3e8gdP1uJV0/Vvqhh83m_9I/AAAAAAAACPA/kWZhRVb1Mr8XRe6l-DfQgndG5spqbT9wQ/s1600/cat%2Bplumbing%2Bmemes.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 8') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://www.quirkybyte.com/wp-content/uploads/2017/03/2-65.jpg'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 9') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://ruinmyweek.com/wp-content/uploads/2016/04/the-best-funny-pictures-of-shy-shark-meme-05.png'); 
    msg.channel.send(wholesome3)
      }
    });

client.on('message' , msg  => {
  if (msg.content === '!meme 10') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://images.complex.com/complex/image/upload/c_fill,g_center,w_1200/fl_lossy,pg_1,q_auto/ngfeuqkthhvjcge7wzpy.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/CsTEXpv1gA2KMS4WeT8lKIhjzr4LCc-Kb5XxBh3wBq4.jpg?w=320&s=6aff41d1c189cf568d9af5fd27def234'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 2') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/NL43nss1-Qo/maxresdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 3') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://static.boredpanda.com/blog/wp-content/uploads/2017/04/funny-wholesome-animal-memes-40.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 4') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://pleated-jeans.com/wp-content/uploads/2017/04/funny-wholesome-animal-memes-25-58f098d26e11d__700.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 5') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://ichef.bbci.co.uk/images/ic/704xn/p063snf3.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 6') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/c9lhHHp6fHE/maxresdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 7') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/8fzhaFDE8Bg/maxresdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 8') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://pleated-jeans.com/wp-content/uploads/2017/04/funny-wholesome-animal-memes-43.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 9') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://thumbs.gfycat.com/WellinformedDirectBorderterrier-poster.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!wholesome 10') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/WB_Dn4lO1Q8/maxresdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/6l2ISD5mE9I/hqdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 2') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/l0ouJPvLrSm1rrE7jUUYvWDivqc-a9COtaFKlj63Of8.jpg?w=1024&s=e002114bc57603dd80c6c7cca9a11993'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 3') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://static.boredpanda.com/blog/wp-content/uploads/2014/03/cute-smiling-animals-coverimage.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 4') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/alJHDHo9nMA/hqdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 5') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://www.mypokecard.com/my/galery/kcR5vX8o3Tb8.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 6') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/7IVzs28GsvU/maxresdefault.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 7') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://i.telegraph.co.uk/multimedia/archive/01661/seal_1661793c.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 8') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://imaliyam.files.wordpress.com/2015/10/cat-crying-sad-cat.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 9') {
   const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F1MDoLV8JCb4%2Fhqdefault.jpg&f=1&nofb=1'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg  => {
  if (msg.content === '!cute animal 10') {
   const wholesome3 = new Discord.RichEmbed() .setImage('http://www.nakedcapitalism.com/wp-content/uploads/2015/10/cute-baby-fox.jpg'); 
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!surreal 1') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://vignette.wikia.nocookie.net/surrealmemes/images/6/67/Received_775602375964559.jpeg/revision/latest?cb=20180521211008');
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!surreal 2') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/2wCcac81SacTIhtj7iJygWgImH7fPH265AjoKdVYVG8.jpg?w=751&s=10aa7ecfb10c740b29bc009249529cba');
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!fortnite') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/98aa4ee2eb9834fbc140e792f9a55472/tenor.gif');
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!gamer') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://media.giphy.com/media/g0KiswZX0Hg0hUBvUr/giphy.gif');
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!minecraft') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://1.bp.blogspot.com/-SqTOrZ9Hx4U/UHs0PK1yEUI/AAAAAAAAAFg/9Sz8LMNhkYQ/s1600/tumblr_m85obfgM221rcl24wo1_500.gif');
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!minecraft 2') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://1.bp.blogspot.com/-FxFMu7yct6g/UHs6l_o1DEI/AAAAAAAAAG8/w5t_pkcbMww/s1600/tumblr_m8vwr1mGeS1rq1xcqo1_500.gif');
msg.channel.send(wholesome3)
  }
});
 
client.on('message' , msg => {
  if (msg.content === '!trump') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://worldwideinterweb.com/wp-content/uploads/2016/03/best-meme-of-the-day.jpg')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 2') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://cbsnews2.cbsistatic.com/hub/i/r/2017/02/10/7496e849-650a-4e21-b0a1-9e64c74080b3/resize/620x465/f9d411c7cb55df6929c55f912e24c5aa/screen-shot-2017-02-10-at-1-56-08-pm.png')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 3') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://cbsnews3.cbsistatic.com/hub/i/r/2017/02/10/4bac0e53-46a2-4592-881d-39664d6762f1/resize/620x465/51dea4928ab5ef9d3cda4fdd5c1d50ea/screen-shot-2017-02-10-at-2-34-14-pm.png')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 4') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2016/12/Funny-Donald-Trump-Meme.jpg')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 5') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://www.essence.com/wp-content/uploads/2016/11/1478865384/Trump%20Memes-1.jpg')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 6') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.newsapi.com.au/image/v1/7da0efab913deec4b4f79623951063e5')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!big boi') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/681900183063494715/684825699588112394/eeeeee.png')
    .setTitle('he is chonky')
    .setFooter('big boi')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 7') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://acidcow.com/pics/20160621/trump_mems_12.jpg')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 8') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.imgflip.com/xyf64.jpg')
    .setTitle('Trump memes coming right up!')
    .setFooter('here are them sweet trump memes!')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 9') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://s15858.pcdn.co/wp-content/uploads/2015/12/13-donald-trump-meme-save-water-gatorade-electrolytes1.jpg')
    .setTitle('Sweet orange boi!')
    .setFooter('trump is a orange')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!bruh') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/681482685751099579/681482802822512689/image0.jpg')
    .setTitle('i still question why this exists....')
    .setFooter('why does this exist')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!trump 10') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2016/11/Donald-Trump-Wins-funny-memes-17.jpg')
    .setTitle('Are we sure?')
    .setFooter('Are we really sure?')
msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!true gamer') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534491966982062110/685510900609974322/ESbpeIcXsAERN9-.jpg')
    .setTitle('Now this is what a True gamer looks like')
    .setFooter('Tru gamer power')
msg.channel.send(wholesome3)
  }
});

client.on("message", (message) => { if (message.content.startsWith("!kick")) { 
  if (!message.member.hasPermission("KICK_MEMBERS")) {
              return message.channel.send('No permission!')
          }
          var member= message.mentions.members.first();
          if (member.hasPermission("KICK_MEMBERS")) {
              const perm_failed = new Discord.RichEmbed()
        .setTitle('Access denied!')
        .setDescription('This user is a mod!')
         return message.channel.send(perm_failed)
              }
              if (client.hasPermission("KICK_MEMBERS")) {
              return    message.channel.send('I cannot kick members')
                  }
   member.kick()
   const kick = new Discord.RichEmbed()
       .setTitle("Goodbye!")
       .setDescription(member.displayName + " has been successfully kicked ");
       message.channel.send(kick)
        };
         })

         client.on("message", (message) => { 
          if (message.content.startsWith("!ban")) {
              const user = message.mentions.users.first();
             if (user === undefined) { 
                 return;
            }
   if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.channel.send('No permission!')
        }
        var member= message.mentions.members.first();
        if (member.hasPermission("BAN_MEMBERS")) {
            const perm_failed = new Discord.RichEmbed()
      .setTitle('Access denied!')
      .setDescription('This user is a mod!')
       return message.channel.send(perm_failed)
            }
       var member= message.mentions.members.first(); // ban
        member.ban()
              const ban = new Discord.RichEmbed()
     message.delete()
     .setDescription(member.displayName + " has been stook with a ban hammer");
     message.channel.send(ban)
       }
       });
client.on('message' , msg => {
  if (msg.content === '!uwu') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://media.tenor.co/images/7a2703befdd934a9e54ac4d44ae146e1/tenor.gif')
     .setTitle('UWU dance')
     .setFooter('so UwU')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!hug') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://media.giphy.com/media/f4HpCDvF84oh2/giphy.gif')
     .setTitle('Heres a hug')
     .setFooter('cuddly')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!uwu 2') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/_beljCZLA-4/maxresdefault.jpg')
     .setTitle('UWU')
     .setFooter('so UwU')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!doggo') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://media.tenor.co/images/2e92887462db1626e7c1007c857ba548/tenor.gif')
     .setTitle('Doggo no want bath')
     .setFooter('so fluff')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!doggo 2') {
     const wholesome3 = new Discord.RichEmbed() .setImage('http://gifimage.net/wp-content/uploads/2017/07/doggo-gif-9.gif')
     .setTitle('Doggo dance')
     .setFooter('so fluff')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!doggo 3') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/911d70f8713972d664876e01acbdefc6/tenor.gif')
     .setTitle('hewwo how awwe u')
     .setFooter('so fluff')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!patreon') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://pmcvariety.files.wordpress.com/2017/05/patreon-logo-e1495085041531.jpg?w=700&h=393&crop=1')
     .setTitle('if you would like too support me in bettering my bot or other things support me here! https://www.patreon.com/user?u=19323140&fan_landing=true ')
     .setFooter('Thebotcats patreon')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!corona meme') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534487318992650269/688491541299200081/Image26.jpg')
     .setTitle('when Corona appears') 
     .setFooter('So true though')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!corona meme 2') {
     const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/656611956370964480/689198617134760064/b4b610c.jpg')
     .setTitle('This is true') 
     .setFooter('So true though')
 msg.channel.send(wholesome3)
   }
});

client.on('message' , msg => {
  if (msg.content === '!corona meme 3') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthefunnybeaver.com%2Fwp-content%2Fuploads%2F2020%2F01%2Fcorona-virus-meme-9.jpg&f=1&nofb=1')
    .setTitle('i know this is not funny but it is')
    .setFooter('im sorry')
 msg.channel.send(wholesome3)
  }
});   

client.on('message' , msg => {
  if (msg.content === '!wholesome 11') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/483a1eeec1e993844b84d956fdca8e4a/tenor.gif')
    .setTitle('aww he is sad')
    .setFooter('Emotional support for animals comes free when there so cute!')
 msg.channel.send(wholesome3)
  }
});   

client.on('message' , msg => {
  if (msg.content === '!wholesome 12') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://i.pinimg.com/originals/ef/81/d9/ef81d9899f8e39146fccec17f76fc3cf.gif')
    .setTitle('He is so fluffy!')
    .setFooter('Fluffy boi')
 msg.channel.send(wholesome3)
  }
});    

client.on('message' , msg => {
  if (msg.content === '!doggo 4') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/emojis/688821607027966020.png?v=1')
    .setTitle('Doggo is happy because he has hat on')
    .setFooter('he is happy boi')
 msg.channel.send(wholesome3)
  }
});   

client.on('message' , msg => {
  if (msg.content === '!doggo 5') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fimages%2Fc53695a7480ecb471c15c449604f8be1%2Ftenor.gif%3Fitemid%3D8794301&f=1&nofb=1')
    .setTitle('He has been rolled up')
    .setFooter('he likes it though')
 msg.channel.send(wholesome3)
  }
}); 

client.on('message' , msg => {
  if (msg.content === '!corona meme 4') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534491966982062110/690671501594066984/wk79jxegwrn41.png')
    .setTitle('This is what happens')
    .setFooter('Big oof')
 msg.channel.send(wholesome3)
  }
});

client.on('message' , msg => {
  if (msg.content === '!corona meme 5') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/510163477462253577/691478243332718652/image0.jpg')
    .setTitle('This is what happens When The government asks this to all workers')
    .setFooter('Corona memes are the best')
 msg.channel.send(wholesome3)
  }
}); 

client.on('message' , msg => {
  if (msg.content === '!monkaS') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/6c5e42878a150c038925bb3ff63077c5/tenor.gif?itemid=12246365')
    .setTitle('MonkaS')
    .setFooter('MonkaSS')
 msg.channel.send(wholesome3)
  }
}); 

client.on('message' , msg => {
  if (msg.content === '!discord') {
    const wholesome3 = new Discord.RichEmbed() .setImage('http://www.fraghero.com/wp-content/uploads/2017/03/discord_logo__1489184841_48114.jpg')
    .setTitle('This is The thebotcats discord bot server if you wanna join click the link! https://discord.gg/NamrBZc')
    .setFooter('Server for thebotcat discord bot come along and say hi!')
 msg.channel.send(wholesome3)
  }
}); 



client.on('message', message => {
  if (!message.content.startsWith(prefix)) return;  
  const withoutPrefix = message.content.slice(prefix.length);
  const split = withoutPrefix.split(/ +/);
  const command = split[0];
  const args = split.slice(1);    



  if (command === 'avatar') {
      let targetMember;
      if(!message.mentions.members.first()) {
          targetMember = message.guild.members.get(message.author.id);
      } else {
          targetMember = message.mentions.members.first()
      }

      let avatarEmbed = new Discord.RichEmbed()
          .setImage(targetMember.user.displayAvatarURL)
          .setColor(targetMember.displayHexColor);
          message.channel.send(avatarEmbed);
  }
});

client.on('message' , msg => {
  if (msg.content === '!doggo 6') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2Fimages%2F7515ca39e4e2f13599380796fa348c98%2Ftenor.gif&f=1&nofb=1')
    .setTitle('Doggo ride on turtle')
    .setFooter('he to lazy to walk')
 msg.channel.send(wholesome3)
  }
}); 

client.on('message' , msg => {
  if (msg.content === '!doggo 7') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2FTmzqWbXnmPHBS%2Fgiphy-downsized-large.gif&f=1&nofb=1')
    .setTitle('bird sits on doggo')
    .setFooter('so cute')
 msg.channel.send(wholesome3)
  }
}); 

client.on('message' , msg => {
  if (msg.content === '!shut') {
    const wholesome3 = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.xJlsa-JHMknJieoqdOqJXgHaHD%26pid%3DApi&f=1')
    .setTitle('shut')
    .setDescription('The actual fuck up')
    msg.channel.send(wholesome3)
  }
});

client.on('message', msg => {

  if (msg.content === '!help') {

    const embed = new Discord.RichEmbed()

      .setTitle('Here is a list of commands') 

      .setColor(0xff0000)


      .setDescription('!ping');

    msg.channel.send(embed);
  }
});
       
client.on('message', msg => {
  if (msg.content === 'heck') {
  msg.delete()
    msg.reply('Refrain from using that bad language you frick');
  }
});

client.on('message', msg => {
  if (msg.content === '!unretard') {
    msg.reply('Sorry But i am unable to do that.');
  }
});

client.on('message', msg => {
  if (msg.content === '!techku') {
    msg.reply('what are you doing here bitch lil bitch ass little bitch smh head bitch go away bitch what you say bitch smh my head smh smh bitch bitch bitch bitch boi stupid little bitch ass bitch bitch bitch boi little bitch');
  }
});
client.on('message', msg => {
if (msg.author.id == 571752439263526913) {
if (msg.content === '!say') {

msg.delete()
msg.channel.send(args.join(" "));
}
}
});

client.login('NjgyNzE5NjMwOTY3NDM5Mzc4.Xlk1ug.FPZxGGn3lqkmM28JkwUMIvkbeP8');
