// main message handler
module.exports = async msg => {
  if (!msg.author.bot && msg.content.startsWith('!lavealt')) {
    if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
    let cmd = msg.content.slice(9), res;
    console.debug(`lavealt from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${util.inspect(cmd)}`);
    try {
      res = eval(cmd);
      console.debug(`-> ${util.inspect(res)}`);
      if (props.erg && msg.channel.id != '733760003055288350') return;
      var richres = new Discord.MessageEmbed()
        .setTitle('Lavealt Rs')
        .setDescription(util.inspect(res));
      msg.channel.send(richres);
    } catch (e) {
      console.log('err in lavealt');
      console.debug(e.stack);
      if (props.erg && msg.channel.id != '733760003055288350') return;
      var richres = new Discord.MessageEmbed()
        .setTitle('Lavealt Er')
        .setDescription(e.stack);
      msg.channel.send(richres);
    }
    return;
  }

  if (handlers.extra.message) {
    let res;
    for (var i = 0; i < handlers.extra.message.length; i++) {
      if (handlers.extra.message[i].constructor == Function) res = handlers.extra.message[i](msg, i);
      else res = await handlers.extra.message[i](msg, i);
      if (res === 0) return;
    }
  }

  if (msg.author.bot) return;

  if (msg.guild && props.saved.disallowed_guilds.includes(msg.guild.id)) return;

  if (msg.guild && persGuildData.special_guilds.includes(msg.guild.id) && mutelist.includes(msg.author.id))
    msg.delete();

  if (!msg.guild) {
    logmsg(`dm from ${msg.author.tag} (channel ${msg.channel.id}) with contents ${util.inspect(msg.content)}`);
    if (props.feat.savedms && !props.saved.misc.dmchannels.includes(msg.channel.id)) {
      props.saved.misc.dmchannels.push(msg.channel.id);
    }
  }
  
  if (msg.channel.permissionsFor && !msg.channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return;

  // argstring = the part after the workingprefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var isCommand = 0, cmdstring, command, argstring, args;
  if (msg.guild) {
    let guilddata = props.saved.guilds[msg.guild ? msg.guild.id : 'default'];
    let workingprefix = guilddata ? guilddata.prefix : props.saved.guilds.default.prefix;

    if (msg.content.startsWith(universalprefix)) {
      isCommand = 1;
      cmdstring = msg.content.slice(universalprefix.length).trim();
    } else if (msg.content.startsWith(workingprefix)) {
      isCommand = 1;
      cmdstring = msg.content.slice(workingprefix.length).trim();
    } else if (msg.content.startsWith('<@' + client.user.id + '>')) {
      isCommand = 1;
      cmdstring = msg.content.slice(client.user.id.length + 3).trim();
    } else if (msg.content.startsWith('<@!' + client.user.id + '>')) {
      isCommand = 1;
      cmdstring = msg.content.slice(client.user.id.length + 4).trim();
    }

    if (msg.content == '<@' + client.user.id + '>' || msg.content == '<@!' + client.user.id + '>') return msg.channel.send(`I am ${props.feat.version == 'canary' ? 'Thebotcat Canary' : 'Thebotcat'} version ${version}, prefix \`${workingprefix}\``);

    // this code loops through the commands array to see if the stated text matches any known command
    if (isCommand) {
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].full_string && commands[i].name == cmdstring || !commands[i].full_string && cmdstring.startsWith(commands[i].name)) {
          command = commands[i].name;
          if (cmdstring[command.length] != ' ' && cmdstring[command.length] != '\n' && cmdstring.length > command.length) continue;
          if (command != 'settings' &&
            props.saved.guilds[msg.guild.id] && (
              !props.saved.guilds[msg.guild.id].enabled_commands.global ||
              !props.saved.guilds[msg.guild.id].enabled_commands.categories[commands[i].category] ||
              !(props.saved.guilds[msg.guild.id].enabled_commands.commands[command] || !commands[i].public && persGuildData.special_guilds.includes(msg.guild.id)))) continue;
          argstring = cmdstring.slice(command.length + 1);
          args = argstring == '' ? [] : argstring.split(' ');
          isCommand = 2 + i;
          break;
        }
      }
    }

    // this is the screening for bad words part
    let isdeveloper = common.isDeveloper(msg), isadmin = common.isAdmin(msg);
    let dodelete = false;
    let word, content, bypass;
    for (var i = 0; i < badwords.length; i++) {
      word = badwords[i];
      if (word.enabled) {
        content = msg.content;
        if (word.type & 8) content = content.toLowerCase();
        bypass = isdeveloper && word.adminbypass & 1 || isadmin && word.adminbypass & 2;
        if (!bypass) {
          switch (word.type & 7) {
            case 0: break;
            case 1:
              if (content != word.word) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            case 2:
              if (!content.split(/ +/g).some(x => x == word.word)) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            case 3:
              if (!content.includes(word.word)) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            case 4:
              if (!word.word.test(content)) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            default: break;
          }
        }
      }
    }
    if (dodelete) {
      if (!isCommand) msg.delete();
      if (msg.content.toLowerCase() != 'heck') {
        infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      } else {
        logmsg(`user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      }
    }
    if (isCommand >= 2)
      return commands[isCommand - 2].execute(msg, cmdstring, command, argstring, args);
  }
};
