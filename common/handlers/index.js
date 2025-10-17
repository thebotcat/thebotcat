module.exports = {
  event: {
    [Discord.Events.MessageCreate]: require('./events/messageCreate'),
    [Discord.Events.VoiceStateUpdate]: require('./events/voiceStateUpdate'),
    [Discord.Events.InteractionCreate]: require('./events/interactionCreate'),
  },
  extra: {
    [Discord.Events.MessageCreate]: require('./extras/messageCreate'),
    [Discord.Events.VoiceStateUpdate]: require('./extras/voiceStateUpdate'),
    [Discord.Events.InteractionCreate]: require('./extras/interactionCreate'),
  },
};
