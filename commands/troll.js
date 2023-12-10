module.exports = [
  {
    name: '@_everyone',
    description: '`!@_everyone members [hidden]` pings everyone ... the manual way\n`!@_everyone roles [hidden]` pings all roles instead',
    flags: 0b010100,
    execute(o, msg, rawArgs) {
      if (!persData.special_guilds_set.has(msg.guild.id)) return;
      if (!common.isAdmin(msg)) return;
      
      let doRoles, hidden = Boolean(rawArgs[1]);
      
      if (rawArgs[0] == 'members')
        doRoles = false;
      else if (rawArgs[0] == 'roles')
        doRoles = true;
      else
        return common.regCmdResp(o, 'Error: argument must be either members or roles.');
      
      if (!doRoles && msg.guild.memberCount > 1000)
        return common.regCmdResp(o, 'Error: too many members in guild to ping all members.');
      
      let promises = [];
      if (hidden) {
        promises.push(
          common.regCmdResp(o, '@ everyone')
            .then(x => x.edit({ content: '@everyone', allowedMentions: { parse: ['everyone'] } }))
        );
      }
      
      let step = doRoles ? 90 : 95;
      
      let entries = Array.from(msg.guild[doRoles ? 'roles' : 'members'].cache.values());
      if (doRoles) entries = entries.map(x => `<@&${x.id}>`);
      else entries = entries.filter(x => !x.user.bot).map(x => `<@${x.id}>`);
      
      for (var i = 0; i < entries.length; i += step) {
        let promise = msg.channel.send({
          content: entries.slice(i, i + step).join(''),
          allowedMentions: { parse: [doRoles ? 'roles' : 'users'] },
        });
        if (hidden) promise = promise.then(x => x.delete());
        promises.push(promise);
      }
      
      return Promise.allSettled(promises);
    },
  },
  {
    name: '@someone',
    description: '`!@someone` pings a random person on the server',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(common.isAdmin(msg) || msg.guild.id == persData.ids.guild.v0)) return;
      let members = Array.from(msg.guild.members.cache.values()).filter(x => !x.user.bot);
      let random_member = members[common.randInt(0, members.length)];
      return msg.channel.send({ content: `Random ping: <@!${random_member.user.id}>`, allowedMentions: { parse: ['users'] } });
    },
  },
  {
    name: 'ghostdot',
    description: '`!ghostdot #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot all` to send a message then immediately delete it in every channel in a guild',
    description_slash: 'sends a message then deletes it in a certain channel or channels',
    flags: 0b110100,
    options: [
      {
        type: Discord.ApplicationCommandOptionType.Subcommand,
        name: 'all',
        description: 'ghostdots every channel',
        options: [
          { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to false' }
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.Subcommand,
        name: 'one',
        description: 'ghostdots one channel',
        options: [
          { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel', required: true },
          { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to false' },
        ],
      },
    ],
    async execute(o, msg, rawArgs) {
      if (!persData.special_guilds_set.has(msg.guild.id)) return;
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return;
      if (rawArgs.length == 0) {
        return msg.channel.send(o.cmd.description);
      } else if (rawArgs.length == 1 && rawArgs[0] == 'all') {
        if (persData.special_guilds_set.has(msg.guild.id)) nonlogmsg(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = Array.from(msg.guild.channels.cache.values()), message;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == Discord.ChannelType.GuildText || channels[i].type == Discord.ChannelType.GuildAnnouncement)) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        if (persData.special_guilds_set.has(msg.guild.id)) nonlogmsg(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${rawArgs.join(' ')}`);
        for (let i = 0; i < rawArgs.length; i++) {
          if (/<#[0-9]+>/g.test(rawArgs[i])) {
            channel = msg.guild.channels.cache.get(rawArgs[i].slice(2, rawArgs[0].length - 1));
            if (channel && (channel.type == Discord.ChannelType.GuildText || channel.type == Discord.ChannelType.GuildAnnouncement)) {
              message = await channel.send('ghostdot');
              try { await message.delete(); } catch (e) { }
              await new Promise(r => setTimeout(r), 400);
            }
          }
        }
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!persData.special_guilds_set.has(o.guild.id)) return;
      if (!(common.isDeveloper(o) || common.isOwner(o) || common.isAdmin(o)))
        return;
      
      switch (args[0].name) {
        case 'all': {
          if (persData.special_guilds_set.has(o.guild.id)) nonlogmsg(`ghostdot from ${o.author.tag} in ${o.guild ? o.guild.name + ':' + o.channel.name : 'dms'}: all`);
          await common.slashCmdResp(o, args[0].options[0] ? args[0].options[0].value : false, 'ghostdot');
          let channels = Array.from(o.guild.channels.cache.values()), message;
          for (let i = 0; i < channels.length; i++) {
            if (channels[i] && (channels[i].type == Discord.ChannelType.GuildText || channels[i].type == Discord.ChannelType.GuildAnnouncement)) {
              message = await channels[i].send('ghostdot');
              try { await message.delete(); } catch (e) { }
              await new Promise(r => setTimeout(r), 400);
            }
          }
          break;
        }
        
        case 'one': {
          if (persData.special_guilds_set.has(o.guild.id)) nonlogmsg(`ghostdot from ${o.author.tag} in ${o.guild ? o.guild.name + ':' + o.channel.name : 'dms'}: ${args[0].options[0].value}`);
          await common.slashCmdResp(o, args[0].options[1] ? args[0].options[1].value : false, 'ghostdot');
          channel = o.guild.channels.cache.get(args[0].options[0].value);
          if (channel && (channel.type == Discord.ChannelType.GuildText || channel.type == Discord.ChannelType.GuildAnnouncement)) {
            message = await channel.send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
          break;
        }
      }
    }
  },
  {
    name: 'ghostdot_delmsg',
    description: '`!ghostdot_delmsg` to send a message then delete it in this channel\n`!ghostdot_delmsg #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot_delmsg all` to send a message then immediately delete it in every channel in a guild',
    flags: 0b010100,
    async execute(o, msg, rawArgs) {
      if (!persData.special_guilds_set.has(msg.guild.id)) return;
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return;
      msg.delete();
      if (rawArgs.length == 1 && rawArgs[0] == 'all') {
        if (persData.special_guilds_set.has(msg.guild.id)) nonlogmsg(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = Array.from(msg.guild.channels.cache.values()), message;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == Discord.ChannelType.GuildText || channels[i].type == Discord.ChannelType.GuildAnnouncement)) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        if (persData.special_guilds_set.has(msg.guild.id)) nonlogmsg(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${rawArgs.join(' ')}`);
        for (let i = 0; i < rawArgs.length; i++) {
          if (/<#[0-9]+>/g.test(rawArgs[i])) {
            channel = msg.guild.channels.cache.get(rawArgs[i].slice(2, rawArgs[0].length - 1));
            if (channel && (channel.type == Discord.ChannelType.GuildText || channel.type == Discord.ChannelType.GuildAnnouncement)) {
              message = await channel.send('ghostdot');
              try { await message.delete(); } catch (e) { }
              await new Promise(r => setTimeout(r), 400);
            }
          }
        }
      }
    },
  },
];
