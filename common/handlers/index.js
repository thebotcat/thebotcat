module.exports = {
  event: {
    messageCreate: require('./events/messageCreate'),
    voiceStateUpdate: require('./events/voiceStateUpdate'),
    interactionCreate: require('./events/interactionCreate'),
  },
  extra: {
    messageCreate: require('./extras/messageCreate'),
    voiceStateUpdate: require('./extras/voiceStateUpdate'),
    interactionCreate: require('./extras/interactionCreate'),
  },
};
