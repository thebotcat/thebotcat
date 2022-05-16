module.exports = [
  {
    name: '@_everyone',
    description: '`!@_everyone members [hidden]` pings everyone ... the manual way\n`!@_everyone roles [hidden]` pings all roles instead',
    flags: 0b010100,
    execute(o, msg, rawArgs) {
      if (!persData.special_guilds_set.has(msg.guild.id)) return;
      if (!common.isAdmin(msg)) return;
      if (rawArgs[1]) {
        if (rawArgs[0] == 'roles') {
          let promises = [ msg.channel.send('@ everyone').then(x => x.edit('@everyone')) ];
          let roles = Array.from(msg.guild.roles.cache.values()).map(x => `<@&${x.id}>`);
          for (var i = 0; i < roles.length; i += 90) {
            promises.push(msg.channel.send(roles.slice(i, i + 90).join(''), { allowedMentions: { parse: ['everyone'] } }).then(x => x.delete()));
          }
          return Promise.allSettled(promises);
        } else if (rawArgs[0] == 'members') {
          if (msg.guild.memberCount > 1000)
            return msg.channel.send('Error: too many members in guild to ping all members.');
          let promises = [ msg.channel.send('@ everyone').then(x => x.edit('@everyone')) ];
          let members = Array.from(msg.guild.members.cache.values()).filter(x => !x.user.bot).map(x => `<@${x.id}>`);
          for (var i = 0; i < members.length; i += 95) {
            promises.push(msg.channel.send(members.slice(i, i + 95).join(''), { allowedMentions: { parse: ['everyone'] } }).then(x => x.delete()));
          }
          return Promise.allSettled(promises);
        }
      } else {
        if (rawArgs[0] == 'roles') {
          let promises = [];
          let roles = Array.from(msg.guild.roles.cache.values()).map(x => `<@&${x.id}>`);
          for (var i = 0; i < roles.length; i += 90) {
            promises.push(msg.channel.send(roles.slice(i, i + 90).join(''), { allowedMentions: { parse: ['everyone'] } }));
          }
          return Promise.allSettled(promises);
        } else if (rawArgs[0] == 'members') {
          if (msg.guild.memberCount > 1000)
            return msg.channel.send('Error: too many members in guild to ping all members.');
          let promises = [];
          let members = Array.from(msg.guild.members.cache.values()).filter(x => !x.user.bot).map(x => `<@${x.id}>`);
          for (var i = 0; i < members.length; i += 95) {
            promises.push(msg.channel.send(members.slice(i, i + 95).join(''), { allowedMentions: { parse: ['everyone'] } }));
          }
          return Promise.allSettled(promises);
        }
      }
    },
  },
  {
    name: '@someone',
    description: '`!@someone` pings a random person on the server',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(common.isAdmin(msg) || msg.guild.id == persData.ids.guild.v0)) return;
      let members = Array.from(msg.guild.members.cache.values()).filter(x => !x.user.bot);
      let random_member = members[common.randInt(0, members.length)];
      return msg.channel.send(`Random ping: <@!${random_member.user.id}>`, { allowedMentions: { parse: ['everyone'] } });
    },
  },
];
