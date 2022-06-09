// used to clean up voice handler object if thebotcat is disconnected manually
module.exports = async (oldState, newState) => {
  let guilddata = props.saved.guilds[newState.guild.id];
  if (!guilddata) return;
  
  if (handlers.extra.voiceStateUpdate) {
    let res;
    for (var handlerFunc of handlers.extra.voiceStateUpdate) {
      if (handlerFunc.constructor == Function) res = handlerFunc(oldState, newState);
      else res = await handlerFunc(oldState, newState);
      if (res === 0) return;
    }
  }
  
  if (oldState.id == client.user.id) {
    if (!newState.channelId)
      common.clientVCManager.leave(guilddata.voice);
    else
      guilddata.voice.channel = newState.channel;
  }
};
