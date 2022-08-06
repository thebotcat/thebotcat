module.exports = [
  msg => {
    if (props.feat.version == 'canary') return;
    if (msg.channel.id == persData.ids.channel.v3) {
      msg.delete();
      client.channels.cache.get(persData.ids.channel.v4).send(`${msg.author.tag}: ${msg.content}`);
      props.saved.misc.sendmsgid = msg.id;
      schedulePropsSave();
    }
    if (msg.channel.id == persData.ids.channel.v5 && (props.saved.lastnum == null || props.saved.lastnum < 5000)) {
      if (msg.embeds.length || props.saved.lastnum != null && Number(msg.content) != props.saved.lastnum + 1) { msg.delete(); nonlogmsg(`count to 5000, deleted ${msg.author.tag}: ${msg.content}`); }
      else props.saved.lastnum = Number(msg.content);
      if (props.saved.lastnum >= 5000)
        msg.channel.send('The goal of 5000 has been reached, this channel has now been freed.');
      props.saved.lastnumid = msg.id;
      schedulePropsSave();
    }
    if (msg.channel.id == persData.ids.channel.v6 && msg.attachments.size) {
      msg.react('👍'); msg.react('🟡'); msg.react('👎');
    }
    if (msg.channel.id == persData.ids.channel.v7 && msg.content.toLowerCase() == 'pp') msg.reply('fuck you');
  },
];
