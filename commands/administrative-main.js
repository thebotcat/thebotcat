module.exports = [
  {
    name: 'suppressembeds',
    description: '`!suppressembeds <\'suppress\'/\'unsuppress\'> <messageid> [#channel]` suppresses or unsuppresses embeds on a message',
    description_slash: 'suppresses or unsuppresses embeds on a message',
    flags: 0b110110,
    options: [
      {
        type: Discord.ApplicationCommandOptionType.String, name: 'value', description: 'to suppress or unsuppress embeds', required: true,
        choices: [ { name: 'suppress', value: 'suppress' }, { name: 'unsuppress', value: 'unsuppress' } ],
      },
      { type: Discord.ApplicationCommandOptionType.String, name: 'messageid', description: 'id of message or message link', required: true },
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'channel the message is in' },
    ],
    async execute(o, msg, rawArgs) {
      let suppress, match, channel, targetMsg;
      
      switch (rawArgs[0]) {
        case 'suppress': suppress = true; break;
        case 'unsuppress': suppress = false; break;
        default: return common.regCmdResp(o, 'Options are \'suppress\' and \'unsuppress\'').then(x => setTimeout(() => x.delete(), 5000));
      }
      
      if (match = /^([0-9]+)$/.exec(rawArgs[1])) {
        targetMsg = match[1];
        if (match = /^<#([0-9]+)>$/.exec(rawArgs[2])) channel = match[1];
      } else if (match = /^https:\/\/(?:canary.)?discord(?:app)?.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)$/.exec(rawArgs[1])) {
        channel = match[1];
        targetMsg = match[2];
      }
      
      channel = channel ? msg.guild.channels.cache.get(channel) : msg.channel;
      if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
        return common.regCmdResp(o, 'Cannot suppress embeds on message in channel outside of this guild.').then(x => setTimeout(() => x.delete(), 5000));
      
      try {
        targetMsg = await channel.messages.fetch(targetMsg);
      } catch (e) {
        return common.regCmdResp(o, 'Error in fetching message').then(x => setTimeout(() => x.delete(), 5000));
      }
      
      if (msg.author.id == targetMsg.author.id || common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        targetMsg.suppressEmbeds(suppress);
      else
        return common.regCmdResp(o, 'You do not have permission to suppress other member\'s embeds.').then(x => setTimeout(() => x.delete(), 5000));
      
      return common.regCmdResp(o, `Embeds in message https://discord.com/channels/${msg.guild.id}/${channel.id}/${targetMsg.id} in ${suppress ? 'suppressed' : 'unsuppressed'}.`);
    },
    async execute_slash(o, interaction, command, args) {
      let match, suppress, channel, targetMsg;
      
      switch (args[0].value) {
        case 'suppress': suppress = true; break;
        case 'unsuppress': suppress = false; break;
      }
      
      if (match = /^([0-9]+)$/.exec(args[1].value)) {
        targetMsg = match[1];
        if (args[2]) channel = args[2].value;
      } else if (match = /^https:\/\/(?:canary.)?discord(?:app)?.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)$/.exec(args[1].value)) {
        channel = match[1];
        targetMsg = match[2];
      }
      
      channel = channel ? o.guild.channels.cache.get(channel) : o.channel;
      if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
        return common.slashCmdResp(o, true, 'Cannot suppress embeds on message in channel outside of this guild.');
      
      try {
        targetMsg = await channel.messages.fetch(targetMsg);
      } catch (e) {
        return common.slashCmdResp(o, true, 'Error in fetching message');
      }
      
      if (o.author.id == targetMsg.author.id || common.hasBotPermissions(o, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        targetMsg.suppressEmbeds(suppress);
      else
        return common.slashCmdResp(o, true, 'You do not have permission to suppress other member\'s embeds.');
      
      return common.slashCmdResp(o, false, `Embeds in message https://discord.com/channels/${o.guild.id}/${channel.id}/${targetMsg.id} in ${suppress ? 'suppressed' : 'unsuppressed'}.`);
    },
  },
  {
    name: 'slowmode',
    description: '`!slowmode <seconds> [#channel]` sets the slowmode in a text channel',
    description_slash: 'sets slowmode in a text channel',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'slowmode', description: 'slowmode in seconds', required: true },
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel' },
    ],
    async execute(o, msg, rawArgs) {
      let seconds, channel;
      
      seconds = Math.floor(Number(rawArgs[0]));
      if (!Number.isSafeInteger(seconds) || seconds < 0) return common.regCmdResp(o, 'Invalid seconds for slowmode.');
      
      if (/^<#[0-9]+>$/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
          return common.regCmdResp(o, 'Cannot set slowmode in channel outside of this guild.');
      }
      if (!channel) channel = msg.channel;
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (channel.type == Discord.ChannelType.GuildText) {
        try {
          await channel.setRateLimitPerUser(seconds);
          return common.regCmdResp(o, `Slowmode in channel <#${channel.id}> set to ${seconds} seconds.`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nrate_limit_per_user: int value should be less than or equal to ')) {
            return common.regCmdResp(o, `Slowmode must be less than or equal to ${estring.slice(98).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.regCmdResp(o, `Error for setting slowmode in channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.regCmdResp(o, `Channel <#${channel.id}> not a text channel.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      let seconds, channel;
      
      seconds = Math.floor(args[0].value);
      if (!Number.isSafeInteger(seconds) || seconds < 0) return common.slashCmdResp(o, true, 'Invalid seconds for slowmode.');
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
          return common.slashCmdResp(o, true, 'Cannot set slowmode in channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (channel.type == Discord.ChannelType.GuildText) {
        try {
          await channel.setRateLimitPerUser(seconds);
          return common.slashCmdResp(o, false, `Slowmode in channel <#${channel.id}> set to ${seconds} seconds.`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nrate_limit_per_user: int value should be less than or equal to ')) {
            return common.slashCmdResp(o, true, `Slowmode must be less than or equal to ${estring.slice(98).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.slashCmdResp(o, true, `Error for setting slowmode in channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.slashCmdResp(o, true, `Channel <#${channel.id}> not a text channel.`);
      }
    },
  },
  {
    name: 'bitrate',
    description: '`!bitrate <bytespersec> #channel` sets the bitrate (bps not kbps) of a voice channel',
    description_slash: 'sets the bitrate of a voice channel',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'bitrate', description: 'bitrate in bytes per second', required: true },
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the voice channel', required: true },
    ],
    async execute(o, msg, rawArgs) {
      let bitrate, channel;
      
      bitrate = Math.floor(Number(rawArgs[0]));
      if (!Number.isSafeInteger(bitrate) || bitrate < 0) return common.regCmdResp(o, 'Invalid bitrate');
      
      if (/^<#[0-9]+>$/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'Cannot set bitrate of channel outside of this guild.');
      } else {
        return common.regCmdResp(o, 'Invalid channel mention.');
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (channel.type == Discord.ChannelType.GuildVoice) {
        try {
          await channel.setBitrate(bitrate);
          return common.regCmdResp(o, `Channel <#${channel.id}> bitrate set to ${bitrate}`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be greater than or equal to ')) {
            return common.regCmdResp(o, `Bitrate must be greater than or equal to ${estring.slice(89).replace(/[^0-9]+/g, '')}.`);
          } else if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be less than or equal to ')) {
            return common.regCmdResp(o, `Bitrate must be less than or equal to ${estring.slice(86).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.regCmdResp(o, `Error in setting bitrate of channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.regCmdResp(o, `Channel <#${channel.id}> not a voice channel`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      let bitrate, channel;
      
      bitrate = Math.floor(args[0].value);
      if (!Number.isSafeInteger(bitrate) || bitrate < 0) return common.slashCmdResp(o, true, 'Invalid bitrate');
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, true, 'Cannot set bitrate of channel outside of this guild.');
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (channel.type == Discord.ChannelType.GuildVoice) {
        try {
          await channel.setBitrate(bitrate);
          return common.slashCmdResp(o, false, `Channel <#${channel.id}> bitrate set to ${bitrate}`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be greater than or equal to ')) {
            return common.slashCmdResp(o, true, `Bitrate must be greater than or equal to ${estring.slice(89).replace(/[^0-9]+/g, '')}.`);
          } else if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be less than or equal to ')) {
            return common.slashCmdResp(o, true, `Bitrate must be less than or equal to ${estring.slice(86).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.slashCmdResp(o, true, `Error in setting bitrate of channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.slashCmdResp(o, true, `Channel <#${channel.id}> not a voice channel`);
      }
    },
  },
  {
    name: 'purge',
    description: '`!purge <amount> [#channel]` deletes `amount` messages from a channel',
    description_slash: 'deletes messages from a channel',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'amount', description: 'amount of messages to purge', required: true },
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel' },
    ],
    async execute(o, msg, rawArgs) {
      let msgs, channel;
      
      msgs = rawArgs[0] == 'all' ? -1 : Number(rawArgs[0]);
      if (!Number.isSafeInteger(msgs)) return common.regCmdResp(o, 'Invalid number of messages to delete');
      
      if (/^<#[0-9]+>$/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'Cannot purge messages in channel outside of this guild.');
      }
      if (!channel) channel = msg.channel;
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      try {
        await channel.bulkDelete(msgs);
        return common.regCmdResp(o, `${msgs} messages purged successfully.`);
      } catch (e) {
        return common.regCmdResp(o, 'Error in purging messages');
      }
    },
    async execute_slash(o, interaction, command, args) {
      let msgs = args[0].value, channel;
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, true, 'Cannot purge messages in channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      try {
        await channel.bulkDelete(msgs);
        return common.slashCmdResp(o, false, `${msgs} messages purged successfully.`);
      } catch (e) {
        return common.slashCmdResp(o, true, 'Error in purging messages');
      }
    },
  },
  {
    name: 'lock',
    description: '`!lock [#channel] [reason]` locks a channel, preventing anyone other than moderators from sending messages in it',
    description_slash: 'locks a channel, preventing anyone other than moderators from sending messages in it',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel' },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'the reason to lock' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      let channel, reason = [];
      
      for (var i = 0; i < rawArgs.length; i++) {
        if (i > 0 || !/^<#[0-9]+>$/.test(rawArgs[0])) {
          reason.push(rawArgs[i]);
        } else {
          channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
            return common.regCmdResp(o, 'Cannot lock channel outside of this guild.');
        }
      }
      
      reason = reason.join(' ');
      if (!channel) channel = msg.channel;
      
      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      if (!newperms.filter(x => x.id == msg.guild.id)) {
        newperms.push({
          id: msg.guild.id,
          type: Discord.ApplicationCommandOptionType.Role,
          allow: '0',
          deny: '0',
        });
      }
      let type = channel.type == Discord.ChannelType.GuildCategory ? 3n : channel.type == Discord.ChannelType.GuildText ? 1n : channel.type == Discord.ChannelType.GuildVoice ? 2n : 0n;
      let bits = Discord.PermissionsBitField.Flags.SendMessages * BigInt(type & 1n) | Discord.PermissionsBitField.Flags.Connect * BigInt(type & 2n);
      newperms.forEach(x => {
        if (!Object.keys(props.saved.guilds[msg.guild.id].perms).filter(y => y == x.id && props.saved.guilds[msg.guild.id].perms[y] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK)).length) {
          x.allow = String(BigInt(x.allow) & ~bits);
          x.deny = String(BigInt(x.deny) | bits);
        }
      });
      let newpermids = newperms.map(x => x.id);
      Object.keys(props.saved.guilds[msg.guild.id].perms).forEach(x => {
        if (props.saved.guilds[msg.guild.id].perms[x] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK) && !newpermids.includes(x))
          newperms.push({
            id: x,
            type: Discord.ApplicationCommandOptionType.Role,
            allow: bits,
            deny: 0n,
          });
      });
      
      if (!common.serializedPermissionsEqual(perms, newperms)) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, newperms);
          props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id] = perms;
          schedulePropsSave();
          return common.regCmdResp(o, `Locked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.regCmdResp(o, estring);
        }
      } else {
        return common.regCmdResp(o, `Channel <#${channel.id}> (id ${channel.id}) already locked or no permissions to change.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      let channel, reason = args[1] && args[1].value;
      
      if (args[0]) {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
          return common.slashCmdResp(o, true, 'Cannot lock channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      if (!newperms.filter(x => x.id == o.guild.id)) {
        newperms.push({
          id: o.guild.id,
          type: Discord.ApplicationCommandOptionType.Role,
          allow: 0n,
          deny: 0n,
        });
      }
      let type = channel.type == Discord.ChannelType.GuildCategory ? 3n : channel.type == Discord.ChannelType.GuildText ? 1n : channel.type == Discord.ChannelType.GuildVoice ? 2n : 0n;
      let bits = Discord.PermissionsBitField.Flags.SendMessages * BigInt(type & 1n) | Discord.PermissionsBitField.Flags.Connect * BigInt(type & 2n);
      newperms.forEach(x => {
        if (!Object.keys(props.saved.guilds[o.guild.id].perms).filter(y => y == x.id && props.saved.guilds[o.guild.id].perms[y] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK)).length) {
          x.allow &= ~bits;
          x.deny |= bits;
        }
      });
      let newpermids = newperms.map(x => x.id);
      Object.keys(props.saved.guilds[o.guild.id].perms).forEach(x => {
        if (props.saved.guilds[o.guild.id].perms[x] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK) && !newpermids.includes(x))
          newperms.push({
            id: x,
            type: Discord.ApplicationCommandOptionType.Role,
            allow: bits,
            deny: 0n,
          });
      });
      
      if (!common.serializedPermissionsEqual(perms, newperms)) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, newperms);
          props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id] = perms;
          schedulePropsSave();
          return common.slashCmdResp(o, false, `Locked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.slashCmdResp(o, true, estring);
        }
      } else {
        return common.slashCmdResp(o, false, `Channel <#${channel.id}> (id ${channel.id}) already locked or no permissions to change.`);
      }
    },
  },
  {
    name: 'unlock',
    description: '`!unlock [#channel] [reason]` unlocks a channel, resetting permissions to what they were before the lock',
    description_slash: 'unlocks a channel, resetting permissions to what they were before the lock',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel' },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'the reason to unlock' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      let channel, reason = [];
      
      for (var i = 0; i < rawArgs.length; i++) {
        if (i > 0 || !/^<#[0-9]+>$/.test(rawArgs[0])) {
          reason.push(rawArgs[i]);
        } else {
          channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
            return common.regCmdResp(o, 'Cannot unlock channel outside of this guild.');
        }
      }
      
      reason = reason.join(' ');
      if (!channel) channel = msg.channel;
      
      let perms = props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
      if (perms) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, perms);
          delete props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
          schedulePropsSave();
          return common.regCmdResp(o, `Unlocked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.regCmdResp(o, estring);
        }
      } else {
        return common.regCmdResp(o, `Channel <#${channel.id}> (id ${channel.id}) not locked.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      let channel, reason = args[1] && args[1].value;
      
      if (args[0]) {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
          return common.slashCmdResp(o, true, 'Cannot unlock channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      let perms = props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id];
      if (perms) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, perms);
          delete props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id];
          schedulePropsSave();
          return common.slashCmdResp(o, false, `Unlocked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.slashCmdResp(o, true, estring);
        }
      } else {
        return common.slashCmdResp(o, false, `Channel <#${channel.id}> (id ${channel.id}) not locked.`);
      }
    },
  },
  {
    name: 'mute',
    description: '`!mute @person [reason]` mutes someone by adding the muted role to them',
    description_slash: 'mutes someone by adding the muted role to them',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'the member to mute', required: true },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'the reason to mute' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.MUTE))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[msg.guild.id].mutedrole)
        return common.regCmdResp(o, 'Error: no guild muted role specified, set one with `!settings mutedrole set <@role|id|name|query>`');
      
      let member;
      try {
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return common.regCmdResp(o, 'Could not find member.');
      } catch (e) {
        return common.regCmdResp(o, 'Could not find member.');
      }
      
      let mutereason = rawArgs.slice(1).join(' ');
      
      if (!member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.add(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${mutereason ? ' ' + mutereason : ''}`);
        return common.regCmdResp(o, `Muted ${member.user.tag}.`);
      } else {
        return common.regCmdResp(o, `${member.user.tag} already muted.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.MUTE))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[o.guild.id].mutedrole)
        return common.slashCmdResp(o, true, 'Error: no guild muted role specified, set one with `!settings mutedrole set <@role|id|name|query>`');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(o, true, 'Could not find member.');
      } catch (e) {
        return common.slashCmdResp(o, true, 'Could not find member.');
      }
      
      let mutereason = args[1] && args[1].value;
      
      if (!member.roles.cache.get(props.saved.guilds[o.guild.id].mutedrole)) {
        await member.roles.add(props.saved.guilds[o.guild.id].mutedrole, `[By ${o.author.tag} (id ${o.author.id})]${mutereason ? ' ' + mutereason : ''}`);
        return common.slashCmdResp(o, false, `Muted ${member.user.tag}.`);
      } else {
        return common.slashCmdResp(o, false, `${member.user.tag} already muted.`);
      }
    },
  },
  {
    name: 'unmute',
    description: '`!unmute @person` unmutes someone by removing the muted role from them',
    description_slash: 'unmutes someone by removing the muted role from them',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'the member to unmute', required: true },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'the reason to unmute' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.MUTE))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[msg.guild.id].mutedrole)
        return common.regCmdResp(o, 'Error: no guild muted role specified, set one with `!settings mutedrole <@role|id|name|query>`');
      
      let member;
      try {
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return common.regCmdResp(o, 'Could not find member.');
      } catch (e) {
        return common.regCmdResp(o, 'Could not find member.');
      }
      
      let unmutereason = rawArgs.slice(1).join(' ');
      
      if (member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.remove(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${unmutereason ? ' ' + unmutereason : ''}`);
        return common.regCmdResp(o, `Unmuted ${member.user.tag}.`);
      } else {
        return common.regCmdResp(o, `${member.user.tag} not muted.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.MUTE))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[o.guild.id].mutedrole)
        return common.slashCmdResp(o, true, 'Error: no guild muted role specified, set one with `!settings mutedrole <@role|id|name|query>`');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(o, true, 'Could not find member.');
      } catch (e) {
        return common.slashCmdResp(o, true, 'Could not find member.');
      }
      
      let unmutereason = args[1] && args[1].value;
      
      if (member.roles.cache.get(props.saved.guilds[o.guild.id].mutedrole)) {
        await member.roles.remove(props.saved.guilds[o.guild.id].mutedrole, `[By ${o.author.tag} (id ${o.author.id})]${unmutereason ? ' ' + unmutereason : ''}`);
        return common.slashCmdResp(o, false, `Unmuted ${member.user.tag}.`);
      } else {
        return common.slashCmdResp(o, false, `${member.user.tag} not muted.`);
      }
    },
  },
  {
    name: 'kick',
    description: '`!kick @person [reason]` kicks someone from this guild',
    description_slash: 'kicks someone from this guild',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'the member to kick', required: true },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'optional kick reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.KICK))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!msg.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.KickMembers))
        return common.regCmdResp(o, 'Error: I do not have permission to kick members.');
      
      let member;
      try {
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return common.regCmdResp(o, 'Could not find member.');
      } catch (e) {
        console.error(e);
        return common.regCmdResp(o, 'Could not find member.');
      }
      
      if (msg.member.id != msg.guild.ownerId &&
        (member.id == msg.guild.ownerId || msg.member.roles.highest.position <= member.roles.highest.position))
        return common.regCmdResp(o, 'You cannot kick someone equal or higher than you in the role hierarchy.');
      
      if (msg.guild.members.me.id != msg.guild.ownerId &&
        (member.id == msg.guild.ownerId || msg.guild.members.me.roles.highest.position <= member.roles.highest.position))
        return common.regCmdResp(o, 'Error: I cannot kick someone equal or higher than me in the role hierarchy.');
      
      let kickreason = rawArgs.slice(1).join(' ');
      
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let kickconfirm = await common.regCmdResp(o, `Are you sure you want to kick user ${member.user.tag} (id ${member.id})${kickreason ? ' with reason ' + util.inspect(kickreason) : ''}?`);
          let kickreacts = kickconfirm.awaitReactions({
            filter: (react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id,
            time: 60000,
            max: 1,
          });
          await kickconfirm.react('✅'); await kickconfirm.react('❌');
          kickreacts = await kickreacts;
          if (kickreacts.size == 0 || kickreacts.firstKey() == '❌')
            return kickconfirm.edit(kickconfirm.content + '\nKick cancelled.');
          
          await member.kick(`[By ${msg.author.tag} (id ${msg.author.id})]${kickreason ? ' ' + kickreason : ''}`);
          return kickconfirm.edit(kickconfirm.content + `\n${member.user.tag} (id ${member.id}) has been successfully kicked`);
        } else {
          await member.kick(`[By ${msg.author.tag} (id ${msg.author.id})]${kickreason ? ' ' + kickreason : ''}`);
          return common.regCmdResp(o, `${member.user.tag} (id ${member.id}) has been successfully kicked`);
        }
      } catch (e) {
        console.error(e);
        return common.regCmdResp(o, 'Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.KICK))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (!o.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.KickMembers))
        return common.slashCmdResp(o, true, 'Error: I do not have permission to kick members.');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(o, true, 'Could not find member.');
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(o, true, 'Could not find member.');
      }
      
      if (o.member.id != o.guild.ownerId &&
        (member.id == o.guild.ownerId || o.member.roles.highest.position <= member.roles.highest.position))
        return common.slashCmdResp(o, true, 'You cannot kick someone equal or higher than you in the role hierarchy.');
      
      if (o.guild.members.me.id != o.guild.ownerId &&
        (member.id == o.guild.ownerId || o.guild.members.me.roles.highest.position <= member.roles.highest.position))
        return common.slashCmdResp(o, true, 'Error: I cannot kick someone equal or higher than me in the role hierarchy.');
      
      let kickreason = args[1] && args[1].value;
      
      try {
        await member.kick(`[By ${o.author.tag} (id ${o.author.id})]${kickreason ? ' ' + kickreason : ''}`);
        return common.slashCmdResp(o, false, `${member.user.tag} (id ${member.id}) has been successfully kicked`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(o, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'ban',
    description: '`!ban @person [reason]` bans someone from this guild',
    description_slash: 'bans someone from this guild',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'the member to ban', required: true },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'optional ban reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!msg.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
        return common.regCmdResp(o, 'Error: I do not have permission to ban members.');
      
      let user = await common.searchMember(msg.guild.members, rawArgs[0]);
      if (!user) {
        user = await common.searchUser(rawArgs[0]);
        if (!user) return common.regCmdResp(o, 'Could not find member.');
      }
      
      let banreason = rawArgs.slice(1).join(' ');
      
      if (user instanceof Discord.GuildMember) {
        if (msg.member.id != msg.guild.ownerId &&
          (user.id == msg.guild.ownerId || msg.member.roles.highest.position <= user.roles.highest.position))
          return common.regCmdResp(o, 'You cannot ban someone equal or higher than you in the role hierarchy.');
        
        if (msg.guild.members.me.id != msg.guild.ownerId &&
          (user.id == msg.guild.ownerId || msg.guild.members.me.roles.highest.position <= user.roles.highest.position))
          return common.regCmdResp(o, 'Error: I cannot ban someone equal or higher than me in the role hierarchy.');
        
        user = user.user;
      }
        
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let banconfirm = await common.regCmdResp(o, `Are you sure you want to ban user ${user.tag} (id ${user.id})${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`);
          let banreacts = banconfirm.awaitReactions({
            filter: (react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id,
            time: 60000,
            max: 1,
          });
          await banconfirm.react('✅'); await banconfirm.react('❌');
          banreacts = await banreacts;
          if (banreacts.size == 0 || banreacts.firstKey() == '❌')
            return banconfirm.edit(banconfirm.content + '\nBan cancelled.');
          
          await msg.guild.members.ban(user, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return banconfirm.edit(banconfirm.content + `\n${user.tag} (id ${user.id}) has been successfully banned`);
        } else {
          await msg.guild.members.ban(user, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return common.regCmdResp(o, `${user.tag} (id ${user.id}) has been successfully banned`);
        }
      } catch (e) {
        console.error(e);
        return common.regCmdResp(o, 'Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.BAN))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (!o.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
        return common.slashCmdResp(o, true, 'Error: I do not have permission to ban members.');
      
      let user = await o.guild.members.fetch(args[0].value);
      if (!user) {
        user = await client.users.fetch(args[0].value);
        if (!user) return common.slashCmdResp(o, true, 'Could not find member.');
      }
      
      let banreason = args[1] && args[1].value;
      
      if (user instanceof Discord.GuildMember) {
        if (o.member.id != o.guild.ownerId &&
          (user.id == o.guild.ownerId || o.member.roles.highest.position <= user.roles.highest.position))
          return common.slashCmdResp(o, true, 'You cannot ban someone equal or higher than you in the role hierarchy.');
        
        if (o.guild.members.me.id != o.guild.ownerId &&
          (user.id == o.guild.ownerId || o.guild.members.me.roles.highest.position <= user.roles.highest.position))
          return common.slashCmdResp(o, true, 'Error: I cannot ban someone equal or higher than me in the role hierarchy.');
        
        user = user.user;
      }
      
      try {
        await o.guild.members.ban(user, { reason: `[By ${o.author.tag} (id ${o.author.id})]${banreason ? ' ' + banreason : ''}` });
        return common.slashCmdResp(o, false, `${user.tag} (id ${user.id}) has been successfully banned`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(o, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'unban',
    description: '`!unban <userid> [reason]` unbans someone from this guild',
    description_slash: 'unbans someone from this guild',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'the member to unban', required: true },
      { type: Discord.ApplicationCommandOptionType.String, name: 'reason', description: 'optional unban reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!msg.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
        return common.regCmdResp(o, 'Error: I do not have permission to unban members.');
      
      let userId;
      if (rawArgs[0]) {
        if (/^(?:<@!?[0-9]+>|[0-9]+)$/.test(rawArgs[0]))
          userId = rawArgs[0].replace(/[<@!>]/g, '');
      }
      if (!userId) return common.regCmdResp(o, 'Could not find user.');
      
      let banInfo;
      try {
        banInfo = await msg.guild.bans.fetch(userId);
        if (!banInfo) return common.regCmdResp(o, 'User not banned or nonexistent.');
      } catch (e) {
        return common.regCmdResp(o, 'User not banned or nonexistent.');
      }
      
      let unbanreason = rawArgs.slice(1).join(' ');
      
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let unbanconfirm = await common.regCmdResp(o, `Are you sure you want to unban user ${banInfo.user.tag} (id ${banInfo.user.id})${unbanreason ? ' with reason ' + util.inspect(unbanreason) : ''}?`);
          let unbanreacts = unbanconfirm.awaitReactions({
            filter: (react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id,
            time: 60000,
            max: 1,
          });
          await unbanconfirm.react('✅');
          await unbanconfirm.react('❌');
          unbanreacts = await unbanreacts;
          if (unbanreacts.size == 0 || unbanreacts.firstKey() == '❌')
            return unbanconfirm.edit(unbanconfirm.content + '\nUnban cancelled.');
          
          await msg.guild.members.unban(userId, `[By ${msg.author.tag} (id ${msg.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
          return unbanconfirm.edit(unbanconfirm.content + `\n${banInfo.user.tag} (id ${banInfo.user.id}) has been successfully unbanned`);
        } else {
          await msg.guild.members.unban(userId, `[By ${msg.author.tag} (id ${msg.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
          return common.regCmdResp(o, `${banInfo.user.tag} (id ${banInfo.user.id}) has been successfully unbanned`);
        }
      } catch (e) {
        return common.regCmdResp(o, 'Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.BAN))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      if (!o.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
        return common.slashCmdResp(o, true, 'Error: I do not have permission to unban members.');
      
      let userId = args[0] && args[0].value;
      
      let banInfo;
      try {
        banInfo = await o.guild.bans.fetch(userId);
        if (!banInfo) return common.slashCmdResp(o, true, 'User not banned or nonexistent.');
      } catch (e) {
        return common.slashCmdResp(o, true, 'User not banned or nonexistent.');
      }
      
      let unbanreason = args[1] && args[1].value;
      
      try {
        await o.guild.members.unban(userId, `[By ${o.author.tag} (id ${o.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
        return common.slashCmdResp(o, false, `${banInfo.user.tag} (id ${banInfo.user.id}) has been successfully unbanned`);
      } catch (e) {
        return common.slashCmdResp(o, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'emoterole',
    description: 'configures which roles can use which emoji (API broken: view says none, remove is reset)\n' +
      '`!emoterole view <emote|id|name>` views roles which can use an emoji\n' +
      '`!emoterole add <emote|id|name> [<@role|id|name>] ...` adds roles which can use an emoji\n' +
      '`!emoterole remove <emote|id|name> [<@role|id|name>] ...` removes roles which can use an emoji\n' +
      '`!emoterole set <emote|id|name> [<@role|id|name>] ...` sets roles which can use an emoji',
    description_slash: 'configures which roles can use which emoji (API broken: view says none, add is set, remove is reset)',
    flags: 0b110110,
    options: [
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'views roles which can use the emoji',
        options: [
          { type: Discord.ApplicationCommandOptionType.String, name: 'emote', description: 'emote, id, or search query', required: true },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'add', description: 'adds roles which can use the emoji',
        options: [
          { type: Discord.ApplicationCommandOptionType.String, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: Discord.ApplicationCommandOptionType.String, name: 'roles', description: 'roles to add' },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'remove', description: 'removes roles which can use the emoji',
        options: [
          { type: Discord.ApplicationCommandOptionType.String, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: Discord.ApplicationCommandOptionType.String, name: 'roles', description: 'roles to remove' },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'set', description: 'sets roles which can use the emoji',
        options: [
          { type: Discord.ApplicationCommandOptionType.String, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: Discord.ApplicationCommandOptionType.String, name: 'roles', description: 'roles to set' },
        ],
      },
    ],
    execute(o, msg, rawArgs) {
      if (!msg.member.permissions.has(Discord.PermissionsBitField.Flags.ManageEmojisAndStickers))
        return common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (!rawArgs.length)
        return common.regCmdResp(o, 'No parameters, run `?help emoterole` for parameters');
      
      if (!['view', 'add', 'remove', 'set'].includes(rawArgs[0]))
        return common.regCmdResp(o, 'Invalid option, run `?help emoterole` for parameters');
      
      if (rawArgs.length < 2)
        return common.regCmdResp(o, 'Emoji not specified, run `?help emoterole` for parameters');
      
      let emote;
      if (/^<a?:[A-Za-z]+:[0-9]+>$/.test(rawArgs[1])) {
        let end = rawArgs[1].split(':')[2];
        emote = msg.guild.emojis.resolve(end.slice(0, -1));
      } else if (/^[0-9]+$/.test(rawArgs[1])) {
        emote = msg.guild.emojis.resolve(rawArgs[1]);
      } else {
        emote = msg.guild.emojis.cache.find(x => x.name == rawArgs[1]);
      }
      if (emote == null) return common.regCmdResp(o, 'Error: couldn\'t fetch emote.');
      
      let roles = rawArgs.slice(2).map(x => common.searchRole(msg.guild.roles, x)).filter(x => x);
      
      switch (rawArgs[0]) {
        case 'view': {
          let origRoles = emote.roles.cache.map(x => `<@&${x.id}>`);
          return common.regCmdResp(o, { embeds: [{ title: 'Emote Roles', description: `<:${emote.name}:${emote.id}> emote roles: ${origRoles.length ? origRoles.join(' ') : 'None'}` }] });
        }
        case 'add':
          emote.roles.add(roles);
          return common.regCmdResp(o, { embeds: [{ title: 'Roles Added', description: `${roles.length ? 'Roles ' + roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'} added to <:${emote.name}:${emote.id}> emote` }] });
        case 'remove':
          emote.roles.remove(roles);
          return common.regCmdResp(o, { embeds: [{ title: 'Roles Removed', description: `${roles.length ? 'Roles ' + roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'} removed from <:${emote.name}:${emote.id}> emote` }] });
        case 'set':
          emote.roles.set(roles);
          return common.regCmdResp(o, { embeds: [{ title: 'Roles Set', description: `<:${emote.name}:${emote.id}> emote roles set to ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'}` }] });
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!o.member.permissions.has(Discord.PermissionsBitField.Flags.ManageEmojisAndStickers))
        return common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      let emote;
      if (/^<a?:[A-Za-z]+:[0-9]+>$/.test(args[0].options[0].value)) {
        let end = args[0].options[0].value.split(':')[2];
        emote = o.guild.emojis.resolve(end.slice(0, -1));
      } else if (/^[0-9]+$/.test(args[0].options[0].value)) {
        emote = o.guild.emojis.resolve(args[0].options[0].value);
      } else {
        emote = o.guild.emojis.cache.find(x => x.name == args[0].options[0].value);
      }
      if (emote == null) return common.slashCmdResp(o, true, 'Error: couldn\'t fetch emote.');
      
      let roles = args[0].options[1] ? args[0].options[1].value.split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x) : [];
      
      switch (args[0].name) {
        case 'view': {
          let origRoles = emote.roles.cache.map(x => `<@&${x.id}>`);
          return common.slashCmdResp(o, true, `<:${emote.name}:${emote.id}> emote roles: ${origRoles.length ? origRoles.join(' ') : 'None'}`);
        }
        case 'add':
          emote.roles.add(roles);
          return common.slashCmdResp(o, false, `${roles.length ? 'Roles ' + roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'} added to <:${emote.name}:${emote.id}> emote`);
        case 'remove':
          emote.roles.remove(roles);
          return common.slashCmdResp(o, false, `${roles.length ? 'Roles ' + roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'} removed from <:${emote.name}:${emote.id}> emote`);
        case 'set':
          emote.roles.set(roles);
          return common.slashCmdResp(o, false, `<:${emote.name}:${emote.id}> emote roles set to ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'No Roles'}`);
      }
    },
  },
];
