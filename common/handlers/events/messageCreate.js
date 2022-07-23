// main message handler
module.exports = async msg => {
  if (!msg.author.bot && msg.content.startsWith('!lavealt')) {
    if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
    let cmdstr = msg.content.slice(9), res;
    console.debug(`lavealt from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${util.inspect(cmdstr)}`);
    try {
      res = eval(cmdstr);
      console.debug(`-> ${util.inspect(res)}`);
      if (props.erg && msg.channel.id != persData.ids.channel.v2) return;
      let richres = new Discord.EmbedBuilder()
        .setTitle('Lavealt Rs')
        .setDescription(util.inspect(res));
      msg.channel.send({ embeds: [richres] });
    } catch (e) {
      console.log('err in lavealt');
      console.debug(e.stack);
      if (props.erg && msg.channel.id != persData.ids.channel.v2) return;
      let richres = new Discord.EmbedBuilder()
        .setTitle('Lavealt Er')
        .setDescription(e.stack);
      msg.channel.send({ embeds: [richres] });
    }
    return;
  }
  
  if (handlers.extra.messageCreate) {
    let res;
    for (var handlerFunc of handlers.extra.messageCreate) {
      if (handlerFunc.constructor == Function) res = handlerFunc(msg);
      else res = await handlerFunc(msg);
      if (res === 0) return;
    }
  }
  
  if (msg.author.bot) return;
  
  if (msg.guild && props.saved.disallowed_guilds.includes(msg.guild.id)) return;
  
  if (msg.guild && persData.special_guilds_set.has(msg.guild.id) && mutelist.includes(msg.author.id))
    msg.delete();
  
  if (!msg.guild) {
    if (props.feat.savedms && !props.saved.misc.dmchannels.includes(msg.channel.id)) {
      props.saved.misc.dmchannels.push(msg.channel.id);
      schedulePropsSave();
    }
  }
  
  if (msg.channel.permissionsFor && !msg.channel.permissionsFor(client.user.id).has(Discord.PermissionsBitField.Flags.SendMessages)) return;
  
  // argstring = the part after the workingprefix, command and args in one big string
  // cmdName = the actual command
  // args = array of arguments
  var isCommand = 0, cmd, cmdName, cmdstring, argstring, rawArgs, args, kwargs;
  let guilddata = props.saved.guilds[msg.guild ? msg.guild.id : 'default'] || props.saved.guilds.default;
  let workingprefix = guilddata.prefix;
  
  if (msg.content == '<@' + client.user.id + '>' || msg.content == '<@!' + client.user.id + '>') return msg.channel.send(`I am ${props.feat.version == 'canary' ? 'Thebotcat Canary' : 'Thebotcat'} version ${version}, prefix \`${workingprefix}\``);
  
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
  
  if (!msg.guild) {
    if (!(isCommand || msg.content && (msg.content.startsWith('</') || msg.content.startsWith('/'))))
      logmsg(`dm from ${msg.author.tag} (channel ${msg.channel.id}) with contents ${util.inspect(msg.content)}`);
  }
  
  // this code loops through the commands array to see if the stated text matches any known command
  if (isCommand == 1) {
    for (var cmdObj of commands) {
      if (!(msg.guild && cmdObj.flags & 4 || !msg.guild && cmdObj.flags & 8) || !(cmdObj.flags & 16)) continue;
      let cmdstringLower = cmdstring.toLowerCase();
      let cmdAliases = [cmdObj.name, ...(cmdObj.aliases ?? [])], doBreak = false, cmdNameStr;
      for (cmdNameStr of cmdAliases) {
        if (!(cmdObj.flags & 1 && cmdNameStr == cmdstringLower || !(cmdObj.flags & 1) && cmdstringLower.startsWith(cmdNameStr))) continue;
        if (cmdstringLower[cmdNameStr.length] != ' ' && cmdstringLower[cmdNameStr.length] != '\n' && cmdstringLower.length > cmdNameStr.length) continue;
        if (msg.guild && (
          cmdObj.flags & 2 && (
            cmdNameStr != 'settings' && props.saved.guilds[msg.guild.id] && (
              !props.saved.guilds[msg.guild.id].enabled_commands.global ||
              props.saved.guilds[msg.guild.id].enabled_commands.categories[cmdObj.category] == false ||
              props.saved.guilds[msg.guild.id].enabled_commands.commands[cmdNameStr] == false ||
              cmdNameStr == 'join' && props.saved.guilds[msg.guild.id].enabled_commands.commands['leave'] == false ||
              cmdNameStr == 'play' && props.saved.guilds[msg.guild.id].enabled_commands.commands['stop'] == false)) ||
          !(cmdObj.flags & 2) && !persData.special_guilds_set.has(msg.guild.id))) continue;
        argstring = cmdstring.slice(cmdNameStr.length).trim();
        ({ rawArgs, args, kwargs } = common.parseArgs(argstring));
        isCommand = 2;
        cmd = cmdObj;
        cmdName = cmdNameStr;
        doBreak = true;
      }
      if (doBreak) break;
    }
  }
  
  if (msg.guild) {
    // this is the screening for bad words part
    let isadmin = common.isAdmin(msg);
    let dodelete = false, badwordTriggered = false;
    let badwords = props.saved.guilds[msg.guild.id] ? props.saved.guilds[msg.guild.id].basic_automod.bad_words : [];
    for (var word of badwords) {
      if (word.enabled) {
        let content = msg.content;
        if (word.type & 4) content = content.toLowerCase();
        let bypass = isadmin && word.ignore_admin || word.ignored_roles.some(x => msg.member.roles.cache.has(x));
        if (!bypass) {
          switch (word.type & 3) {
            case 0: if (content != word.word) break; badwordTriggered = true; break;
            case 1: if (!content.split(/ +/g).some(x => x == word.word)) break; badwordTriggered = true; break;
            case 2: if (!content.includes(word.word)) break; badwordTriggered = true; break;
          }
          if (badwordTriggered) {
            dodelete = true;
            let content = word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? common.removePings(util.inspect(msg.content)) : 'Error: message length over 1800 characters');
            if (!isCommand || isCommand && cmdName != 'settings') {
              if (isCommand < 2)
                msg.channel.send(content);
              else
                msg.reply(content);
            }
            badwordTriggered = false;
          }
        }
      }
    }
    if (dodelete) {
      if (msg.content.toLowerCase() != 'heck' || !persData.special_guilds_set.has(msg.guild.id))
        infomsg(msg.guild, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      else
        logmsg(`user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      if (isCommand < 2) {
        try {
          await msg.delete();
        } catch (e) {}
      }
    }
  }
  
  if (isCommand == 2 && common.hasBotPermissions(msg, common.constants.botRolePermBits.NORMAL)) {
    try {
      if (!cmd.execute) return;
      
      let o = {
        cmdName,
        cmd,
        args,
        channel: msg.channel,
        guild: msg.guild,
        author: msg.author,
        member: msg.member,
        msg,
        cmdstring,
        argstring,
        rawArgs,
        kwargs,
      };
      
      Object.defineProperty(o, 'asOneArg', { configurable: true, enumerable: true, get: common.onMsgOneArgHelper.bind(null, o), set: common.onMsgOneArgSetHelper.bind(null, o) });
      
      if (cmd.execute.constructor == Function)
        return cmd.execute(o, msg, rawArgs);
      else
        return await cmd.execute(o, msg, rawArgs);
    } catch (e) {
      if (e instanceof common.BotError) {
        return msg.channel.send(`Error: ${e.message}`);
      } else throw e;
    }
  }
};
