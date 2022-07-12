module.exports = [
  {
    name: '@_everyone',
    description: '`!@_everyone members [hidden]` pings everyone ... the manual way\n`!@_everyone roles [hidden]` pings all roles instead',
    flags: 0b010100,
    execute(o, msg, rawArgs) {
      if (!persData.special_guilds_set.has(msg.guild.id)) return;
      if (!common.isAdmin(msg)) return;
      
      let doRoles, hidden = Boolean(rawArgs[1]);
      
      if (rawArgs[0] == 'members')
        doRoles = false;
      else if (rawArgs[0] == 'roles')
        doRoles = true;
      else
        return common.regCmdResp(o, 'Error: argument must be either members or roles.');
      
      if (!doRoles && msg.guild.memberCount > 1000)
        return common.regCmdResp(o, 'Error: too many members in guild to ping all members.');
      
      let promises = [];
      if (hidden) {
        promises.push(
          common.regCmdResp(o, '@ everyone')
            .then(x => x.edit({ content: '@everyone', allowedMentions: { parse: ['everyone'] } }))
        );
      }
      
      let step = doRoles ? 90 : 95;
      
      let entries = Array.from(msg.guild[doRoles ? 'roles' : 'members'].cache.values());
      if (doRoles) entries = entries.map(x => `<@&${x.id}>`);
      else entries = entries.filter(x => !x.user.bot).map(x => `<@${x.id}>`);
      
      for (var i = 0; i < entries.length; i += step) {
        let promise = msg.channel.send({
          content: entries.slice(i, i + step).join(''),
          allowedMentions: { parse: [doRoles ? 'roles' : 'users'] } 
        });
        if (hidden) promise = promise.then(x => x.delete());
        promises.push(promise);
      }
      
      return Promise.allSettled(promises);
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
      return msg.channel.send({ content: `Random ping: <@!${random_member.user.id}>`, allowedMentions: { parse: ['users'] } });
    },
  },
];
