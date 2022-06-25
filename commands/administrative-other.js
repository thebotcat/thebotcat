module.exports = [
  {
    name: 'say',
    description_slash: 'sends a message as botcat in the current channel',
    flags: 0b111100,
    options: [
      { type: 'STRING', name: 'expression', description: 'what to say', required: true },
      { type: 'BOOLEAN', name: 'mention', description: 'whether the bot should mention (defaults to true)' },
    ],
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg) || addlbotperms[msg.author.id] & 3)) return;
      let text = rawArgs[0] ?? '', mention = rawArgs[1] ? common.stringToBoolean(rawArgs[1]) : true;
      nonlogmsg(`say from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(text)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`say from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      msg.delete();
      return common.regCmdResp(o, text, mention);
    },
    async execute_slash(o, interaction, command, args) {
      if (!(common.isDeveloper(o) || addlbotperms[o.author.id] & 3)) return common.slashCmdResp(o, true, 'dev only command');
      let text = args[0].value, mention = args[1] ? args[1].value : true;
      nonlogmsg(`say from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${util.inspect(text)}`);
      await common.regCmdResp(o, text, mention);
      return common.slashCmdResp(o, true, 'said');
    },
  },
  {
    name: 'sayy',
    description_slash: 'sends a message as botcat in a given channel',
    flags: 0b111100,
    options: [
      { type: 'CHANNEL', name: 'channel', description: 'the channel', required: true },
      { type: 'STRING', name: 'expression', description: 'what to say', required: true },
      { type: 'BOOLEAN', name: 'mention', description: 'whether the bot should mention (defaults to true)' },
    ],
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg) || addlbotperms[msg.author.id] & 2)) return;
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`sayy from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${common.explainChannel(channel, 1)}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      let channelId = rawArgs[0].slice(2, rawArgs[0].length - 1), text = rawArgs[1], mention = rawArgs[2] ? common.stringToBoolean(rawArgs[2]) : true;
      let channel = client.channels.cache.get(channelId);
      if (channel) {
        nonlogmsg(`sayy from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${common.explainChannel(channel, 1)}: ${util.inspect(text)}`);
        return channel.send({ content: text, ...(mention ? { allowedMentions: { parse: ['users', 'roles', 'everyone'] } } : null) });
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!(common.isDeveloper(o) || addlbotperms[o.author.id] & 2)) return common.slashCmdResp(o, true, 'dev only command');
      let channel = client.channels.cache.get(args[0].value), text = args[1].value, mention = args[2] ? args[2].value : true;
      nonlogmsg(`sayy from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${common.explainChannel(channel, 1)}: ${util.inspect(text)}`);
      await channel.send({ content: text, ...(mention ? { allowedMentions: { parse: ['users', 'roles', 'everyone'] } } : null) });
      return common.slashCmdResp(o, true, 'said');
    },
  },
  {
    name: 'getdmchannel',
    flags: 0b011100,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 4)) return;
      let user = await common.searchUser(rawArgs.join(' '), { safeMode: false });
      if (!user) return common.regCmdResp(o, 'Query invalid');
      let dmchannel = await user.createDM();
      return common.regCmdResp(o, `DM channel for ${user.tag} is ${dmchannel.id}, use \`!sayy <#${dmchannel.id}> content\` to speak in channel`);
    },
  },
  {
    name: 'listdmchannels',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 4)) return;
      let channels = Array.from(client.channels.cache.values()).filter(x => x.type == 'dm').map(x => `${x.id}: ${x.recipient.tag}`).join('\n');
      return common.regCmdResp(o, `DM channels:\n${channels}`);
    },
  },
  {
    name: 'c-gmute',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 8)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!mutelist.includes(user.id)) {
        mutelist.push(user.id);
        return common.regCmdResp(o, `Globally muted ${user.tag}`);
      } else {
        return common.regCmdResp(o, `${user.tag} already globally muted`);
      }
    },
  },
  {
    name: 'c-gunmute',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 8)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      let ind;
      if ((ind = mutelist.indexOf(user.id)) != -1) {
        mutelist.splice(ind, 1);
        return common.regCmdResp(o, `Globally unmuted ${user.tag}`);
      } else {
        return common.regCmdResp(o, `${user.tag} not gobally muted`);
      }
    },
  },
  {
    name: 'givedeveloper',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
      nonlogmsg(`givedeveloper from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(o.argstring)}`);
      let id;
      if (/^[0-9]+$/.test(rawArgs[0])) id = rawArgs[0];
      else if (/^<@!?[0-9]+>$/.test(rawArgs[0])) id = rawArgs[0].replace(/[<@!>]/g, '');
      else return;
      developers.push(id);
      return new Promise((resolve, reject) => {
        // make this cancel existing timeout if command is run again
        setTimeout(() => {
          let arr = developers.filter(x => x != id);
          developers.splice(0, Infinity);
          developers.push(...arr);
          resolve(common.regCmdResp(o, rawArgs.slice(2, Infinity).join(' ') || 'times up fool'));
        }, Number(rawArgs[1]) || 120000);
      });
    },
  },
  {
    name: 'giveaddlperm',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg)) return;
      nonlogmsg(`giveaddlperm from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(o.argstring)}`);
      let id;
      if (/^[0-9]+$/.test(rawArgs[0])) id = rawArgs[0];
      else if (/^<@!?[0-9]+>$/.test(rawArgs[0])) id = rawArgs[0].replace(/[<@!>]/g, '');
      else return;
      let perms = Number(rawArgs[1]);
      if (!Number.isSafeInteger(perms)) return;
      addlbotperms[id] = perms;
      return new Promise((resolve, reject) => {
        // make this cancel existing timeout if command is run again
        setTimeout(() => {
          delete addlbotperms[id];
          resolve(common.regCmdResp(o, rawArgs.slice(3, Infinity).join(' ') || 'times up fool'));
        }, Number(rawArgs[2]) || 120000);
      });
    },
  },
  {
    name: 'wipedevelopers',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg)) return;
      developers.length = 0;
    },
  },
  {
    name: 'eval',
    description_slash: 'evaluates.',
    flags: 0b111100,
    options: [ { type: 'STRING', name: 'expression', description: 'the expression to evaluate' } ],
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      let cmd = o.argstring, res;
      nonlogmsg(`evaluating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (cmd == 'deez nuts' || cmd == 'goe mama') return common.regCmdResp(o, 'no');
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`))) {
          return common.regCmdResp(o, 'Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Result')
          .setDescription(util.inspect(res));
        return common.regCmdResp(o, { embeds: [richres] });
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Error')
          .setDescription(e.stack);
        return common.regCmdResp(o, { embeds: [richres] });
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.isDeveloper(o)) return common.slashCmdResp(o, true, 'dev only command');
      let cmd = args[0] ? args[0].value : '', res;
      nonlogmsg(`evaluating from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${util.inspect(cmd)}`);
      if (cmd == 'deez nuts' || cmd == 'goe mama') return common.slashCmdResp(o, true, 'no');
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        return await common.slashCmdResp(o, true, 'Result: ' + util.inspect(res));
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        return await common.slashCmdResp(o, true, 'Error: ' + e.stack);
      }
    },
  },
  {
    name: 'evalv',
    description_slash: 'evaluates void.',
    flags: 0b111100,
    options: [ { type: 'STRING', name: 'expression', description: 'the expression to evaluate' } ],
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      let cmd = o.argstring, res;
      nonlogmsg(`evaluating (output voided) from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating (output voided) from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
      } catch (e) {
        console.log('error in voided eval');
        console.debug(e.stack);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.isDeveloper(o)) return common.slashCmdResp(o, true, 'dev only command');
      let cmd = args[0] ? args[0].value : '', res;
      nonlogmsg(`evaluating from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${util.inspect(cmd)}`);
      if (cmd == 'deez nuts' || cmd == 'goe mama') return common.slashCmdResp(o, true, 'no');
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
      } catch (e) {
        console.log('error in voided eval');
        console.debug(e.stack);
      }
    },
  },
  {
    name: 'exec',
    description_slash: 'executes.',
    flags: 0b111100,
    options: [ { type: 'STRING', name: 'expression', description: 'the expression to evaluate' } ],
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      let cmd = o.argstring;
      nonlogmsg(`shell exec from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`shell exec from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`))) {
          return common.regCmdResp(o, 'Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      return new Promise((resolve, reject) => {
        let proc = cp.exec(cmd, { timeout: 20000, windowsHide: true }, (err, stdout, stderr) => {
          props.execCmdProcesses.splice(props.execCmdProcesses.indexOf(proc), 1);
          if (err) {
            console.log('error in shell exec');
            console.debug(err.stack);
            var richres = new Discord.MessageEmbed()
              .setTitle('Shell Command Error')
              .setDescription(err.stack);
            common.regCmdResp(o, { embeds: [richres] }).then(x => resolve(x)).catch(e => reject(e));
            return;
          }
          stdout = stdout.toString(); stderr = stderr.toString();
          console.debug(`shell command result\nstdout:\n${util.inspect(stdout)}\nstderr:\n${util.inspect(stderr)}`);
          var richres = new Discord.MessageEmbed()
            .setTitle('Shell Command Result')
            .setDescription(`*stdout*:\n${util.inspect(stdout)}\n*stderr*:\n${util.inspect(stderr)}`);
            common.regCmdResp(o, { embeds: [richres] }).then(x => resolve(x)).catch(e => reject(e));
        });
        props.execCmdProcesses.push(proc);
      });
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.isDeveloper(o)) return common.slashCmdResp(o, true, 'dev only command');
      let cmd = args[0] ? args[0].value : '';
      nonlogmsg(`shell exec from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${util.inspect(cmd)}`);
      
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 5, data: { flags: 64 } } });
      
      return new Promise((resolve, reject) => {
        try {
          let proc = cp.exec(cmd, { timeout: 20000, windowsHide: true }, (err, stdout, stderr) => {
            props.execCmdProcesses.splice(props.execCmdProcesses.indexOf(proc), 1);
            if (err) {
              console.log('error in shell exec');
              console.debug(err.stack);
              client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({ data: {
                content: 'Shell Command Error: ' + err.stack, flags: 64,
              } }).then(x => resolve(x)).catch(e => reject(e));
              return;
            }
            stdout = stdout.toString(); stderr = stderr.toString();
            console.debug(`shell command result\nstdout:\n${util.inspect(stdout)}\nstderr:\n${util.inspect(stderr)}`);
            client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({ data: {
              content: `Shell Command Result:\n*stdout*:\n${util.inspect(stdout)}\n*stderr*:\n${util.inspect(stderr)}`, flags: 64,
            } }).then(x => resolve(x)).catch(e => reject(e));
          });
          props.execCmdProcesses.push(proc);
        } catch (e) {
          client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({ data: { content: 'Error', flags: 64 } });
          reject(e);
        }
      });
    },
  },
  {
    name: 'crash',
    flags: 0b011100,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg)) return;
      common.regCmdResp(o, 'Crashing myself RIP');
      throw new Error('ERORRORORORO');
    },
  },
];
