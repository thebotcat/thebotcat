module.exports = [
  {
    name: 'settings',
    description: '`!settings` for available settings\n`!settings <setting>` for help on a specific setting',
    description_slash: 'changes botcat\'s settings for this guild',
    flags: 0b110110,
    options: [
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'prefix', description: 'view or change my server prefix',
        options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'prefix', description: 'the prefix' } ],
      },
      {
        type: Discord.ApplicationCommandOptionType.Subcommand, name: 'confirmkb', description: 'view or set whether there is confirmation on the kick, ban, and unban commands',
        options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'confirmation', description: 'confirmation' } ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup, name: 'badwords', description: 'configures moderation on bad words',
        options: [
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'list', description: 'list all badwords or a specific word',
            options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'word', description: 'a badword' } ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'add', description: 'add a badword',
            options: [
              { type: Discord.ApplicationCommandOptionType.String, name: 'word', description: 'the badword to add', required: true },
              { type: Discord.ApplicationCommandOptionType.String, name: 'retaliation', description: 'the retaliation for saying the badword', required: true },
              {
                type: Discord.ApplicationCommandOptionType.Integer, name: 'type', description: 'type flags for badword', required: true,
                choices: [
                  { name: '0: entire message is badword, case sensitive', value: 0 },
                  { name: '1: message split by spaces contains badword, case sensitive', value: 1 },
                  { name: '2: badword is substring in message, case sensitive', value: 2 },
                  { name: '4: entire message is badword, case insensitive', value: 4 },
                  { name: '5: message split by spaces contains badword, case insensitive', value: 5 },
                  { name: '6: badword is substring in message, case insensitive', value: 6 },
                ],
              },
              { type: Discord.ApplicationCommandOptionType.Boolean, name: 'enabled', description: 'whether the word is enabled' },
              { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ignore_admin', description: 'whether the badword can be said by admins' },
              { type: Discord.ApplicationCommandOptionType.String, name: 'ignored_roles', description: 'roles who can say the badword' },
            ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'remove', description: 'remove a badword',
            options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'word', description: 'the badword to remove', required: true } ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'modify', description: 'modify a badword',
            options: [
              { type: Discord.ApplicationCommandOptionType.String, name: 'word', description: 'the badword to modify', required: true },
              { type: Discord.ApplicationCommandOptionType.String, name: 'retaliation', description: 'the retaliation for saying the badword' },
              {
                type: Discord.ApplicationCommandOptionType.Integer, name: 'type', description: 'type flags for badword',
                choices: [
                  { name: '0: entire message is badword, case sensitive', value: 0 },
                  { name: '1: message split by spaces contains badword, case sensitive', value: 1 },
                  { name: '2: badword is substring in message, case sensitive', value: 2 },
                  { name: '4: entire message is badword, case insensitive', value: 4 },
                  { name: '5: message split by spaces contains badword, case insensitive', value: 5 },
                  { name: '6: badword is substring in message, case insensitive', value: 6 },
                ],
              },
              { type: Discord.ApplicationCommandOptionType.Boolean, name: 'enabled', description: 'whether the word is enabled' },
              { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ignore_admin', description: 'whether the badword can be said by admins' },
              { type: Discord.ApplicationCommandOptionType.String, name: 'ignored_roles', description: 'roles who can say the badword' },
            ],
          },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup, name: 'logchannel', description: 'view or set server logging channel',
        options: [
          { type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'view server logging channel' },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'set', description: 'set server logging channel',
            options: [ { type: Discord.ApplicationCommandOptionType.Channel, name: 'logchannel', description: 'the logging channel or this channel if one isn\'t provided' } ],
          },
          { type: Discord.ApplicationCommandOptionType.Subcommand, name: 'clear', description: 'clear server logging channel' },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup,
        name: 'mutedrole',
        description: 'view or set muted role',
        options: [
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'view muted role'
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'set', description: 'set muted role or unset if none is provided',
            options: [ { type: Discord.ApplicationCommandOptionType.Role, name: 'mutedrole', description: 'the role' } ],
          },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup, name: 'roles', description: 'view or set bot-level role permissions',
        options: [
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'view roles with bot-level permissions or view permissions for one role',
            options: [ { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role' } ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'init', description: 'create bot-level permissions for a role',
            options: [ { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role', required: true } ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'clear', description: 'remove bot-level permissions for a role',
            options: [ { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role', required: true } ],
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'setperms', description: 'set bot-level permissions for a role',
            options: [
              { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role', required: true },
              {
                type: Discord.ApplicationCommandOptionType.String, name: 'value', description: 'enable or disable permissions', required: true,
                choices: [ { name: 'enable', value: 'enable'}, { name: 'disable', value: 'disable'} ],
              },
              { type: Discord.ApplicationCommandOptionType.String, name: 'permissions', description: 'string of a permission or permissions', required: true },
            ]
          },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup, name: 'overrides', description: 'view or set bot-level role permission overrides for channels',
        options: [
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'view channels with overrides (bot-level), overrides for a channel, or a specific override',
            options: [
              { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'a channel' },
              { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'a role' },
            ]
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'init', description: 'create bot-level overrides for a role in a channel',
            options: [
              { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel', required: true },
              { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role' },
            ]
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'clear', description: 'remove bot-level overrides for a role in a channel',
            options: [
              { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel', required: true },
              { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role' },
            ]
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'setperms', description: 'set bot-level overrides for a role in a channel',
            options: [
              { type: Discord.ApplicationCommandOptionType.Channel, name: 'channel', description: 'the channel', required: true },
              { type: Discord.ApplicationCommandOptionType.Role, name: 'role', description: 'the role', required: true },
              {
                type: Discord.ApplicationCommandOptionType.String, name: 'value', description: 'enable, disable, or reset permissions', required: true,
                choices: [ { name: 'enable', value: 'enable'}, { name: 'disable', value: 'disable'}, { name: 'reset', value: 'reset'} ],
              },
              { type: Discord.ApplicationCommandOptionType.String, name: 'permissions', description: 'string of a permission or permissions', required: true },
            ]
          },
        ],
      },
      {
        type: Discord.ApplicationCommandOptionType.SubcommandGroup, name: 'enabledcmds', description: 'view or set which commands are enabled',
        options: [
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'view', description: 'view whether commands are enabled globally or for a category or command',
            options: [
              {
                type: Discord.ApplicationCommandOptionType.String, name: 'scope', description: 'the scope of the view', required: true,
                choices: [ { name: 'global', value: 'global' }, { name: 'category', value: 'category' }, { name: 'command', value: 'command' } ],
              },
              { type: Discord.ApplicationCommandOptionType.String, name: 'cat_or_cmd', description: 'the category or command' },
            ]
          },
          {
            type: Discord.ApplicationCommandOptionType.Subcommand, name: 'set', description: 'set whether commands are enabled globally or for a category or command',
            options: [
              {
                type: Discord.ApplicationCommandOptionType.String, name: 'scope', description: 'the scope of the setting', required: true,
                choices: [ { name: 'global', value: 'global' }, { name: 'category', value: 'category' }, { name: 'command', value: 'command' }, { name: 'all', value: 'all' } ],
              },
              {
                type: Discord.ApplicationCommandOptionType.String, name: 'value', description: 'whether to enable or disable', required: true,
                choices: [ { name: 'enable', value: 'enable' }, { name: 'disable', value: 'disable' } ],
              },
              { type: Discord.ApplicationCommandOptionType.String, name: 'cat_or_cmd', description: 'the category or command' },
            ],
          },
        ],
      },
    ],
    execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      let guilddata = props.saved.guilds[msg.guild.id];
      
      let silenced = !guilddata.enabled_commands.global ||
        !guilddata.enabled_commands.categories.Administrative ||
        !guilddata.enabled_commands.commands.settings;
      
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);
      
      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;
      
      if (!basicperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
      
      if (rawArgs.length == 0) {
        if (fullperms)
          return common.regCmdResp(o, 'List of settings:\nprefix, confirmkb, badwords, logchannel, mutedrole, roles, overrides, enabledcmds');
        else
          return common.regCmdResp(o, 'List of settings:\nprefix, badwords');
      }
      
      switch (rawArgs[0]) {
        case 'prefix':
          if (rawArgs.length == 1) {
            return common.regCmdResp(o, `The current server prefix is: \`${guilddata.prefix}\`\n\`${guilddata.prefix}settings prefix <newprefix>\` to set.`);
          } else {
            guilddata.prefix = rawArgs.slice(1).join(' ');
            schedulePropsSave();
            return common.regCmdResp(o, `Server prefix set to: \`${guilddata.prefix}\``);
          }
        
        case 'confirmkb':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o, `Confirmation on the kick, ban, and unban commands: ${guilddata.confirm_kb ? '✅' : '❌'}\n\`${guilddata.prefix}settings confirmkb true|yes|false|no\` to set.`);
          } else {
            switch (rawArgs[1]) {
              case 'true': case 'yes':
                guilddata.confirm_kb = true;
                break;
              
              case 'false': case 'no':
                guilddata.confirm_kb = false;
                break;
              
              default:
                return common.regCmdResp(o, `\`${guilddata.prefix}settings confirmkb true|yes|false|no\` to set.`);
            }
            schedulePropsSave();
            return common.regCmdResp(o, `Confirmation on the kick, ban, and unban commands set to: ${guilddata.confirm_kb ? '✅' : '❌'}`);
          }
        
        case 'badwords':
          if (rawArgs.length == 1) {
            return common.regCmdResp(o,
              'To list badwords run `settings badwords list`.\n' +
              'To list info about one badword run `settings badwords list <word>`.\n' +
              'To add a badword run `settings badwords add <word> <retaliation> <enabled> <type> <ignore_admin> [<ignored_role> ...]`.\n' +
              'To remove a badword run `settings badwords remove <word>`.\n' +
              'To modify a badword run `settings badwords modify <word> <retaliation> <enabled> <type> <ignore_admin> [<ignored_role> ...]`.'
            );
          } else {
            switch (rawArgs[1]) {
              case 'list':
                if (rawArgs.length == 2) {
                  return common.regCmdResp(o, guilddata.basic_automod.bad_words.length > 0 ? { embeds: [{ title: 'List of badwords', description: guilddata.basic_automod.bad_words.map(x => x.word).join(', ') }] } : 'No badwords.');
                } else {
                  let word = guilddata.basic_automod.bad_words.filter(x => x.word == rawArgs[2])[0];
                  if (!word) return common.regCmdResp(o, { embeds: [{ title: 'Error', description: `Word ${util.inspect(rawArgs[2])} not found` }] });
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: `Information for badword ${util.inspect(word.word)}`,
                      fields: [
                        { name: 'Retailiation', value: `${word.retaliation}`, inline: false },
                        { name: 'Enabled', value: `${word.enabled}`, inline: true },
                        { name: 'Type', value: `${word.type}`, inline: true },
                        { name: 'Ignore Admin', value: `${word.ignore_admin}`, inline: true },
                        { name: 'Ignored Roles', value: `${word.ignored_roles.length ? word.ignored_roles.map(x => `<@&${x}>`).join(' ') : 'None'}`, inline: false },
                      ],
                    }]
                  });
                }
              
              case 'add': {
                if (rawArgs.length < 8) return common.regCmdResp(o, 'Not enough arguments');
                let type = Number(rawArgs[5]);
                if (!(Number.isSafeInteger(type) && type >= 0 && type < 8 && type % 4 != 3))
                  return common.regCmdResp(o, 'Type must be an integer and any of 0, 1, 2, 4, 5, 6');
                if (guilddata.basic_automod.bad_words.filter(x => x.word == rawArgs[2]).length)
                  return common.regCmdResp(o, { embeds: [{ title: 'Word Already Exists', description: `Word ${util.inspect(rawArgs[5])} already exists` }] });
                guilddata.basic_automod.bad_words.push({
                  enabled: common.stringToBoolean(rawArgs[4]),
                  type,
                  ignore_admin: common.stringToBoolean(rawArgs[6]),
                  ignored_roles: rawArgs[7].split(' ').map(x => common.searchRole(o.guild.roles, x)?.id).filter(x => x),
                  word: rawArgs[2],
                  retaliation: rawArgs[3],
                });
                schedulePropsSave();
                return common.regCmdResp(o, { embeds: [{ title: 'Word Added', description: `Word ${util.inspect(rawArgs[2])} successfully added` }] });
              }
              
              case 'remove': {
                if (rawArgs.length < 3) return common.regCmdResp(o, 'Not enough arguments');
                let index = null;
                for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == rawArgs[2]) {
                    index = i;
                    break;
                  }
                }
                if (index == null) return common.regCmdResp(o, { embeds: [{ title: 'Word Not Found', description: `Word ${util.inspect(rawArgs[2])} not found` }] });
                guilddata.basic_automod.bad_words.splice(index, 1);
                schedulePropsSave();
                return common.regCmdResp(o, { embeds: [{ title: 'Word Removed', description: `Word ${util.inspect(rawArgs[2])} successfully removed` }] });
              }
              
              case 'modify': {
                if (rawArgs.length < 8) return common.regCmdResp(o, 'Not enough arguments');
                let index = null;
                for (let i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == rawArgs[2]) {
                    index = i;
                    break;
                  }
                }
                if (index == null) return common.regCmdResp(o, { embeds: [{ title: 'Word Not Found', description: `Word ${util.inspect(rawArgs[2])} not found` }] });
                let type = Number(rawArgs[5]);
                if (!(Number.isSafeInteger(type) && type >= 0 && type < 8 && type % 4 != 3))
                  return common.regCmdResp(o, 'Type must be an integer and any of 0, 1, 2, 4, 5, 6');
                guilddata.basic_automod.bad_words[index] = {
                  enabled: common.stringToBoolean(rawArgs[4]),
                  type,
                  ignore_admin: common.stringToBoolean(rawArgs[6]),
                  ignored_roles: rawArgs[7].split(' ').map(x => common.searchRole(o.guild.roles, x)?.id).filter(x => x),
                  word: rawArgs[2],
                  retaliation: rawArgs[3],
                };
                schedulePropsSave();
                return common.regCmdResp(o, { embeds: [{ title: 'Word Modified', description: `Word ${util.inspect(rawArgs[2])} successfully modified` }] });
              }
            }
          }
          break;
        
        case 'logchannel':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o,
              'The current logging channel is ' + (guilddata.logging.main ? `<#${guilddata.logging.main}> (id ${guilddata.logging.main})` : 'none') + '.\n' +
              'To set logging channel to this channel run `settings logchannel set`.\n' +
              'To set logging channel to a channel run `settings logchannel set <#channel>`.\n' +
              'To turn off logging run `settings logchannel clear`.'
            );
          } else {
            let logchannel = rawArgs.slice(1).join(' ');
            if (logchannel == 'clear') {
              guilddata.logging.main = null;
              schedulePropsSave();
              return common.regCmdResp(o, 'Logging disabled.');
            } else if (logchannel == 'set') {
              guilddata.logging.main = msg.channel.id;
              schedulePropsSave();
              return common.regCmdResp(o, `Logging channel set to <#${msg.channel.id}> (id ${msg.channel.id}).`);
            } else if (/^set <#[0-9]+>$/.test(logchannel)) {
              logchannel = logchannel.slice(6, logchannel.length - 1);
              if (msg.guild.channels.cache.get(logchannel)) {
                guilddata.logging.main = logchannel;
                schedulePropsSave();
                return common.regCmdResp(o, `Logging channel set to <#${logchannel}> (id ${logchannel}).`);
              } else {
                return common.regCmdResp(o, 'Channel nonexistent or not in this server.');
              }
            } else {
              return common.regCmdResp(o,
                'To set logging channel to this channel run `settings logchannel set`.\n' +
                'To set logging channel to a channel run `settings logchannel set <#channel>`.\n' +
                'To turn off logging run `settings logchannel clear`.'
              );
            }
          }
        
        case 'mutedrole':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o, {
              embeds: [{
                title: 'Muted Role',
                description: `The muted role is currently set to: ${guilddata.mutedrole ? '<@&' + guilddata.mutedrole + '>' : 'nothing'}\n` +
                  'To change, run `settings mutedrole set <@mention|id|name|query>`.\nTo reset, run `settings mutedrole set`.',
              }]
            });
          } else {
            if (rawArgs[1] == 'set') {
              if (rawArgs.length == 2) {
                if (guilddata.mutedrole) {
                  guilddata.mutedrole = null;
                  schedulePropsSave();
                  return common.regCmdResp(o, 'Muted role reset.');
                } else {
                  return common.regCmdResp(o, 'Muted role not set in the first place.');
                }
              } else {
                let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return common.regCmdResp(o, {
                    embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${msg.guild.roles.cache.map(x => '<@&' + x.id + '>').join(' ')}` }]
                  });
                } else {
                  guilddata.mutedrole = role.id;
                  schedulePropsSave();
                  return common.regCmdResp(o, { embeds: [{ title: 'Muted Role', description: `<@&${role.id}> set as muted role.` }] });
                }
              }
            } else {
              return common.regCmdResp(o, 'Invalid option. To change, run `settings mutedrole set <@mention|id|name|query>`.\nTo reset, run `settings mutedrole set`.');
            }
          }
        
        case 'roles':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o,
              'This command configures the bot-level permissions certain roles have, ranging from music command access to muting, locking, kicking, banning, and bot settings control.\n\n' +
              'To view roles with bot-level permissions set, run `settings roles view`.\n' +
              'To view the permissions for one role, run `settings roles view <@mention|name|query>`\n' +
              'To create permissions for a role, run `settings roles init <@mention|name|query>`\n' +
              'To remove permissions for a role, run `settings roles clear <@mention|name|query>`\n' +
              'To set a specific permission for a role, run `settings roles setperms <@mention|name|query> enable/disable [<permission name|permission id> ...]`',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                if (rawArgs.length == 2) {
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Roles',
                      description: 'Roles with bot-level permissions:\n' + Object.keys(guilddata.perms).map(x => `<@&${x}>`),
                    }]
                  });
                } else {
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
                  if (Array.isArray(role)) {
                    return common.regCmdResp(o, {
                      embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                    });
                  } else {
                    if (!guilddata.perms[role.id])
                      return common.regCmdResp(o, {
                        embeds: [{
                          title: 'No Permissions',
                          description: `No bot-level permissions for role <@&${role.id}>.`
                        }]
                      });
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Permissions',
                        description: `Permissions for <@&${role.id}>:\n` +
                          common.getBotPermissionsArray(guilddata.perms[role.id]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n')
                      }]
                    });
                  }
                }
              
              case 'init': {
                let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return common.regCmdResp(o, {
                    embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                  });
                } else {
                  if (guilddata.perms[role.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Permissions Exist',
                        description: `Bot-level permissions already exist for role <@&${role.id}>.`
                      }]
                    });
                  guilddata.perms[role.id] = guilddata.perms[msg.guild.id];
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Permissions Created',
                      description: `Permissions created for role <@&${role.id}>.`
                    }]
                  });
                }
              }
              
              case 'clear': {
                let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return common.regCmdResp(o, {
                    embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                  });
                } else {
                  if (!guilddata.perms[role.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role.id}>.`
                      }]
                    });
                  if (role.id != msg.guild.id)
                    delete guilddata.perms[role.id];
                  else
                    guilddata.perms[role.id] = common.constants.botRolePermDef;
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role.id}>.`
                    }]
                  });
                }
              }
              
              case 'setperms': {
                if (rawArgs[3] != 'enable' && rawArgs[3] != 'disable')
                  return common.regCmdResp(o, 'Invalid option. Run `settings roles` to view options.');
                
                let role = common.searchRoles(msg.guild.roles, rawArgs[2]);
                if (Array.isArray(role)) {
                  return common.regCmdResp(o, {
                    embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                  });
                } else {
                  if (!guilddata.perms[role.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role.id}>.`
                      }]
                    });
                  let changedPerms = [];
                  let permsToChange = rawArgs.slice(4).map(perm => {
                    let nperm = Number(perm);
                    if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                    else return common.constants.botRolePermBits[perm];
                  }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
                  if (rawArgs[3] == 'enable')
                    guilddata.perms[role.id] |= permsToChange;
                  else
                    guilddata.perms[role.id] &= ~permsToChange;
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Permissions Updated',
                      description: `Permissions ${changedPerms.map(x => `'${x}'`).join(', ')} ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'} for role <@&${role.id}>.`
                    }]
                  });
                }
              }
              
              default:
                return common.regCmdResp(o, 'Invalid option. Run `settings roles` to view options.');
            }
          }
        
        case 'overrides':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o,
              'This command configures the bot-level permission overrides for certain channels.\n\n' +
              'To view channels with overrides, run `settings overrides view`.\n' +
              'To view override roles for a channel, run `settings overrides view #channel`.\n' +
              'To view the permissions for one role on one channel, run `settings overrides view #channel <@mention|name|query>`\n' +
              'To create overrides for a channel, run `settings overrides init #channel`\n' +
              'To remove overrides for a channel, run `settings overrides clear #channel`\n' +
              'To create permissions for a role, run `settings overrides init #channel <@mention|name|query>`\n' +
              'To remove permissions for a role, run `settings overrides clear #channel <@mention|name|query>`\n' +
              'To set a specific permission for a role, run `settings overrides setperms #channel <@mention|name|query> enable/disable/reset [<permission name|permission id> ...]`',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                if (rawArgs.length == 2) {
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Channels',
                      description: 'Channels with bot-level permission overrides:\n' + Object.keys(guilddata.overrides).map(x => `<#${x}>`),
                    }]
                  });
                } else if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }]
                    });
                  }
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Roles',
                      description: `Roles with bot-level permission overrides for <#${channel.id}>:\n` + Object.keys(guilddata.overrides[channel.id]).map(x => `<@&${x}>`),
                    }]
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }]
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return common.regCmdResp(o, {
                      embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                    });
                  } else {
                    if (!guilddata.overrides[channel.id][role.id])
                      return common.regCmdResp(o, {
                        embeds: [{
                          title: 'No Permissions',
                          description: `No bot-level overrides in channel <#${channel.id}> for role <@&${role.id}>.`
                        }]
                      });
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Permissions',
                        description: `Permissions for <@&${role.id}>:\n` +
                          common.getBotPermissionsArray(guilddata.overrides[channel.id][role.id], true).map(x => `${x[1] > 0 ? '🟩' : x[1] < 0 ? '🟥' : '⬛'} ${x[0]}`).join('\n')
                      }]
                    });
                  }
                }
              
              case 'init':
                if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (guilddata.overrides[channel.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Overrides Exist',
                        description: `Bot-level overrides already exist for channel <#${channel.id}>.`
                      }]
                    });
                  guilddata.overrides[channel.id] = {};
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Overrides Created',
                      description: `Overrides created for channel <#${channel.id}>.`
                    }]
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }]
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return common.regCmdResp(o, {
                      embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                    });
                  } else {
                    if (guilddata.overrides[channel.id][role.id])
                      return common.regCmdResp(o, {
                        embeds: [{
                          title: 'Overrides Exist',
                          description: `Bot-level overrides already exist in channel <#${channel.id}> for role <@&${role.id}>.`
                        }]
                      });
                    guilddata.overrides[channel.id][role.id] = { allows: 0, denys: 0 };
                    schedulePropsSave();
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Overrides Created',
                        description: `Overrides created in channel <#${channel.id}> for role <@&${role.id}>.`
                      }]
                    });
                  }
                }
              
              case 'clear':
                if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Overrides Do Not Exist',
                        description: `Bot-level overrides do not exist for channel <#${channel.id}>.`
                      }]
                    });
                  delete guilddata.overrides[channel.id];
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Overrides Cleared',
                      description: `Overrides cleared for channel <#${channel.id}>.`
                    }]
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                  if (!channel) {
                    return common.regCmdResp(o, 'Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }]
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return common.regCmdResp(o, {
                      embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                    });
                  } else {
                    if (!guilddata.overrides[channel.id][role.id])
                      return common.regCmdResp(o, {
                        embeds: [{
                          title: 'Overrides Do Not Exist',
                          description: `Bot-level overrides do not exist in channel <#${channel.id}> for role <@&${role.id}>.`
                        }]
                      });
                    delete guilddata.overrides[channel.id][role.id];
                    schedulePropsSave();
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Overrides Cleared',
                        description: `Overrides cleared in channel <#${channel.id}> for role <@&${role.id}>.`
                      }]
                    });
                  }
                }
              
              case 'setperms': {
                if (rawArgs[4] != 'enable' && rawArgs[4] != 'disable' && rawArgs[4] != 'reset')
                  return common.regCmdResp(o, 'Invalid option. Run `settings overrides` to view options.');
                
                let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])?.[1]);
                if (!channel) {
                  return common.regCmdResp(o, 'Error: no such channel');
                }
                if (!guilddata.overrides[channel.id]) {
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'No Overrides',
                      description: `No bot-level overrides for channel <#${channel.id}>.`
                    }]
                  });
                }
                let role = common.searchRoles(msg.guild.roles, rawArgs[3]);
                if (Array.isArray(role)) {
                  return common.regCmdResp(o, {
                    embeds: [{ title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }]
                  });
                } else {
                  if (!guilddata.overrides[channel.id][role.id])
                    return common.regCmdResp(o, {
                      embeds: [{
                        title: 'Overrides Do Not Exist',
                        description: `Bot-level overrides do not exist in channel <#${channel.id}> for role <@&${role.id}>.`
                      }]
                    });
                  let changedPerms = [];
                  let permsToChange = rawArgs.slice(5).map(perm => {
                    let nperm = Number(perm);
                    if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                    else return common.constants.botRolePermBits[perm];
                  }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
                  switch (rawArgs[4]) {
                    case 'enable':
                      guilddata.overrides[channel.id][role.id].allows |= permsToChange;
                      guilddata.overrides[channel.id][role.id].denys &= ~permsToChange;
                      break;
                    case 'disable':
                      guilddata.overrides[channel.id][role.id].denys |= permsToChange;
                      guilddata.overrides[channel.id][role.id].allows &= ~permsToChange;
                      break;
                    case 'reset':
                      guilddata.overrides[channel.id][role.id].allows &= ~permsToChange;
                      guilddata.overrides[channel.id][role.id].denys &= ~permsToChange;
                      break;
                  }
                  schedulePropsSave();
                  return common.regCmdResp(o, {
                    embeds: [{
                      title: 'Overrides Updated',
                      description: `Overrides ${changedPerms.map(x => `'${x}'`).join(', ')} ${rawArgs[1] == 'enable' ? 'enabled' : rawArgs[1] == 'disable' ? 'disabled' : 'reset'} in channel <#${channel.id}> for role <@&${role.id}>.`
                    }]
                  });
                }
              }
              
              default:
                return common.regCmdResp(o, 'Invalid option. Run `settings overrides` to view options.');
            }
          }
        
        case 'enabledcmds':
          if (!fullperms) return silenced ? null : common.regCmdResp(o, 'You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return common.regCmdResp(o,
              'This command configures which commands are enabled.\n\n' +
              'To view whether commands are enabled globally, run `settings enabledcmds view global`.\n' +
              'To view whether a particular command or category is enabled, run `settings enabledcmds view <\'category\'/\'command\'> <command/category>`.\n' +
              'To turn on or off commands globally, run `settings enabledcmds set global <\'enable\'/\'disable\'>`.\n' +
              'To turn on or off a particular command or category, run `settings enabledcmds set <\'category\'/\'command\'> <\'enable\'/\'disable\'> <command/category>`.\n' +
              'To enable or disable everything, run `settings enabledcmds set all <\'enable\'/\'disable\'>`.',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                switch (rawArgs[2]) {
                  case 'global':
                    return common.regCmdResp(o, `Commands are globally ${guilddata.enabled_commands.global ? 'enabled' : 'disabled'}.`);
                  
                  case 'category': {
                    let category = guilddata.enabled_commands.categories[rawArgs.slice(3).join(' ')];
                    if (category != null) {
                      return common.regCmdResp(o, `The category '${rawArgs.slice(3).join(' ')}' is ${category ? 'enabled' : 'disabled'}.`);
                    } else {
                      return common.regCmdResp(o, `The category '${rawArgs.slice(3).join(' ')}' does not exist.`);
                    }
                  }
                  
                  case 'command': {
                    let command = guilddata.enabled_commands.commands[rawArgs.slice(3).join(' ')];
                    if (command != null) {
                      return common.regCmdResp(o, `The command '${rawArgs.slice(3).join(' ')}' is ${command ? 'enabled' : 'disabled'}.`);
                    } else {
                      return common.regCmdResp(o, `The command '${rawArgs.slice(3).join(' ')}' does not exist.`);
                    }
                  }
                  
                  default:
                    return common.regCmdResp(o, 'Invalid option. Run `settings enabledcmds` to view options.');
                }
              
              case 'set':
                switch (rawArgs[2]) {
                  case 'global':
                    guilddata.enabled_commands.global = rawArgs[3] == 'enable';
                    schedulePropsSave();
                    return common.regCmdResp(o, `Global commands have been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                  
                  case 'category': {
                    let category = guilddata.enabled_commands.categories[rawArgs[4]];
                    if (category != null) {
                      guilddata.enabled_commands.categories[rawArgs[4]] = rawArgs[3] == 'enable';
                      schedulePropsSave();
                      return common.regCmdResp(o, `The category '${rawArgs[4]}' has been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return common.regCmdResp(o, `The category '${rawArgs[4]}' does not exist.`);
                    }
                  }
                  
                  case 'command': {
                    let command = guilddata.enabled_commands.commands[rawArgs[4]];
                    if (command != null) {
                      guilddata.enabled_commands.commands[rawArgs[4]] = rawArgs[3] == 'enable';
                      schedulePropsSave();
                      return common.regCmdResp(o, `The command '${rawArgs[4]}' has been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return common.regCmdResp(o, `The command '${rawArgs[4]}' does not exist.`);
                    }
                  }
                  
                  case 'all': {
                    let val = rawArgs[3] == 'enable';
                    guilddata.enabled_commands.global = val;
                    Object.keys(guilddata.enabled_commands.categories)
                      .forEach(x => guilddata.enabled_commands.categories[x] = val);
                    Object.keys(guilddata.enabled_commands.commands)
                      .forEach(x => guilddata.enabled_commands.commands[x] = val);
                    schedulePropsSave();
                    return common.regCmdResp(o, `All commands and categories have been ${val ? 'enabled' : 'disabled'}.`);
                  }
                }
                break;
              
              default:
                return common.regCmdResp(o, 'Invalid option. Run `settings enabledcmds` to view options.');
            }
          }
          break;
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      let guilddata = props.saved.guilds[o.guild.id];
      
      let silenced = !guilddata.enabled_commands.global ||
        !guilddata.enabled_commands.categories.Administrative ||
        !guilddata.enabled_commands.commands.settings;
      
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);
      
      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;
      
      if (!basicperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
      
      switch (args[0].name) {
        case 'prefix':
          if (!args[0].options[0]) {
            return common.slashCmdResp(o, true, `The current server prefix is: \`${guilddata.prefix}\``);
          } else {
            guilddata.prefix = args[0].options[0].value;
            schedulePropsSave();
            return common.slashCmdResp(o, false, `Server prefix set to: \`${guilddata.prefix}\``);
          }
        
        case 'confirmkb':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
          if (!args[0].options[0]) {
            return common.slashCmdResp(o, true, `Confirmation on the kick, ban, and unban commands: ${guilddata.confirm_kb ? '✅' : '❌'}.`);
          } else {
            guilddata.confirm_kb = args[0].options[0].value;
            schedulePropsSave();
            return common.slashCmdResp(o, false, `Confirmation on the kick, ban, and unban commands set to: ${guilddata.confirm_kb ? '✅' : '❌'}`);
          }
        
        case 'badwords':
          switch (args[0].options[0].name) {
            case 'list':
              if (!args[0].options[0].options[0]) {
                return common.slashCmdResp(o, true, 'Badwords: ' + guilddata.basic_automod.bad_words.map(x => x.word).join(', '));
              } else {
                let word = guilddata.basic_automod.bad_words.filter(x => x.word == args[0].options[0].options[0].value)[0];
                if (!word) return common.slashCmdResp(o, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
                return common.slashCmdResp(o, true,
                  `Information for badword ${util.inspect(word.word)}:\n` +
                  `Retailiation: ${word.retaliation}\n` +
                  `Enabled: ${word.enabled}\n` +
                  `Type: ${word.type}\n` +
                  `Ignore Admin: ${word.ignore_admin}\n` +
                  `Ignored Roles: ${word.ignored_roles.length ? word.ignored_roles.map(x => `<@&${x}>`).join(' ') : 'None'}`);
              }
            
            case 'add':
              if (guilddata.basic_automod.bad_words.filter(x => x.word == args[0].options[0].options[0].value).length)
                return common.slashCmdResp(o, true, `Word ${util.inspect(args[0].options[0].options[0].value)} already exists`);
              guilddata.basic_automod.bad_words.push({
                enabled: args[0].options[0].options.filter(x => x != null && x.name == 'enabled')[0]?.value ?? true,
                type: Number(args[0].options[0].options[2].value),
                ignore_admin: args[0].options[0].options.filter(x => x != null && x.name == 'ignore_admin')[0]?.value ?? false,
                ignored_roles: (() => {
                  let val = args[0].options[0].options.filter(x => x != null && x.name == 'ignored_roles')[0]?.value;
                  return val ? val.split(' ').map(x => common.searchRole(o.guild.roles, x)?.id).filter(x => x) : [];
                })(),
                word: args[0].options[0].options[0].value,
                retaliation: args[0].options[0].options[1].value,
              });
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully added`);
            
            case 'remove': {
              let index = null;
              for (let i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                if (guilddata.basic_automod.bad_words[i].word == args[0].options[0].options[0].value) {
                  index = i;
                  break;
                }
              }
              if (index == null) return common.slashCmdResp(o, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
              guilddata.basic_automod.bad_words.splice(index, 1);
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully removed`);
            }
            
            case 'modify': {
              let index = null;
              for (let i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                if (guilddata.basic_automod.bad_words[i].word == args[0].options[0].options[0].value) {
                  index = i;
                  break;
                }
              }
              if (index == null) return common.slashCmdResp(o, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
              guilddata.basic_automod.bad_words[index] = {
                enabled: args[0].options[0].options.filter(x => x != null && x.name == 'enabled')[0]?.value ?? guilddata.basic_automod.bad_words[index].enabled,
                type: Number(args[0].options[0].options.filter(x => x != null && x.name == 'type')[0]?.value ?? guilddata.basic_automod.bad_words[index].type),
                ignore_admin: args[0].options[0].options.filter(x => x != null && x.name == 'ignore_admin')[0]?.value ?? guilddata.basic_automod.bad_words[index].ignore_admin,
                ignored_roles: (() => {
                  let val = args[0].options[0].options.filter(x => x != null && x.name == 'ignored_roles')[0]?.value;
                  return val ? val.split(' ').map(x => common.searchRole(o.guild.roles, x)?.id).filter(x => x) : guilddata.basic_automod.bad_words[index].ignored_roles;
                })(),
                word: args[0].options[0].options[0].value,
                retaliation: args[0].options[0].options.filter(x => x != null && x.name == 'retaliation')[0]?.value ?? guilddata.basic_automod.bad_words[index].retaliation,
              };
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully modified`);
            }
          }
          break;
        
        case 'logchannel':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, false, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              return common.slashCmdResp(o, true, 'The current logging channel is ' + (guilddata.logging.main ? `<#${guilddata.logging.main}> (id ${guilddata.logging.main})` : 'none') + '.');
            
            case 'set':
              if (!args[0].options[0].options[0]) {
                guilddata.logging.main = o.channel.id;
                schedulePropsSave();
                return common.slashCmdResp(o, false, `Logging channel set to <#${o.channel.id}> (id ${o.channel.id}).`);
              } else {
                if (o.guild.channels.cache.get(args[0].options[0].options[0].value)) {
                  guilddata.logging.main = args[0].options[0].options[0].value;
                  schedulePropsSave();
                  return common.slashCmdResp(o, false, `Logging channel set to <#${args[0].options[0].options[0].value}> (id ${args[0].options[0].options[0].value}).`);
                } else {
                  return common.slashCmdResp(o, true, 'Channel nonexistent or not in this server.');
                }
              }
            
            case 'clear':
              guilddata.logging.main = null;
              schedulePropsSave();
              return common.slashCmdResp(o, false, 'Logging disabled.');
          }
          break;
        
        case 'mutedrole':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              return common.slashCmdResp(o, true, `The muted role is currently set to: ${guilddata.mutedrole ? '<@&' + guilddata.mutedrole + '>' : 'nothing'}`);
            
            case 'set':
              if (!args[0].options[0].options[0]) {
                if (guilddata.mutedrole) {
                  guilddata.mutedrole = null;
                  schedulePropsSave();
                  return common.slashCmdResp(o, false, 'Muted role reset.');
                } else {
                  return common.slashCmdResp(o, false, 'Muted role not set in the first place.');
                }
              } else {
                guilddata.mutedrole = args[0].options[0].options[0].value;
                schedulePropsSave();
                return common.slashCmdResp(o, false, `<@&${args[0].options[0].options[0].value}> set as muted role.`);
              }
          }
          break;
        
        case 'roles':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view': {
              if (!args[0].options[0].options[0]) {
                return common.slashCmdResp(o, true, 'Roles with bot-level permissions:\n' + Object.keys(guilddata.perms).map(x => `<@&${x}>`));
              } else {
                let roleId = args[0].options[0].options[0].value;
                if (!guilddata.perms[roleId])
                  return common.slashCmdResp(o, true, `No bot-level permissions for role <@&${roleId}>.`);
                return common.slashCmdResp(o, true, `Permissions for <@&${roleId}>:\n` +
                  common.getBotPermissionsArray(guilddata.perms[roleId]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n'));
              }
            }
            
            case 'init': {
              let roleId = args[0].options[0].options[0].value;
              if (guilddata.perms[roleId])
                return common.slashCmdResp(o, false, `Bot-level permissions already exist for role <@&${roleId}>.`);
              guilddata.perms[roleId] = guilddata.perms[o.guild.id];
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Permissions created for role <@&${roleId}>.`);
            }
            
            case 'clear': {
              let roleId = args[0].options[0].options[0].value;
              if (!guilddata.perms[roleId])
                return common.slashCmdResp(o, false, `Bot-level permissions do not exist for role <@&${roleId}>.`);
              if (roleId != o.guild.id)
                delete guilddata.perms[roleId];
              else
                guilddata.perms[roleId] = common.constants.botRolePermDef;
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Permissions cleared for role <@&${roleId}>.`);
            }
            
            case 'setperms': {
              let roleId = args[0].options[0].options[0].value;
              if (!guilddata.perms[roleId])
                return common.slashCmdResp(o, false, `Bot-level permissions do not exist for role <@&${roleId}>.`);
              let changedPerms = [];
              let permsToChange = args[0].options[0].options[2].value.split(' ').map(perm => {
                let nperm = Number(perm);
                if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                else return common.constants.botRolePermBits[perm];
              }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
              if (args[0].options[0].options[1].value == 'enable')
                guilddata.perms[roleId] |= permsToChange;
              else
                guilddata.perms[roleId] &= ~permsToChange;
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Permissions ${changedPerms.map(x => `'${x}'`).join(', ')} ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'} for role <@&${roleId}>.`);
            }
          }
          break;
        
        case 'overrides':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              if (args[0].options[0].options[1]) {
                if (!args[0].options[0].options[0])
                  return common.slashCmdResp(o, true, 'Role parameter by itself cannot be specified');
                let channelId = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelId])
                  return common.slashCmdResp(o, true, `No bot-level overrides for channel <#${channelId}>.`);
                let roleId = args[0].options[0].options[1].value;
                if (!guilddata.overrides[channelId][roleId])
                  return common.slashCmdResp(o, true, `No bot-level overrides in channel <#${channelId}> for role <@&${roleId}>.`);
                return common.slashCmdResp(o, true, `Permissions for <@&${roleId}>:\n` +
                  common.getBotPermissionsArray(guilddata.overrides[channelId][roleId], true).map(x => `${x[1] > 0 ? '🟩' : x[1] < 0 ? '🟥' : '⬛'} ${x[0]}`).join('\n'));
              } else if (args[0].options[0].options[0]) {
                let channelId = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelId])
                  return common.slashCmdResp(o, true, `No bot-level overrides for channel <#${channelId}>.`);
                return common.slashCmdResp(o, true, `Roles with bot-level permission overrides for <#${channelId}>:\n` + Object.keys(guilddata.overrides[channelId]).map(x => `<@&${x}>`));
              } else {
                return common.slashCmdResp(o, true, 'Channels with bot-level permission overrides:\n' + Object.keys(guilddata.overrides).map(x => `<#${x}>`));
              }
            
            case 'init':
              if (args[0].options[0].options[1]) {
                let channelId = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelId])
                  return common.slashCmdResp(o, false, `No bot-level overrides for channel <#${channelId}>.`);
                let roleId = args[0].options[0].options[1].value;
                if (guilddata.overrides[channelId][roleId])
                  return common.slashCmdResp(o, false, `Bot-level overrides already exist in channel <#${channelId}> for role <@&${roleId}>.`);
                guilddata.overrides[channelId][roleId] = { allows: 0, denys: 0 };
                schedulePropsSave();
                return common.slashCmdResp(o, false, `Overrides created in channel <#${channelId}> for role <@&${roleId}>.`);
              } else {
                let channelId = args[0].options[0].options[0].value;
                if (guilddata.overrides[channelId])
                  return common.slashCmdResp(o, false, `Bot-level overrides already exist for channel <#${channelId}>.`);
                guilddata.overrides[channelId] = {};
                schedulePropsSave();
                return common.slashCmdResp(o, false, `Overrides created for channel <#${channelId}>.`);
              }
            
            case 'clear':
              if (args[0].options[0].options[1]) {
                let channelId = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelId])
                  return common.slashCmdResp(o, false, `No bot-level overrides for channel <#${channelId}>.`);
                let roleId = args[0].options[0].options[1].value;
                if (!guilddata.overrides[channelId][roleId])
                  return common.slashCmdResp(o, false, `Bot-level overrides do not exist in channel <#${channelId}> for role <@&${roleId}>.`);
                delete guilddata.overrides[channelId][roleId];
                schedulePropsSave();
                return common.slashCmdResp(o, false, `Overrides cleared in channel <#${channelId}> for role <@&${roleId}>.`);
              } else {
                let channelId = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelId])
                  return common.slashCmdResp(o, false, `Bot-level overrides do not exist for channel <#${channelId}>.`);
                delete guilddata.overrides[channelId];
                schedulePropsSave();
                return common.slashCmdResp(o, false, `Overrides cleared for channel <#${channelId}>.`);
              }
            
            case 'setperms': {
              let channelId = args[0].options[0].options[0].value;
              if (!guilddata.overrides[channelId])
                return common.slashCmdResp(o, false, `No bot-level overrides for channel <#${channelId}>.`);
              let roleId = args[0].options[0].options[1].value;
              if (!guilddata.overrides[channelId][roleId])
                return common.slashCmdResp(o, false, `Bot-level overrides do not exist in channel <#${channelId}> for role <@&${roleId}>.`);
              let changedPerms = [];
              let permsToChange = args[0].options[0].options[3].value.split(' ').map(perm => {
                let nperm = Number(perm);
                if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                else return common.constants.botRolePermBits[perm];
              }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
              switch (args[0].options[0].options[2].value) {
                case 'enable':
                  guilddata.overrides[channelId][roleId].allows |= permsToChange;
                  guilddata.overrides[channelId][roleId].denys &= ~permsToChange;
                  break;
                case 'disable':
                  guilddata.overrides[channelId][roleId].denys |= permsToChange;
                  guilddata.overrides[channelId][roleId].allows &= ~permsToChange;
                  break;
                case 'reset':
                  guilddata.overrides[channelId][roleId].allows &= ~permsToChange;
                  guilddata.overrides[channelId][roleId].denys &= ~permsToChange;
                  break;
              }
              schedulePropsSave();
              return common.slashCmdResp(o, false, `Overrides ${changedPerms.map(x => `'${x}'`).join(', ')} ${args[0].options[0].options[2].value == 'enable' ? 'enabled' : args[0].options[0].options[2].value == 'disable' ? 'disabled' : 'reset'} in channel <#${channelId}> for role <@&${roleId}>.`);
            }
          }
          break;
        
        case 'enabledcmds':
          if (!fullperms) return silenced ? null : common.slashCmdResp(o, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              switch (args[0].options[0].options[0].value) {
                case 'global':
                  return common.slashCmdResp(o, true, `Commands are globally ${guilddata.enabled_commands.global ? 'enabled' : 'disabled'}.`);
                
                case 'category': {
                  if (!args[0].options[0].options[1])
                    return common.slashCmdResp(o, true, 'Category must be specified.');
                  let category = guilddata.enabled_commands.categories[args[0].options[0].options[1].value];
                  if (category != null) {
                    return common.slashCmdResp(o, true, `The category '${args[0].options[0].options[1]?.value}' is ${category ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(o, true, `The category '${args[0].options[0].options[1]?.value}' does not exist.`);
                  }
                }
                
                case 'command': {
                  if (!args[0].options[0].options[1])
                    return common.slashCmdResp(o, true, 'Command must be specified.');
                  let command = guilddata.enabled_commands.commands[args[0].options[0].options[1].value];
                  if (command != null) {
                    return common.slashCmdResp(o, true, `The command '${args[0].options[0].options[1]?.value}' is ${command ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(o, true, `The command '${args[0].options[0].options[1]?.value}' does not exist.`);
                  }
                }
              }
              break;
            
            case 'set':
              switch (args[0].options[0].options[0].value) {
                case 'global':
                  guilddata.enabled_commands.global = args[0].options[0].options[1].value == 'enable';
                  schedulePropsSave();
                  return common.slashCmdResp(o, false, `Global commands have been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                
                case 'category': {
                  if (!args[0].options[0].options[2])
                    return common.slashCmdResp(o, true, 'Category must be specified.');
                  let category = guilddata.enabled_commands.categories[args[0].options[0].options[2].value];
                  if (category != null) {
                    guilddata.enabled_commands.categories[args[0].options[0].options[2].value] = args[0].options[0].options[1].value == 'enable';
                    schedulePropsSave();
                    return common.slashCmdResp(o, false, `The category '${args[0].options[0].options[2].value}' has been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(o, false, `The category '${args[0].options[0].options[2].value}' does not exist.`);
                  }
                }
                
                case 'command': {
                  if (!args[0].options[0].options[2])
                    return common.slashCmdResp(o, true, 'Command must be specified.');
                  let command = guilddata.enabled_commands.commands[args[0].options[0].options[2].value];
                  if (command != null) {
                    guilddata.enabled_commands.commands[args[0].options[0].options[2].value] = args[0].options[0].options[1].value == 'enable';
                    schedulePropsSave();
                    return common.slashCmdResp(o, false, `The command '${args[0].options[0].options[2].value}' has been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(o, false, `The command '${args[0].options[0].options[2].value}' does not exist.`);
                  }
                }
                
                case 'all': {
                  let val = args[0].options[0].options[1].value == 'enable';
                  guilddata.enabled_commands.global = val;
                  Object.keys(guilddata.enabled_commands.categories)
                    .forEach(x => guilddata.enabled_commands.categories[x] = val);
                  Object.keys(guilddata.enabled_commands.commands)
                    .forEach(x => guilddata.enabled_commands.commands[x] = val);
                  schedulePropsSave();
                  return common.slashCmdResp(o, false, `All commands and categories have been ${val ? 'enabled' : 'disabled'}.`);
                }
              }
              break;
          }
          break;
      }
    },
  },
];
