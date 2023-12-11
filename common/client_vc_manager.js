var GatewayOpcodes = require('discord-api-types/v10').GatewayOpcodes;

// object with utility functions to manage the joining of vcs and playing of songs
module.exports = exports = {
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
      _settleFunc: null,
      _repeatedFails: 0,
    };
  },
  
  // all of these functions have self explanatory names, and the first parameter of each function is the guild's voice state object
  join: async function join(voice, channel) {
    if (voice.channel) exports.leave(voice);
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
    if (voice._settleFunc) {
      voice._settleFunc();
    }
    voice._repeatedFails = 0;
  },
  
  getSelfMute: function getSelfMute(voice) {
    return voice.channel.guild.members.me.voice.selfMute;
  },
  
  getSelfDeaf: function getSelfDeaf(voice) {
    return voice.channel.guild.members.me.voice.selfDeaf;
  },
  
  toggleSelfMute: function toggleSelfMute(voice) {
    // there appears to be no way to set this using guild.members.me.voice or VoiceConnection, so a raw api call has to be used
    voice.connection.state.adapter.sendPayload({
      op: GatewayOpcodes.VoiceStateUpdate,
      d: {
        guild_id: voice.channel.guildId,
        channel_id: voice.channel.id,
        self_mute: !voice.channel.guild.members.me.voice.selfMute,
        self_deaf: voice.channel.guild.members.me.voice.selfDeaf,
      },
    });
  },
  
  toggleSelfDeaf: function toggleSelfDeaf(voice) {
    // there appears to be no way to set this using guild.members.me.voice or VoiceConnection, so a raw api call has to be used
    voice.connection.state.adapter.sendPayload({
      op: GatewayOpcodes.VoiceStateUpdate,
      d: {
        guild_id: voice.channel.guildId,
        channel_id: voice.channel.id,
        self_mute: voice.channel.guild.members.me.voice.selfMute,
        self_deaf: !voice.channel.guild.members.me.voice.selfDeaf,
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
  
  isValidUrl: function isValidUrl(url) {
    if (/^https?:\/\/(?:(?:www.)?youtube.com\/watch\?v=|youtu.be\/)[A-Za-z0-9?&=\-_%.]+$/.test(url))
      return true;
    if (type == null) {
      if (userId && (!common.isDeveloper(userId) || !guildId || !persData.special_guilds_set.has(guildId)))
        return false;
      if (fs.existsSync(url))
        return true;
      if (type == null)
        return false;
    }
  },
  
  addSong: async function addSong(voice, url, userId, guildId) {
    let type = null;
    
    if (/^https?:\/\/(?:(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[A-Za-z0-9?&=\-_%.]+$/.test(url))
      type = 1;
    else if (/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=[A-Za-z0-9?&=\-_%.]+$/.test(url))
      type = 2;
    
    if (type == null) {
      if (userId && (!common.isDeveloper(userId) || !guildId || !persData.special_guilds_set.has(guildId)))
        throw new common.BotError('Not a YouTube URL');
      if (fs.existsSync(url))
        type = 0;
      if (type == null)
        throw new common.BotError('File nonexistent');
    }
    
    switch (type) {
      case 0: {
        // local file
        let songInfo = {
          type: 0,
          url: url,
          desc: 'Local file',
          expectedLength: 0,
          userId: null,
          stream: null,
        };
        voice.songslist.push(songInfo);
        return songInfo;
      }
      
      case 1: {
        // youtube url
        let info;
        try {
          info = await ytdl.getBasicInfo(url);
        } catch (e) {
          throw new common.BotError('Invalid URL (The video may be private or unavailable or there may be a temporary network error.)');
        }
        let songInfo = {
          type: 1,
          url: url,
          desc: `${info.videoDetails.title} by ${info.videoDetails.author.name}`,
          expectedLength: info.videoDetails.lengthSeconds * 1000,
          userId: common.isId(userId) ? userId : null,
          stream: null,
        };
        voice.songslist.push(songInfo);
        return songInfo;
      }
      
      case 2: {
        // youtube playlist
        let info;
        try {
          info = await ytpl(url);
        } catch (e) {
          console.error(e);
          throw new common.BotError('Invalid URL (The playlist may be private or unavailable or there may be a temporary network error.)');
        }
        let playListInfo = {
          type: 2,
          url: url,
          desc: `[playlist] ${info.title} by ${info.author.name} (${info.items.length} songs)`,
          expectedLength: info.items.reduce((a, c) => a + c.durationSec, 0) * 1000,
          userId: common.isId(userId) ? userId : null,
          stream: null,
        };
        for (let song of info.items) {
          voice.songslist.push({
            type: 1,
            url: song.shortUrl,
            desc: `${song.title} by ${song.author.name}`,
            expectedLength: song.durationSec * 1000,
            userId: common.isId(userId) ? userId : null,
            stream: null,
          });
        }
        return playListInfo;
      }
      
      default:
        throw new common.BotError('Invalid song type');
    }
  },
  
  setMainLoop: function (voice, mainloopVal) {
    voice.mainloop = mainloopVal;
    if ((!voice.mainloop || voice.mainloop == 2 || voice.mainloop == 3) && voice._settleFunc) {
      voice._settleFunc();
    }
  },
  
  voteSkip: function (voice, userId) {
    var voiceIndex = voice.voteskip.indexOf(userId);
    if (voiceIndex > -1) voice.voteskip.splice(voiceIndex, 1);
    else voice.voteskip.push(userId);
    let voiceMembers = new Set(Array.from(voice.channel.members.values()).filter(x => !x.user.bot).map(x => x.id));
    if (voice.mainloop && voice.voteskip.filter(x => voiceMembers.has(x)).length / voiceMembers.size >= 0.5) {
      exports.setMainLoop(voice, 2);
      return 1;
    } else return voiceIndex > -1 ? 3 : 2;
  },
  
  forceSkip: function (voice, startIndex, stopIndex) {
    if (startIndex == null) startIndex = 0;
    if (stopIndex == null) stopIndex = startIndex;
    
    if (stopIndex < startIndex) {
      [ startIndex, stopIndex ] = [stopIndex, startIndex];
    }
    
    if (startIndex == 0) {
      if (voice.mainloop) exports.setMainLoop(voice, 2);
      
      startIndex++;
    }
    
    if (startIndex > stopIndex) {
      return;
    }
    
    voice.songslist.splice(startIndex, stopIndex - startIndex + 1);
  },
  
  _mainLoopAwaitPromise: function _mainLoopAwaitPromise(voice) {
    return new Promise(r => {
      let alreadySettled = false;
      let settleFunc = err => {
        if (err instanceof Error) {
          console.error('ERROR in music playback:');
          console.error(err);
        }
        if (alreadySettled) return;
        alreadySettled = true;
        try {
          voice.player.removeListener(DiscordVoice.AudioPlayerStatus.Idle, voice._settleFunc);
          voice.player.removeListener('error', voice._settleFunc);
        } catch (e) {}
        voice._settleFunc = null;
        r();
      };
      voice.player.on(DiscordVoice.AudioPlayerStatus.Idle, settleFunc);
      voice.player.on('error', settleFunc);
      voice._settleFunc = settleFunc;
    });
  },
  
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    exports.setMainLoop(voice, 1);
    try {
      while (voice.songslist.length > 0) {
        let songInfo = voice.songslist[0];
        // highWaterMark is temporary fix to prevent stream aborting
        let stream;
        switch (songInfo.type) {
          case 0:
            stream = songInfo.stream = fs.createReadStream(songInfo.url);
            break;
          case 1:
            stream = songInfo.stream = ytdl(songInfo.url, { filter: 'audioonly', highWaterMark: 2 ** 28 });
            break;
        }
        voice.resource = DiscordVoice.createAudioResource(stream, { inlineVolume: true });
        voice.player.play(voice.resource);
        
        await exports._mainLoopAwaitPromise(voice);
        
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
        
        let loopWait, forceLoop = false;
        if (voice.mainloop != 2 && voice.mainloop != 3 && voice.resource && voice.resource.playbackDuration < songInfo.expectedLength - 1700) {
          if (voice.resource.playbackDuration + 100 > songInfo.expectedLength && voice._repeatedFails)
            voice._repeatedFails = 0;
          voice._repeatedFails++;
          loopWait = 1000 * 2 ** (voice._repeatedFails - 1);
          msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}, waiting ${(loopWait / 1000).toFixed(3)} seconds`);
          if (voice.resource.playbackDuration < 5000 && voice.resource.playbackDuration + 100 < songInfo.expectedLength / 2 && voice._repeatedFails < 5)
            forceLoop = true;
          if (voice._repeatedFails >= 5)
            voice._repeatedFails = 0;
        } else if (voice._repeatedFails) {
          voice._repeatedFails = 0;
        }
        
        if (voice.mainloop == 2 || voice.mainloop == 3) {
          exports.setMainLoop(voice, 1);
          if (voice.songslist.length) voice.songslist.splice(0, 1);
        } else if (!(voice.loop || forceLoop) && voice.songslist.length) {
          if (voice.queueloop) voice.songslist.push(voice.songslist.splice(0, 1)[0]);
          else voice.songslist.splice(0, 1);
        }
        
        voice.resource = null;
        
        if (!(voice.loop || forceLoop)) voice.voteskip.length = 0;
        
        if (voice._repeatedFails > 1) {
          await new Promise(r => setTimeout(r, loopWait));
        }
      }
    } catch (e) {
      console.error(e);
    }
    exports.setMainLoop(voice, 0);
  },
  
  stopMainLoop: function stopMainLoop(voice) {
    if (voice.mainloop == 0) return;
    exports.setMainLoop(voice, 3);
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
  
  getPlayStatus: function getPlayStatus(voice) {
    switch (voice.player.state.status) {
      case DiscordVoice.AudioPlayerStatus.Idle: return 'Idle';
      case DiscordVoice.AudioPlayerStatus.Buffering: return 'Buffering';
      case DiscordVoice.AudioPlayerStatus.Playing: return 'Playing';
      case DiscordVoice.AudioPlayerStatus.Paused: return 'Paused';
      default: return 'Null';
    }
  },
  
  getCurrentSong: function getCurrentSong(songInfo) {
    return (
        songInfo.type == 1 ?
          `[${songInfo.desc}](<${songInfo.url}>)` :
          songInfo.desc
      ) +
      ` (${common.msecToHMS(Number(songInfo.expectedLength))})`;
  },
  
  getCurrentSong2: function getCurrentSong2(voice) {
    if (voice.songslist.length) {
      return (
          voice.songslist[0].type == 1 ?
            `[${voice.songslist[0].desc}](<${voice.songslist[0].url}>)` :
            voice.songslist[0].desc
        ) +
        (
          voice.songslist[0].userId ?
            ` (requested by ${client.users.cache.get(voice.songslist[0].userId)?.tag ?? 'null'}, id ${voice.songslist[0].userId})` :
            ''
        );
    } else {
      return 'No Song';
    }
  },
  
  getTime: function getTime(voice) {
    if (voice.resource) {
      let timeBar = voice.songslist.length ? common.formatPlaybackBar(exports.getCurrentTrackTime(voice) / exports.getFinishedTrackTime(voice)) : '---';
      let currentTime = common.msecToHMS(exports.getCurrentTrackTime(voice));
      let endTime = voice.songslist.length ? common.msecToHMS(exports.getFinishedTrackTime(voice)) : '-:--.---';
      return `Time: ${timeBar} (${currentTime} / ${endTime})\n`;
    } else {
      return '';
    }
  },
  
  getVoteskippers: function getVoteskippers(voice) {
    if (voice.voteskip.length) {
      let voteSkipList = voice.voteskip
        .map(x => `${client.users.cache.get(x)?.tag} (id ${x})`)
        .join(', ');
      return `Voteskippers: ${voteSkipList}\n`;
    } else {
      return '';
    }
  },
  
  getTimeAndVoteskippers: function getTimeAndVoteskippers(voice) {
    return exports.getTime(voice) +
      exports.getVoteskippers(voice);
  },
  
  getFullStatus: function getFullStatus(voice) {
    return `Status: ${exports.getPlayStatus(voice)}, Volume: ${voice.volume}, Loop: ${voice.loop ? '✅' : '❌'}, Queue Loop: ${voice.queueloop ? '✅' : '❌'}, Self Muted: ${exports.getSelfMute(voice) ? '✅' : '❌'}, Self Deafened: ${exports.getSelfDeaf(voice) ? '✅' : '❌'}`;
  },
  
  getQueue: function getQueue(voice, page) {
    if (voice.songslist.length > 1) {
      if (page == null || !Number.isSafeInteger(page)) page = 0;
      
      let fullQueue = voice.songslist.slice(1);
      
      let maxPerPage = 10;
      
      let numPages = Math.ceil(fullQueue.length / maxPerPage);
      
      if (page < 0) page = 0;
      if (page > numPages - 1) page = numPages - 1;
      
      return ':\n' +
        fullQueue
          .slice(page * maxPerPage, (page + 1) * maxPerPage)
          .map(
            (x, i) => {
              let userString = x.userId ?
                `, requested by ${client.users.cache.get(x.userId)?.tag ?? 'null'}, id ${x.userId}` :
                '';
              return `${i + 1}. ${x.desc} (${common.msecToHMS(x.expectedLength)}${userString})`;
            }
          )
          .join('\n') + '\n' +
          `Page ${page + 1}/${numPages} (songs ${page * maxPerPage + 1}-${Math.min((page + 1) * maxPerPage, fullQueue.length)}/${fullQueue.length})`;
    } else {
      return ' empty';
    }
  },
  
  getQueueSize: function getQueueSize(voice) {
    return voice.songslist.length;
  },
};
