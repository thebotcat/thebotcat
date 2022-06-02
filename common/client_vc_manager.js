var GatewayOpcodes = require('discord-api-types/v10').GatewayOpcodes;

// object with utility functions to manage the joining of vcs and playing of songs
var clientVCManager = {
  // returns the inital state of a guild's voice state object
  getEmptyVoiceObject: function getEmptyVoiceObject() {
    return {
      channel: null,
      connection: null,
      player: null,
      resource: null,
      mainloop: 0,
      songslist: [],
      volume: null,
      loop: null,
      queueloop: null,
      voteskip: [],
    };
  },
  
  // all of these functions have self explanatory names, and the first parameter of each function is the guild's voice state object
  join: async function join(voice, channel) {
    if (voice.channel) clientVCManager.leave(voice);
    voice.channel = channel;
    try {
      voice.connection = DiscordVoice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false,
      });
    } catch (e) {
      voice.channel = null;
      throw e;
    }
    voice.player = DiscordVoice.createAudioPlayer();
    voice.connection.subscribe(voice.player);
    voice.volume = 1;
    voice.loop = false;
    voice.queueloop = false;
  },
  
  leave: function leave(voice) {
    try { if (voice.connection) voice.connection.destroy(); } catch (e) {}
    voice.channel = null;
    voice.connection = null;
    voice.player = null;
    voice.resource = null;
    voice.mainloop = 0;
    voice.songslist.length = 0;
    voice.volume = null;
    voice.loop = null;
    voice.queueloop = null;
    voice.voteskip.length = 0;
  },
  
  getSelfMute: function getSelfMute(voice) {
    return voice.channel.guild.me.voice.selfMute;
  },

  getSelfDeaf: function getSelfDeaf(voice) {
    return voice.channel.guild.me.voice.selfDeaf;
  },

  toggleSelfMute: function toggleSelfMute(voice) {
    // there appears to be no way to set this using guild.me.voice or VoiceConnection, so a raw api call has to be used
    props.saved.guilds.ryuhub.voice.connection.state.adapter.sendPayload({
      op: GatewayOpcodes.VoiceStateUpdate,
      d: {
        guild_id: voice.channel.guildId,
        channel_id: voice.channel.id,
        self_mute: !voice.channel.guild.me.voice.selfMute,
        self_deaf: voice.channel.guild.me.voice.selfDeaf,
      },
    });
  },
  
  toggleSelfDeaf: function toggleSelfDeaf(voice) {
    // there appears to be no way to set this using guild.me.voice or VoiceConnection, so a raw api call has to be used
    props.saved.guilds.ryuhub.voice.connection.state.adapter.sendPayload({
      op: GatewayOpcodes.VoiceStateUpdate,
      d: {
        guild_id: voice.channel.guildId,
        channel_id: voice.channel.id,
        self_mute: voice.channel.guild.me.voice.selfMute,
        self_deaf: !voice.channel.guild.me.voice.selfDeaf,
      },
    });
  },
  
  getVolume: function getVolume(voice) {
    return voice.volume;
  },
  
  setVolume: function setVolume(voice, wantedvolume) {
    if (voice.resource) voice.resource.volume.setVolume(wantedvolume);
    voice.volume = wantedvolume;
  },
  
  toggleLoop: function toggleLoop(voice) {
    voice.loop = !voice.loop;
  },
  
  toggleQueueLoop: function toggleQueueLoop(voice) {
    voice.queueloop = !voice.queueloop;
  },
  
  pause: function pause(voice) {
    voice.player.pause();
  },
  
  resume: function pause(voice) {
    voice.player.unpause();
  },
  
  addSong: async function addSong(voice, url, userid) {
    if (!/^https?:\/\/(?:www.)?youtube.com\/[A-Za-z0-9?&=\-_%.]+$/.test(url)) throw new common.BotError('Invalid URL Format');
    let info;
    try {
      info = await ytdl.getBasicInfo(url);
    } catch (e) {
      throw new common.BotError('Invalid URL');
    }
    let latestObj = {
      url: url,
      desc: `${info.videoDetails.title} by ${info.videoDetails.author.name}`,
      expectedLength: info.videoDetails.lengthSeconds * 1000,
      stream: null,
      userid: common.isId(userid) ? userid : null,
    };
    voice.songslist.push(latestObj);
    return latestObj;
  },
  
  voteSkip: function (voice, userid) {
    var voiceIndex = voice.voteskip.indexOf(userid);
    if (voiceIndex > -1) voice.voteskip.splice(voiceIndex, 1);
    else voice.voteskip.push(userid);
    let voiceMembers = new Set(Array.from(voice.channel.members.values()).filter(x => !x.user.bot).map(x => x.id));
    if (voice.mainloop && voice.voteskip.filter(x => voiceMembers.has(x)).length / voiceMembers.size >= 0.5) {
      voice.mainloop = 2;
      return 1;
    } else return voiceIndex > -1 ? 3 : 2;
  },
  
  forceSkip: function (voice) {
    if (voice.mainloop) voice.mainloop = 2;
  },
  
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    voice.mainloop = 1;
    try {
      while (voice.songslist.length > 0) {
        let latestObj = voice.songslist[0];
        let stream = latestObj.stream = await ytdl(latestObj.url, { filter: 'audioonly' });
        voice.resource = DiscordVoice.createAudioResource(stream, { inlineVolume: true });
        voice.player.play(voice.resource);
        while (voice.resource && !voice.resource.ended && voice.player.state.status != DiscordVoice.AudioPlayerStatus.Idle) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.songslist.length) {
            if (voice.resource && voice.resource.playbackDuration > voice.songslist[0].expectedLength - 2 && voice.mainloop != 3) voice.mainloop = 2;
            if (voice.mainloop == 2) {
              voice.player.unpause();
              voice.player.stop();
              voice.player.once(DiscordVoice.AudioPlayerStatus.Idle, () => voice.resource = null);
              voice.voteskip.length = 0;
            } else if (voice.mainloop == 3) {
              voice.player.unpause();
              voice.player.stop();
              voice.player.once(DiscordVoice.AudioPlayerStatus.Idle, () => voice.resource = null);
              voice.songslist.length = 0;
              voice.voteskip.length = 0;
            }
          }
        }
        if (voice.mainloop != 2 && voice.mainloop != 3 && voice.resource && voice.resource.playbackDuration < latestObj.expectedLength - 1700)
          msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (voice.mainloop == 2 || voice.mainloop == 3) {
          voice.mainloop = 1;
          if (voice.songslist.length) voice.songslist.splice(0, 1);
        } else if (!voice.loop && voice.songslist.length) {
          if (voice.queueloop) voice.songslist.push(voice.songslist.splice(0, 1)[0]);
          else voice.songslist.splice(0, 1);
        }
        voice.resource = null;
        if (!voice.loop) voice.voteskip.length = 0;
      }
    } catch (e) {
      console.error(e);
    }
    voice.mainloop = 0;
  },
  
  stopMainLoop: function stopMainLoop(voice) {
    if (voice.mainloop == 0) return;
    voice.mainloop = 3;
    return new Promise(resolve => {
      voice.player.on(DiscordVoice.AudioPlayerStatus.Idle, resolve);
    });
  },

  getCurrentTrackTime: function getCurrentTrackTime(voice) {
    return voice.resource.playbackDuration;
  },

  getFinishedTrackTime: function getFinishedTrackTime(voice) {
    return voice.songslist[0].expectedLength;
  },

  getStatus: function getStatus(voice) {
    switch (voice.player.state.status) {
      case DiscordVoice.AudioPlayerStatus.Idle: return 'Idle';
      case DiscordVoice.AudioPlayerStatus.Buffering: return 'Buffering';
      case DiscordVoice.AudioPlayerStatus.Playing: return 'Playing';
      case DiscordVoice.AudioPlayerStatus.Paused: return 'Paused';
      default: return 'Null';
    }
  },
};

module.exports = clientVCManager;
