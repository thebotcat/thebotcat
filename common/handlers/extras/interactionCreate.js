module.exports = [
  o => {
    if (o.cmdName != 'lathe' && o.cmdName != 'lathe2' && o.cmdName != 'lathe3' && o.cmdName != 'lathe4') return;
    
    if (persData.special_guilds_set.has(o.interaction.guildId)) {
      let author = o.interaction.user ? `${o.interaction.user.username}#${o.interaction.user.discriminator} (${o.interaction.user.id})` : `${o.interaction.member.user.username}#${o.interaction.member.user.discriminator} (${o.interaction.member.user.id})`;
      let location = `${o.interaction.guildId && client.guilds.cache.get(o.interaction.guildId) ? client.guilds.cache.get(o.interaction.guildId).name : 'dms'}:${o.interaction.channelId && client.channels.cache.get(o.interaction.channelId) ? client.channels.cache.get(o.interaction.channelId).name : 'null'}`;
      
      nonlogmsg(`interaction ${location} ${author} ${util.inspect(o.cmdName)} ${util.inspect(o.args)}`);
    }
  },
  
  props.data_code[0],
];
