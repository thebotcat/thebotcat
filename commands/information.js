module.exports = [
  {
    name: 'help',
    description: '`!help` for a list of my commands\n`!help <command>` for help on a specific command',
    description_slash: 'help on commands',
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'command', description: 'the command' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      if (rawArgs.length == 0 || rawArgs[0] == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(rawArgs[0] == 'all' ? null : msg.guild ? props.saved.guilds[msg.guild.id] : false);
        return common.regCmdResp(o, {
          embeds: [{
            title: `Commands (${commandsList.length})`,
            description: 'Run `!help <command>` for help on a specific command. (Italics are aliases.)',
            fields: Object.keys(commandsCategorized).map(
              x => ({ name: `${x} (${commandsCategorized[x].filter(x => !x.alias).length})`, value: commandsCategorized[x].map(y => y.alias ? `_\`${y.name}\`_` : `\`${y.name}\``).join(', ') || 'None', inline: false })
            ),
          }],
        });
      } else {
        let name = o.asOneArg;
        let cmdobj = commandCollWAliases.get(name);
        if (cmdobj && cmdobj.flags & 2) {
          return common.regCmdResp(o, `**Command:** \`${cmdobj.name}\`\n${cmdobj.aliases ? '**Aliases:** ' + cmdobj.aliases.map(x => `\`${x}\``).join(', ') + '\n' : ''}${cmdobj.description ?? 'No description'}`);
        } else {
          return common.regCmdResp(o, `Command \`${name}\` does not exist.`);
        }
      }
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      if (!args[0] || args[0].value == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(args[0] && args[0].value == 'all' ? null : o.guild ? props.saved.guilds[o.guild.id] : false, true);
        return common.slashCmdResp(o, ephemeral,
          `Commands (${commandsList.length})\n` +
          'Run `!help <command>` for help on a specific command. (Italics are aliases.)\n\n' +
          Object.keys(commandsCategorized).map(
            x => (`${x} (${commandsCategorized[x].filter(x => !x.alias).length})\n` +
              commandsCategorized[x].map(y => y.alias ? `_\`${y.name}\`_` : `\`${y.name}\``).join(', ') || 'None')
          ).join('\n\n'));
      } else {
        let name = args[0].value;
        let cmdobj = commandCollWAliases.get(name);
        if (cmdobj && cmdobj.flags & 2) {
          return common.slashCmdResp(o, ephemeral, `**Command:** \`${cmdobj.name}\`\n${cmdobj.aliases ? '**Aliases:** ' + cmdobj.aliases.map(x => `\`${x}\``).join(', ') + '\n' : ''}${cmdobj.description ?? 'No description'}`);
        } else {
          return common.slashCmdResp(o, ephemeral, `Command \`${name}\` does not exist.`);
        }
      }
    },
  },
  {
    name: 'version',
    description: '`!version` for the version of my code',
    description_slash: 'prints my version',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, `Thebotcat is version ${version}`);
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      return common.slashCmdResp(o, ephemeral, `Thebotcat is version ${version}`);
    },
  },
  {
    name: 'uptime',
    description: '`!uptime` for my uptime',
    description_slash: 'prints my uptime',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      common.regCmdResp(o, common.getBotcatUptimeMessage());
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, common.getBotcatUptimeMessage(false));
    },
  },
  {
    name: 'status',
    description: '`!status` for my status',
    description_slash: 'prints my status',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      common.regCmdResp(o, common.getBotcatStatusMessage());
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, common.getBotcatStatusMessage(false));
    },
  },
  {
    name: 'fullstatus',
    description: '`!fullstatus` for my full status',
    description_slash: 'prints my full status',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      common.regCmdResp(o, common.getBotcatFullStatusMessage());
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, common.getBotcatFullStatusMessage(false));
    },
  },
  {
    name: 'ping',
    description: '`!ping` checks my ping to the WebSocket gateway, the web, and the Discord API',
    description_slash: 'checks my ping to the WebSocket gateway, the web, and the Discord API',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      return new Promise((resolve, reject) => {
        common.regCmdResp(o, 'Checking Ping').then(m => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = m.createdTimestamp - msg.createdTimestamp;
            var wsPing = client.ws.ping;
            
            resolve(m.edit(`*Bot Ping:* **${botPing}**ms\n*WS Ping:* **${wsPing}**ms\n*API Ping:* **${apiPing}**ms`));
          });
        });
      });
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      return new Promise((resolve, reject) => {
        common.slashCmdResp(o, ephemeral, 'Checking Ping').then(v => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = BigInt(beforerequest) - (BigInt(interaction.id) >> 22n) - BigInt(new Date('2015').getTime());
            var wsPing = client.ws.ping;
            
            resolve(interaction.editReply( `*Bot Ping:* **${botPing}**ms\n*WS Ping:* **${wsPing}**ms\n*API Ping:* **${apiPing}**ms (inaccurate for slash commands)`));
          });
        });
      });
    },
  },
  {
    name: 'discord',
    description: '`!discord` for a link to my Discord Support Server',
    description_slash: 'sends a link to my Discord Support Server',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var discord = new Discord.EmbedBuilder()
        .setTitle('This is my discord support server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter({ text: 'Server for thebotcat discord bot come along and say hi!' });
      return common.regCmdResp(o, { embeds: [discord] });
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, 'Support server: https://discord.gg/NamrBZc');
    },
  },
  {
    name: 'github',
    description: '`!github` for a link to my GitHub repository',
    description_slash: 'sends a link to my GitHub repository',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var github = new Discord.EmbedBuilder()
        .setTitle('This is my github repository (I\'m completely open source)!\nhttps://github.com/thebotcat/thebotcat')
        .setFooter({ text: 'Star our GitHub repo! (If you like the code of course)\n\nAnd when they clicked "make public" they felt an evil leave their presence.' });
      return common.regCmdResp(o, { embeds: [github] });
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, 'Github Repository: https://github.com/thebotcat/thebotcat');
    },
  },
  {
    name: 'invite',
    description: '`!invite` for my server invite link',
    description_slash: 'sends my server invite link',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var invite = new Discord.EmbedBuilder()
        .setTitle('My invite link, to add me to any server!\nhttps://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot+applications.commands');
      return common.regCmdResp(o, { embeds: [invite] });
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      common.slashCmdResp(o, ephemeral, 'Bot Invite Link: <https://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot+applications.commands>');
    },
  },
  {
    name: 'avatar',
    description: '`!avatar [@someone]` displays someone\'s avatar or yours if a user isn\'t provided',
    description_slash: 'displays someone\'s avatar or yours if a user isn\'t provided',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'user', description: 'a user to display the avatar of' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      let member;
      if (rawArgs.length) {
        if (msg.guild) {
          let potentialMember = await common.searchMember(msg.guild.members, o.asOneArg);
          if (potentialMember) member = potentialMember;
          else {
            let user = await common.searchUser(o.asOneArg);
            if (user) member = { user, displayHexColor: '#000000' };
            else return common.regCmdResp(o, 'User not found.');
          }
        } else {
          let user = await common.searchUser(o.asOneArg);
          if (user) member = { user: user, displayHexColor: '#000000' };
          else return common.regCmdResp(o, 'User not found.');
        }
      } else {
        if (msg.guild) member = msg.member;
        else member = { user: msg.author, displayHexColor: '#000000' };
      }
      
      let avatarURL = member.user.displayAvatarURL({ dynamic: true });
      let animated = member.user.avatar && member.user.avatar.startsWith('a_');
      if (member.user.avatar == null) {
        return common.regCmdResp(o, {
          embeds: [new Discord.EmbedBuilder()
            .setTitle(`Avatar for ${member.user.tag}`)
            .setDescription(
              `userid: ${member.user.id}\n` +
              `links: [default](${avatarURL}) (avatar is default)`
            )
            .setImage(avatarURL)
            .setColor(member.displayHexColor)],
        });
      } else {
        let baseurl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`;
        if (animated)
          return common.regCmdResp(o, {
            embeds: [new Discord.EmbedBuilder()
              .setTitle(`Avatar for ${member.user.tag}`)
              .setDescription(
                `userid: ${member.user.id}\n` +
                `links: [default](${avatarURL}), ` +
                `[normal\xa0png](${baseurl}.png), ` +
                `[normal\xa0webp](${baseurl}.webp), ` +
                `[normal\xa0gif](${baseurl}.gif)\n` +
                `big links: [big png](${baseurl}.png?size=4096), ` +
                `[big\xa0webp](${baseurl}.webp?size=4096), ` +
                `[big\xa0gif](${baseurl}.gif?size=4096)`
              )
              .setImage(`${baseurl}.gif?size=4096`)
              .setColor(member.displayHexColor)],
          });
        else
          return common.regCmdResp(o, {
            embeds: [new Discord.EmbedBuilder()
              .setTitle(`Avatar for ${member.user.tag}`)
              .setDescription(
                `userid: ${member.user.id}\n` +
                `links: [default](${avatarURL}), ` +
                `[normal\xa0png](${baseurl}.png), ` +
                `[normal\xa0webp](${baseurl}.webp), ` +
                `[big\xa0png](${baseurl}.png?size=4096), ` +
                `[big\xa0webp](${baseurl}.webp?size=4096)`
              )
              .setImage(`${baseurl}.png?size=4096`)
              .setColor(member.displayHexColor)],
          });
      }
    },
    async execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      
      let member;
      if (args[0]) {
        if (o.guild) {
          try {
            let potentialMember = await o.guild.members.fetch(args[0].value);
            member = potentialMember;
          } catch (e) {
            let user = await client.users.fetch(args[0].value);
            if (user) member = { user, displayHexColor: '#000000' };
            else return common.slashCmdResp(o, ephemeral, 'User not found.');
          }
        } else {
          let user = await client.users.fetch(args[0].value);
          if (user) member = { user: user, displayHexColor: '#000000' };
          else return common.slashCmdResp(o, ephemeral, 'User not found.');
        }
      } else {
        if (o.guild) member = o.member;
        else member = { user: o.author, displayHexColor: '#000000' };
      }
      
      let avatarURL = member.user.displayAvatarURL({ dynamic: true });
      let animated = member.user.avatar && member.user.avatar.startsWith('a_');
      if (member.user.avatar == null) {
        return common.slashCmdResp(o, ephemeral,
          `**Avatar for ${member.user.tag}**\n` +
          `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
          `links: [default](<${avatarURL}>) (avatar is default)\n` +
          `[[for\xa0embed]]( ${avatarURL} )`);
      } else {
        let baseurl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`;
        if (animated)
          return common.slashCmdResp(o, ephemeral,
            `**Avatar for ${member.user.tag}**\n` +
            `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
            `links: [default](<${avatarURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[normal\xa0gif](<${baseurl}.gif>)\n` +
            `big links: [big png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
            `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
            `[[for\xa0embed]]( ${baseurl}.gif?size=4096 )`);
        else
          return common.slashCmdResp(o, ephemeral,
            `**Avatar for ${member.user.tag}**\n` +
            `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
            `links: [default](<${avatarURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[big\xa0png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
            `[[for\xa0embed]]( ${baseurl}.png?size=4096 )`);
      }
    },
  },
  {
    name: 'icon',
    description: '`!icon` displays the server\'s icon',
    description_slash: 'displays the server\'s icon',
    flags: 0b110110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      let guild = msg.guild;
      
      let iconURL = guild.iconURL({ dynamic: true });
      let animated = guild.icon && guild.icon.startsWith('a_');
      if (guild.icon == null) {
        return common.regCmdResp(o, {
          embeds: [new Discord.EmbedBuilder()
            .setTitle(`Icon for ${guild.name}`)
            .setDescription(
              `serverid: ${guild.id}\n` +
              'Server icon is default'
            )],
        });
      } else {
        let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
        if (animated)
          return common.regCmdResp(o, {
            embeds: [new Discord.EmbedBuilder()
              .setTitle(`Icon for ${guild.name}`)
              .setDescription(
                `serverid: ${guild.id}\n` +
                `links: [default](${iconURL}), ` +
                `[normal\xa0png](${baseurl}.png), ` +
                `[normal\xa0webp](${baseurl}.webp), ` +
                `[normal\xa0gif](${baseurl}.gif)\n` +
                `big links: [big png](${baseurl}.png?size=4096), ` +
                `[big\xa0webp](${baseurl}.webp?size=4096), ` +
                `[big\xa0gif](${baseurl}.gif?size=4096)`
              )
              .setImage(`${baseurl}.gif?size=4096`)],
          });
        else
          return common.regCmdResp(o, {
            embeds: [new Discord.EmbedBuilder()
              .setTitle(`Icon for ${guild.name}`)
              .setDescription(
                `serverid: ${guild.id}\n` +
                `links: [default](${iconURL}), ` +
                `[normal\xa0png](${baseurl}.png), ` +
                `[normal\xa0webp](${baseurl}.webp), ` +
                `[big\xa0png](${baseurl}.png?size=4096), ` +
                `[big\xa0webp](${baseurl}.webp?size=4096)`
              )
              .setImage(`${baseurl}.png?size=4096`)],
          });
      }
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      
      let guild = o.guild;
      
      let iconURL = guild.iconURL({ dynamic: true });
      let animated = guild.icon && guild.icon.startsWith('a_');
      if (guild.icon == null) {
        return common.slashCmdResp(o, ephemeral,
          `**Icon for ${guild.name}**\n` +
          `serverid: ${guild.id}\n` +
          'Server icon is default');
      } else {
        let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
        if (animated)
          return common.slashCmdResp(o, ephemeral,
            `**Icon for ${guild.name}**\n` +
            `serverid: ${guild.id}\n` +
            `links: [default](<${iconURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[normal\xa0gif](<${baseurl}.gif>)\n` +
            `big links: [big png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
            `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
            `[[for\xa0embed]]( ${baseurl}.gif?size=4096 )`);
        else
          return common.slashCmdResp(o, ephemeral,
            `**Icon for ${guild.name}**\n` +
            `serverid: ${guild.id}\n` +
            `links: [default](<${iconURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[big\xa0png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
            `[[for\xa0embed]]( ${baseurl}.png?size=4096 )`);
      }
    },
  },
  {
    name: 'userinfo',
    description: '`!userinfo [@someone]` displays information about a user or you if a user isn\'t provided',
    description_slash: 'displays information about a user or you if a user isn\'t provided',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'user', description: 'a user to display information about' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      let user;
      if (rawArgs.length) {
        if (msg.guild) {
          let member = await common.searchMember(msg.guild.members, o.asOneArg);
          if (member) user = member.user;
          else {
            let potentialUser = await common.searchUser(o.asOneArg);
            if (potentialUser) user = potentialUser;
            else return common.regCmdResp(o, 'User not found.');
          }
        } else {
          let potentialUser = await common.searchUser(o.asOneArg);
          if (potentialUser) user = potentialUser;
          else return common.regCmdResp(o, 'User not found.');
        }
      } else user = msg.author;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(user.id) >> 22n));
      let avatarURL = user.displayAvatarURL({ dynamic: true });
      let animated = user.avatar && user.avatar.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
      let avatarStr = user.avatar == null ? `[default](${avatarURL}) (avatar is default)` :
        (animated ?
          `[default](${avatarURL}), ` +
          `[normal\xa0png](${baseurl}.png), ` +
          `[normal\xa0webp](${baseurl}.webp), ` +
          `[normal\xa0gif](${baseurl}.gif), ` +
          `[big\xa0png](${baseurl}.png?size=4096), ` +
          `[big\xa0webp](${baseurl}.webp?size=4096), ` +
          `[big\xa0gif](${baseurl}.gif?size=4096)` :
          `[default](${avatarURL}), ` +
          `[normal\xa0png](${baseurl}.png), ` +
          `[normal\xa0webp](${baseurl}.webp), ` +
          `[big\xa0png](${baseurl}.png?size=4096), ` +
          `[big\xa0webp](${baseurl}.webp?size=4096)`
        );
      
      return common.regCmdResp(o, {
        embeds: [{
          title: `User Info for ${user.tag}`,
          description: `**ID: ${user.id}, Bot: ${user.bot ? 'Yes' : 'No'}**`,
          thumbnail: { url: user.displayAvatarURL() + '?size=64' },
          fields: (() => {
            let arr = [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Flags', value: user.flags && user.flags.toArray().length ? user.flags.toArray().join(', ') : 'None', inline: false },
              { name: 'Avatar', value: avatarStr, inline: false },
            ];
            if (msg.guild && persData.special_guilds_set.has(msg.guild.id) && msg.guild.members.cache.get(user.id)) {
              let presence = o.guild.members.cache.get(user.id).presence?.clientStatus;
              if (presence) {
                let presenceKeys = Object.keys(presence);
                arr.push({ name: 'Presence', value: presenceKeys.length ? presenceKeys.map(x => `${x}: ${presence[x]}`).join(', ') : 'None', inline: false });
              } else {
                arr.push({ name: 'Presence', value: 'N/A', inline: false });
              }
            }
            return arr;
          })(),
        }],
      });
    },
    async execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      
      let user;
      if (args[0]) {
        let potentialUser = await client.users.fetch(args[0].value);
        if (potentialUser) user = potentialUser;
        else return common.slashCmdResp(o, ephemeral, 'User not found.');
      } else user = o.author;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(user.id) >> 22n));
      let avatarURL = user.displayAvatarURL({ dynamic: true });
      let animated = user.avatar && user.avatar.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
      let avatarStr = user.avatar == null ?
        `[default](<${avatarURL} ) (avatar is default)\n` +
        `[[for\xa0embed]]( ${avatarURL}?size=64 )` :
        (animated ?
          `[default](<${avatarURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[normal\xa0gif](<${baseurl}.gif>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
          `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
          `[[for\xa0embed]]( ${avatarURL}?size=64 )` :
          `[default](<${avatarURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
          `[[for\xa0embed]]( ${avatarURL}?size=64 )`
        );
      
      return common.slashCmdResp(o, ephemeral,
        `**User Info for ${user.tag}**\n` +
        `**ID: ${user.id}, Bot: ${user.bot ? 'Yes' : 'No'}**\n` +
        `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
        `Flags: ${user.flags && user.flags.toArray().length ? user.flags.toArray().join(', ') : 'None'}\n` +
        `Avatar: ${avatarStr}` +
        (o.guild && persData.special_guilds_set.has(o.guild.id) && o.guild.members.cache.get(user.id) ? (() => {
          let presence = o.guild.members.cache.get(user.id).presence?.clientStatus;
          if (presence) {
            let presenceKeys = Object.keys(presence);
            return '\nPresence: ' + (presenceKeys.length ? presenceKeys.map(x => `${x}: ${presence[x]}`).join(', ') : 'None');
          } else {
            return '\nPresence: N/A';
          }
        })() : ''));
    },
  },
  {
    name: 'memberinfo',
    description: '`!memberinfo [@someone]` displays information about a member or you if a member isn\'t provided',
    description_slash: 'displays information about a member or you if a member isn\'t provided',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.User, name: 'member', description: 'a member to display information about' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      let member;
      if (rawArgs.length) {
        member = await common.searchMember(msg.guild.members, o.asOneArg);
        if (!member) return common.regCmdResp(o, 'Member not found in guild.');
      } else member = msg.member;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(member.id) >> 22n));
      let joinedDate = new Date(member.joinedAt);
      
      return common.regCmdResp(o, {
        embeds: [{
          title: `Member Info for ${member.user.tag}`,
          description: `**ID: ${member.id}**`,
          color: member.displayColor,
          thumbnail: { url: member.user.displayAvatarURL() + '?size=64' },
          fields: [
            { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
            { name: 'Joined At', value: `${joinedDate.toISOString()} (${common.msecToHMSs(Date.now() - joinedDate.getTime())} ago)`, inline: false },
            { name: 'Roles', value: Array.from(member.roles.cache.values()).sort((a, b) => a.position > b.position ? -1 : 1).map(x => `<@&${x.id}>`).join(' '), inline: false },
          ],
        }],
      });
    },
    async execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      
      let member;
      if (args[0]) {
        try {
          member = await o.guild.members.fetch(args[0].value);
        } catch (e) {
          return common.slashCmdResp(o, ephemeral, 'Member not found in guild.');
        }
      } else member = o.member;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(member.id) >> 22n));
      let joinedDate = new Date(member.joinedAt);
      
      return common.slashCmdResp(o, ephemeral,
        `**Member Info for ${member.user.tag}**\n` +
        `**ID: ${member.id}, Color: ${member.displayHexColor}**\n` +
        `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
        `Joined At: ${joinedDate.toISOString()} (${common.msecToHMSs(Date.now() - joinedDate.getTime())} ago)\n` +
        `Roles: ${Array.from(member.roles.cache.values()).sort((a, b) => a.position > b.position ? -1 : 1).map(x => `<@&${x.id}>`).join(' ')}\n` +
        `[[for\xa0embed]]( ${member.user.displayAvatarURL()}?size=64 )`);
    },
  },
  {
    name: 'serverinfo',
    description: '`!serverinfo [all]` displays information about this server',
    description_slash: 'displays information about this server',
    flags: 0b110110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'all', description: 'show all server info' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let guild = msg.guild;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(guild.id) >> 22n));
      let iconURL = guild.iconURL();
      let animated = guild.icon && guild.icon.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
      let iconStr = guild.icon == null ? 'Server icon is default' :
        (animated ?
          `[default](${iconURL}), ` +
          `[normal\xa0png](${baseurl}.png), ` +
          `[normal\xa0webp](${baseurl}.webp), ` +
          `[normal\xa0gif](${baseurl}.gif), ` +
          `[big\xa0png](${baseurl}.png?size=4096), ` +
          `[big\xa0webp](${baseurl}.webp?size=4096), ` +
          `[big\xa0gif](${baseurl}.gif?size=4096)` :
          `[default](${iconURL}), ` +
          `[normal\xa0png](${baseurl}.png), ` +
          `[normal\xa0webp](${baseurl}.webp), ` +
          `[big\xa0png](${baseurl}.png?size=4096), ` +
          `[big\xa0webp](${baseurl}.webp?size=4096)`
        );
      
      if (rawArgs[0] == 'all')
        return common.regCmdResp(o, {
          embeds: [{
            title: `Information for ${guild.name}`,
            description: `**ID: ${guild.id}**`,
            thumbnail: { url: iconURL ? iconURL + '?size=64' : null },
            fields: [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Icon', value: iconStr, inline: false },
              { name: 'Members', value: '' + guild.memberCount, inline: true },
              { name: 'Member Cap', value: '' + guild.maximumMembers, inline: true },
            ],
          }],
        });
      else
        return common.regCmdResp(o, {
          embeds: [{
            title: `Information for ${guild.name}`,
            description: `**ID: ${guild.id}**`,
            thumbnail: { url: iconURL ? iconURL + '?size=64' : null },
            fields: [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Icon', value: iconStr, inline: false },
              { name: 'Members', value: '' + guild.memberCount, inline: true },
            ],
          }],
        });
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      
      let guild = o.guild;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(guild.id) >> 22n));
      let iconURL = guild.iconURL();
      let animated = guild.icon && guild.icon.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
      let iconStr = guild.icon == null ? 'Server icon is default' :
        (animated ?
          `[default](<${iconURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[normal\xa0gif](<${baseurl}.gif>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
          `[big\xa0gif](<${baseurl}.gif?size=4096>)` :
          `[default](<${iconURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>)`
        );
      
      if (args[0] && args[0].value)
        return common.slashCmdResp(o, ephemeral,
          `**Information for ${guild.name}**\n` +
          `**ID: ${guild.id}**\n` +
          `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
          `Icon: ${iconStr}\n` +
          `Members: ${guild.memberCount}\n` +
          `Member Cap: ${guild.maximumMembers}` +
          (iconURL ? `\n[[for\xa0embed]]( ${iconURL}?size=64 )` : ''));
      else
        return common.slashCmdResp(o, ephemeral,
          `**Information for ${guild.name}**\n` +
          `**ID: ${guild.id}**\n` +
          `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
          `Icon: ${iconStr}\n` +
          `Members: ${guild.memberCount}` +
          (iconURL ? `\n[[for\xa0embed]]( ${iconURL}?size=64 )` : ''));
    },
  },
  {
    name: 'firstmsg',
    description: '`!firstmsg [#channel]` for a link to the first message in a channel',
    description_slash: 'sends a link to the first message in a channel',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      let channel;
      if (!rawArgs[0] || !msg.guild) {
        channel = msg.channel;
      } else if (/^<#[0-9]+>$/.test(rawArgs[0])) {
        channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) channel = msg.channel;
      }
      let msgs = Array.from((await channel.messages.fetch({ after: 0, limit: 1 })).values());
      if (msgs.length == 1)
        return common.regCmdResp(o, `First message in <#${channel.id}>: https://discord.com/channels/${msg.guild ? msg.guild.id : '@me'}/${channel.id}/${msgs[0].id}`);
      else
        return common.regCmdResp(o, `<#${channel.id}> has no messages`);
    },
    async execute_slash(o, interaction, command, args) {
      let channel;
      if (!args[0] || !o.guild) {
        channel = o.channel;
      } else {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has(Discord.PermissionsBitField.Flags.ViewChannel)) channel = o.channel;
      }
      let msgs = Array.from((await channel.messages.fetch({ after: 0, limit: 1 })).values());
      let ephemeral = args[1] ? args[1].value : true;
      if (msgs.length == 1)
        return common.slashCmdResp(o, ephemeral, `First message in <#${channel.id}>: https://discord.com/channels/${o.guild ? o.guild.id : '@me'}/${channel.id}/${msgs[0].id}`);
      else
        return common.slashCmdResp(o, ephemeral, `<#${channel.id}> has no messages`);
    },
  },
  {
    name: 'dateid',
    description: '`!dateid <id>` prints the UTC date and time of an ID in Discord',
    description_slash: 'prints the UTC date and time of an ID in Discord',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'id', description: 'the id', required: true },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      try {
        let id = rawArgs[0];
        return common.regCmdResp(o, `Date: ${common.IdToDate(id).toISOString()}`);
      } catch (e) {
        return common.regCmdResp(o, 'Invalid ID');
      }
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      try {
        let id = args[0].value;
        return common.slashCmdResp(o, ephemeral, `Date: ${common.IdToDate(id).toISOString()}`);
      } catch (e) {
        return common.slashCmdResp(o, ephemeral, 'Invalid ID');
      }
    },
  },
  {
    name: 'idinfo',
    description: '`!idinfo <id>` prints the fields of an ID in Discord',
    description_slash: 'prints the fields of an ID in Discord',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'id', description: 'the id', required: true },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      try {
        let id = BigInt(rawArgs[0]);
        return common.regCmdResp(o, {
          embeds: [{
            title: 'ID Info',
            description: `**ID: ${id}**`,
            fields: [
              { name: 'Date', value: new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString(), inline: false },
              { name: 'Worker ID', value: String((id & 0x3E0000n) >> 17n), inline: true },
              { name: 'Process ID', value: String((id & 0x1F000n) >> 12n), inline: true },
              { name: 'Increment', value: String(id & 0xFFFn), inline: true },
            ],
          }],
        });
      } catch (e) {
        return common.regCmdResp(o, 'Invalid ID');
      }
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      try {
        let id = BigInt(args[0].value);
        return common.slashCmdResp(o, ephemeral,
          `ID Info for ${id}:\n\n` +
          `Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}\n` +
          `Worker ID: ${(id & 0x3E0000n) >> 17n}\n` +
          `Process ID: ${(id & 0x1F000n) >> 12n}\n` +
          `Increment: ${id & 0xFFFn}`);
      } catch (e) {
        return common.slashCmdResp(o, ephemeral, 'Invalid ID');
      }
    },
  },
];
