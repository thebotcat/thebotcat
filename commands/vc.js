module.exports = [
  {
    name: 'join',
    description: '`!join [#channel]` for me to join a voice channel, defaulting to the one you\'re in',
    description_slash: 'for me to join a voice channel, defaulting to the one you\'re in',
    flags: 0b110110,
    options: [ { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the voice channel' } ],
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return common.regCmdResp(o, 'Voice Channel features are disabled.');
      let guilddata = common.createAndGetGuilddata(msg.guild.id);
      let channel;
      if (rawArgs.length == 0) {
        if (!msg.member.voice.channelId) return common.regCmdResp(o, 'You are not in a voice channel.');
        channel = msg.guild.channels.cache.get(msg.member.voice.channelId);
      } else {
        if (!/^<#[0-9]+>$/.test(rawArgs[0])) return common.regCmdResp(o, 'Invalid channel mention.');
        channel = msg.guild.channels.cache.find(x => x.id == rawArgs[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'Cannot join channel outside of this guild.');
      }
      if (guilddata.voice.channel && guilddata.voice.channel.id == channel.id) return common.regCmdResp(o, `Already joined channel <#${channel.id}>`);
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
        return common.regCmdResp(o, 'You do not have permission to get me to join the voice channel.');
      if (msg.member.voice.channelId != channel.id && !remoteperms)
        return common.regCmdResp(o, 'You do not have permission to get me to join channels remotely.');
      if (channel.full && !leaveperms)
        return common.regCmdResp(o, 'You do not have permission to get me to join full channels.');
      if (guilddata.voice.channel && !(guilddata.voice.channel.members.size <= 1 && guilddata.voice.songslist.length == 0) && !leaveperms) {
        return common.regCmdResp(o, 'You do not have permission to get me to leave other channels.');
      }
      try {
        await common.clientVCManager.join(guilddata.voice, channel);
        return common.regCmdResp(o, `Joined channel <#${channel.id}>`);
      } catch (e) {
        console.error(e);
        return common.regCmdResp(o, `Error in joining channel <#${channel.id}>`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(o, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel;
      if (!args[0]) {
        if (!o.member.voice.channelId) return common.slashCmdResp(o, false, 'You are not in a voice channel.');
        channel = o.guild.channels.cache.get(o.member.voice.channelId);
      } else {
        channel = o.guild.channels.cache.find(x => x.id == args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, false, 'Cannot join channel outside of this guild.');
      }
      if (guilddata.voice.channel && guilddata.voice.channel.id == channel.id) return common.slashCmdResp(o, false, `Already joined channel <#${channel.id}>`);
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel))
        return common.slashCmdResp(o, false, 'You do not have permission to get me to join the voice channel.');
      if (o.member.voice.channelId != channel.id && !remoteperms)
        return common.slashCmdResp(o, false, 'You do not have permission to get me to join channels remotely.');
      if (channel.full && !leaveperms)
        return common.slashCmdResp(o, false, 'You do not have permission to get me to join full channels.');
      if (guilddata.voice.channel && !(guilddata.voice.channel.members.size <= 1 && guilddata.voice.songslist.length == 0) && !leaveperms) {
        return common.slashCmdResp(o, false, 'You do not have permission to get me to leave other channels.');
      }
      try {
        await common.clientVCManager.join(guilddata.voice, channel);
        return common.slashCmdResp(o, false, `Joined channel <#${channel.id}>`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(o, false, `Error in joining channel <#${channel.id}>`);
      }
    },
  },
  {
    name: 'leave',
    description: '`!leave` for me to leave the voice channel I am in',
    description_slash: 'for me to leave the voice channel I am in',
    aliases: ['disconnect', 'dc', 'gtfo'],
    flags: 0b110110,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return common.regCmdResp(o, 'Voice Channel features are disabled.');
      let guilddata = common.createAndGetGuilddata(msg.guild.id);
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms || leaveperms) {
        if (!(joinperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && (guilddata.voice.songslist.length == 0 || msg.member.voice.channelId != channel.id))) {
          if (!leaveperms)
            return common.regCmdResp(o, 'You do not have permission to get me to leave the voice channel.');
          if (msg.member.voice.channelId != channel.id && !remoteperms)
            return common.regCmdResp(o, 'You do not have permission to get me to leave channels remotely.');
        }
        await common.clientVCManager.leave(guilddata.voice);
        return common.regCmdResp(o, `Left channel <#${channel.id}>`);
      } else {
        return common.regCmdResp(o, 'You do not have permission to get me to leave the voice channel.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(o, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms || leaveperms) {
        if (!(joinperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && (guilddata.voice.songslist.length == 0 || o.member.voice.channelId != channel.id))) {
          if (!leaveperms)
            return common.slashCmdResp(o, false, 'You do not have permission to get me to leave the voice channel.');
          if (o.member.voice.channelId != channel.id && !remoteperms)
            return common.slashCmdResp(o, false, 'You do not have permission to get me to leave channels remotely.');
        }
        await common.clientVCManager.leave(guilddata.voice);
        return common.slashCmdResp(o, false, `Left channel <#${channel.id}>`);
      } else {
        return common.slashCmdResp(o, false, 'You do not have permission to get me to leave the voice channel.');
      }
    },
  },
  {
    name: 'toggleselfmute',
    description: '`!toggleselfmute` for me to toggle my selfmute status',
    description_slash: 'for me to toggle my selfmute status',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return common.regCmdResp(o, 'Voice Channel features are disabled.');
      let guilddata = common.createAndGetGuilddata(msg.guild.id);
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (msg.member.voice.channelId != channel.id && !remoteperms)
          return common.regCmdResp(o, 'You do not have permission to get me to toggle my selfmute status remotely.');
        common.clientVCManager.toggleSelfMute(guilddata.voice);
        return common.regCmdResp(o, `Set self mute to ${common.clientVCManager.getSelfMute(guilddata.voice) ? 'enabled' : 'disabled'}`);
      } else {
        return common.regCmdResp(o, 'You do not have permission to get me to toggle my selfmute status.');
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(o, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (o.member.voice.channelId != channel.id && !remoteperms)
          return common.slashCmdResp(o, false, 'You do not have permission to get me to toggle my selfmute status remotely.');
        common.clientVCManager.toggleSelfMute(guilddata.voice);
        return common.slashCmdResp(o, false, `Set self mute to ${common.clientVCManager.getSelfMute(guilddata.voice) ? 'enabled' : 'disabled'}`);
      } else {
        return common.slashCmdResp(o, false, 'You do not have permission to get me to toggle my selfmute status.');
      }
    },
  },
  {
    name: 'toggleselfdeaf',
    description: '`!toggleselfdeaf` for me to toggle my selfdeafen status',
    description_slash: 'for me to toggle my selfdeafen status',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return common.regCmdResp(o, 'Voice Channel features are disabled.');
      let guilddata = common.createAndGetGuilddata(msg.guild.id);
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (msg.member.voice.channelId != channel.id && !remoteperms)
          return common.regCmdResp(o, 'You do not have permission to get me to toggle my selfdeafen status remotely.');
        common.clientVCManager.toggleSelfDeaf(guilddata.voice);
        return common.regCmdResp(o, `Set self deaf to ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? 'enabled' : 'disabled'}`);
      } else {
        return common.regCmdResp(o, 'You do not have permission to get me to toggle my selfdeafen status.');
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(o, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (o.member.voice.channelId != channel.id && !remoteperms)
          return common.slashCmdResp(o, false, 'You do not have permission to get me to toggle my selfdeafen status remotely.');
        common.clientVCManager.toggleSelfDeaf(guilddata.voice);
        return common.slashCmdResp(o, false, `Set self deaf to ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? 'enabled' : 'disabled'}`);
      } else {
        return common.slashCmdResp(o, false, 'You do not have permission to get me to toggle my selfdeafen status.');
      }
    },
  },
];
