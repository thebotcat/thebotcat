module.exports = [
  {
    name: 'play',
    description: '`!play <url> [#channel]` plays the audio of a YouTube URL, like every other music bot in existence, channel is channel to join',
    description_slash: 'plays the audio of a YouTube URL, like every other music bot in existence',
    flags: 0b110110,
    options: [
      { type: 3, name: 'url', description: 'the URL of the YouTube video to play the audio of', required: true },
      { type: 7, name: 'channel', description: 'the voice channel' },
    ],
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }

      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) {
        if (!(props.saved.feat.audio & 1)) return common.regCmdResp(o, 'Voice Channel features are disabled.');
        let channel;
        if (rawArgs[1] == null) {
          if (!msg.member.voice.channelId) return common.regCmdResp(o, 'You are not in a voice channel.');
          channel = msg.guild.channels.cache.get(msg.member.voice.channelId);
        } else {
          if (!/<#[0-9]+>/.test(rawArgs[1])) return common.regCmdResp(o, 'Invalid channel mention.');
          channel = msg.guild.channels.cache.find(x => x.id == rawArgs[1].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'Cannot join channel outside of this guild.');
        }
        let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
        let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
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
          msg.channel.send(`Joined channel <#${channel.id}>`);
        } catch (e) {
          console.error(e);
          return common.regCmdResp(o, `Error in joining channel <#${channel.id}>`);
        }
      }

      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && playperms))
        return common.regCmdResp(o, 'You must be in the same voice channel as I\'m in to play a song. Admins and mods can bypass this though.');
      let latestObj = await common.clientVCManager.addSong(guilddata.voice, rawArgs[0], msg.author.id);
      let text = `[${latestObj.desc}](<${latestObj.url}>) (${common.msecToHMS(Number(latestObj.expectedLength))}) added to queue`;
      await common.regCmdResp(o, text);
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }

      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) {
        if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(o, false, 'Voice Channel features are disabled.');
        let channel;
        if (!args[1]) {
          if (!o.member.voice.channelId) return common.slashCmdResp(o, false, 'You are not in a voice channel.');
          channel = o.guild.channels.cache.get(o.member.voice.channelId);
        } else {
          channel = o.guild.channels.cache.find(x => x.id == args[1].value);
          if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'Cannot join channel outside of this guild.');
        }
        let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
        let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
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
          common.slashCmdResp(o, false, `Joined channel <#${channel.id}>`);
        } catch (e) {
          console.error(e);
          return common.slashCmdResp(o, false, `Error in joining channel <#${channel.id}>`);
        }
      }
      
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && playperms))
        return common.slashCmdResp(o, false, 'You must be in the same voice channel as I\'m in to play a song. Admins and mods can bypass this though.');
      let latestObj = await common.clientVCManager.addSong(guilddata.voice, args[0].value, o.author.id);
      let text = `[${latestObj.desc}](<${latestObj.url}>) (${common.msecToHMS(Number(latestObj.expectedLength))}) added to queue`;
      common.slashCmdResp(o, false, text);
      return common.clientVCManager.startMainLoop(guilddata.voice, o.channel);
    },
  },
  {
    name: 'pause',
    description: '`!pause` pauses the currently playing song',
    description_slash: 'pauses the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.regCmdResp(o, 'Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return common.regCmdResp(o, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return common.regCmdResp(o, 'Paused');
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.slashCmdResp(o, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(o, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return common.slashCmdResp(o, false, 'Paused');
    },
  },
  {
    name: 'resume',
    description: '`!resume` resumes the currently paused song',
    description_slash: 'resumes the currently paused song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.regCmdResp(o, 'Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return common.regCmdResp(o, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return common.regCmdResp(o, 'Resumed');
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.slashCmdResp(o, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(o, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return common.slashCmdResp(o, false, 'Resumed');
    },
  },
  {
    name: 'volume',
    description: '`!volume <float>` sets my volume in a vc, with 1 being the normal volume',
    description_slash: 'sets my volume in a vc, with 1 being the normal volume',
    flags: 0b110110,
    options: [ { type: 3, name: 'volume', description: 'the volume' } ],
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (rawArgs.length == 0) {
        return common.regCmdResp(o, `Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
        let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        let vcmembers = Array.from(channel.members.keys());
        if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
          return common.regCmdResp(o, 'Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(rawArgs[0]);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 10)
          return common.regCmdResp(o, 'Volume out of bounds or not specified.');
        common.clientVCManager.setVolume(guilddata.voice, wantedvolume);
        return common.regCmdResp(o, `Set playback volume to ${wantedvolume}`);
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!args[0]) {
        return common.slashCmdResp(o, false, `Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
        let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        let vcmembers = Array.from(channel.members.keys());
        if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
          return common.slashCmdResp(o, false, 'Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(args[0].value);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 10)
          return common.slashCmdResp(o, false, 'Volume out of bounds or not specified.');
        common.clientVCManager.setVolume(guilddata.voice, wantedvolume);
        return common.slashCmdResp(o, false, `Set playback volume to ${wantedvolume}`);
      }
    },
  },
  {
    name: 'loop',
    description: '`!loop` toggles whether the currently playing song will loop',
    description_slash: 'toggles whether the currently playing song will loop',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return common.regCmdResp(o, 'Only admins and mods can toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return common.regCmdResp(o, `Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(o, false, 'Only admins and mods can toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return common.slashCmdResp(o, false, `Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'loopqueue',
    description: '`!loopqueue` toggles whether the queue will loop (when a song finishes playing its added to the end of the queue)',
    description_slash: 'toggles whether the queue will loop (when a song finishes playing its added to the end of the queue)',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return common.regCmdResp(o, 'Only admins and mods can toggle queue loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleQueueLoop(guilddata.voice);
      return common.regCmdResp(o, `Toggled queue loop to ${guilddata.voice.loopqueue ? 'enabled' : 'disabled'}`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(o, false, 'Only admins and mods can toggle queue loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleQueueLoop(guilddata.voice);
      return common.slashCmdResp(o, false, `Toggled queue loop to ${guilddata.voice.loopqueue ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'voteskip',
    description: '`!voteskip` toggles the vote to skip the currently playing song (if 50% or over votes, it will be skipped)',
    description_slash: 'toggles the vote to skip the currently playing song (if 50% or over votes, it will be skipped)',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.regCmdResp(o, 'Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.VOTESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, vsperms = common.constants.botRolePermBits.VOTESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (vsperms || playperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && msg.member.voice.channelId == channel.id)))
        return common.regCmdResp(o, 'You lack permission to voteskip.');
      switch (common.clientVCManager.voteSkip(guilddata.voice, msg.author.id)) {
        case 1: return common.regCmdResp(o, 'Skipped');
        case 2: return common.regCmdResp(o, 'Voted');
        case 3: return common.regCmdResp(o, 'Unvoted');
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.slashCmdResp(o, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.VOTESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, vsperms = common.constants.botRolePermBits.VOTESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (vsperms || playperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && o.member.voice.channelId == channel.id)))
        return common.slashCmdResp(o, false, 'You lack permission to voteskip.');
      switch (common.clientVCManager.voteSkip(guilddata.voice, o.author.id)) {
        case 1: return common.slashCmdResp(o, false, 'Skipped');
        case 2: return common.slashCmdResp(o, false, 'Voted');
        case 3: return common.slashCmdResp(o, false, 'Unvoted');
      }
    },
  },
  {
    name: 'forceskip',
    description: '`!forceskip` skips the currently playing song',
    description_slash: 'skips the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.regCmdResp(o, 'Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || playperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && msg.member.voice.channelId == channel.id)))
        return common.regCmdResp(o, 'Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return common.regCmdResp(o, 'Skipped');
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.slashCmdResp(o, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || playperms && Array.from(channel.members.values()).filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && o.member.voice.channelId == channel.id)))
        return common.slashCmdResp(o, false, 'Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return common.slashCmdResp(o, false, 'Skipped');
    },
  },
  {
    name: 'stop',
    description: '`!stop` clears the song list and stops playing',
    description_slash: 'clears the song list and stops playing',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.regCmdResp(o, 'Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((msg.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return common.regCmdResp(o, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return common.regCmdResp(o, 'Stopped');
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.resource) return common.slashCmdResp(o, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = Array.from(channel.members.keys());
      if (!((o.member.voice.channelId == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(o, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return common.slashCmdResp(o, false, 'Stopped');
    },
  },
  {
    name: 'songslist',
    description: '`!songslist` lists the currently playing song and the next songs',
    description_slash: 'lists the currently playing song and the next songs',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.resource ? `Time: ${songslist.length ? common.formatPlaybackBar(common.clientVCManager.getCurrentTrackTime(guilddata.voice) / common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '---'} (${common.msecToHMS(common.clientVCManager.getCurrentTrackTime(guilddata.voice))} / ${songslist.length ? common.msecToHMS(common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Queue${songslist.length > 1 ? ':\n' + songslist.slice(1).map((x, i) => (i + 1) + '. ' + x.desc + ' (' + common.msecToHMS(x.expectedLength) + (x.userid ? ', requested by ' + (msg.guild.members.cache.get(x.userid) ? msg.guild.members.cache.get(x.userid).user.tag : 'null') + ', id ' + x.userid : '') + ')').join('\n') : ' empty'}\n` +
        `Status: ${common.clientVCManager.getStatus(guilddata.voice)}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${common.clientVCManager.getSelfMute(guilddata.voice) ? '✅' : '❌'}, Self Deafened: ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? '✅' : '❌'}`;
      return common.regCmdResp(o, text);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (o.guild.members.cache.get(songslist[0].userid) ? o.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.resource ? `Time: ${songslist.length ? common.formatPlaybackBar(common.clientVCManager.getCurrentTrackTime(guilddata.voice) / common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '---'} (${common.msecToHMS(common.clientVCManager.getCurrentTrackTime(guilddata.voice))} / ${songslist.length ? common.msecToHMS(common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Queue${songslist.length > 1 ? ':\n' + songslist.slice(1).map((x, i) => (i + 1) + '. ' + x.desc + ' (' + common.msecToHMS(x.expectedLength) + (x.userid ? ', requested by ' + (o.guild.members.cache.get(x.userid) ? o.guild.members.cache.get(x.userid).user.tag : 'null') + ', id ' + x.userid : '') + ')').join('\n') : ' empty'}\n` +
        `Status: ${common.clientVCManager.getStatus(guilddata.voice)}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${common.clientVCManager.getSelfMute(guilddata.voice) ? '✅' : '❌'}, Self Deafened: ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? '✅' : '❌'}`;
      return common.slashCmdResp(o, false, text);
    },
  },
  {
    name: 'currentsong',
    description: '`!currentsong` prints the currently playing song',
    description_slash: 'prints the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return common.regCmdResp(o, 'Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return common.regCmdResp(o, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.resource ? `Time: ${songslist.length ? common.formatPlaybackBar(common.clientVCManager.getCurrentTrackTime(guilddata.voice) / common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '---'} (${common.msecToHMS(common.clientVCManager.getCurrentTrackTime(guilddata.voice))} / ${songslist.length ? common.msecToHMS(common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Status: ${common.clientVCManager.getStatus(guilddata.voice)}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${common.clientVCManager.getSelfMute(guilddata.voice) ? '✅' : '❌'}, Self Deafened: ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? '✅' : '❌'}`;
      return common.regCmdResp(o, text);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(o, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(o, false, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (o.guild.members.cache.get(songslist[0].userid) ? o.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.resource ? `Time: ${songslist.length ? common.formatPlaybackBar(common.clientVCManager.getCurrentTrackTime(guilddata.voice) / common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '---'} (${common.msecToHMS(common.clientVCManager.getCurrentTrackTime(guilddata.voice))} / ${songslist.length ? common.msecToHMS(common.clientVCManager.getFinishedTrackTime(guilddata.voice)) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Status: ${common.clientVCManager.getStatus(guilddata.voice)}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${common.clientVCManager.getSelfMute(guilddata.voice) ? '✅' : '❌'}, Self Deafened: ${common.clientVCManager.getSelfDeaf(guilddata.voice) ? '✅' : '❌'}`;
      return common.slashCmdResp(o, false, text);
    },
  },
];
