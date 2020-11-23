module.exports = [
  {
    name: 'help',
    full_string: false,
    description: '`!help` to list my commands\n`!help <command>` to print help for command',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (args.length == 0) {
        let [commandsList, commandsCategorized] = getCommandsCategorized(props.saved.guilds[msg.guild.id]);
        return msg.channel.send({
          embed: {
            title: `Commands (${commandsList.length})`,
            description: 'Run `!help <command>` for help on a specific command.',
            fields: Object.keys(commandsCategorized).map(
              x => ({ name: `${x} (${commandsCategorized[x].length})`, value: commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None', inline: false })
            ),
          }
        });
      } else {
        let cmdobj = commands.filter(x => x.name == argstring)[0];
        if (cmdobj && cmdobj.public) {
          if (cmdobj.description)
            return msg.channel.send(cmdobj.description);
          else
            return msg.channel.send(`Command ${argstring} has no description.`);
        } else {
          return msg.channel.send(`Command ${argstring} does not exist.`);
        }
      }
    }
  },
  {
    name: 'version',
    full_string: false,
    description: '`!version` prints the version of my code',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      return msg.channel.send(`Thebotcat is version ${version}`);
    }
  },
  {
    name: 'uptime',
    full_string: false,
    description: '`!uptime` to see my uptime',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatUptimeMessage());
    }
  },
  {
    name: 'status',
    full_string: false,
    description: '`!status` to see my status',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatStatusMessage());
    }
  },
  {
    name: 'fullstatus',
    full_string: false,
    description: '`!fullstatus` to see my full status',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatFullStatusMessage());
    }
  },
  {
    name: 'ping',
    full_string: false,
    description: '`!ping` checks my ping in the websocket, to the web, and discord',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      return new Promise((resolve, reject) => {
        msg.channel.send('Checking Ping').then(m => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = m.createdTimestamp - msg.createdTimestamp;
            var wsPing = client.ws.ping;
            
            resolve(m.edit(`*Bot Ping:* **${botPing}**ms\n*WS Ping:* **${wsPing}**ms\n*API Ping:* **${apiPing}**ms`));
          });
        });
      });
    }
  },
  {
    name: 'discord',
    full_string: false,
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my discord support server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      return msg.channel.send(discord);
    }
  },
  {
    name: 'github',
    full_string: false,
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my github repository (its completely open source)!\nhttps://github.com/Ryujingit/thebotcat')
        .setFooter('And when they clicked "make public" they felt an evil leave their presence.');
      return msg.channel.send(discord);
    }
  },
];
