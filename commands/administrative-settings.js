module.exports = [
  {
    name: 'settings',
    full_string: false,
    description: '`!settings` to see available settings\n`!settings <setting>` for help on a specific setting',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);

      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;

      if (!basicperms) return msg.channel.send('You do not have permission to run this command.');

      if (args.length == 0) {
        return msg.channel.send(`List of settings:\nprefix, mutedrole, roles, enabledcmds`);
      }

      switch (args[0]) {
        case 'prefix':
          if (args.length == 1) {
            return msg.channel.send(`The current server prefix is: \`${props.saved.guilds[msg.guild.id].prefix}\`\n\`${props.saved.guilds[msg.guild.id].prefix}settings prefix <newprefix>\` to set`);
          } else {
            props.saved.guilds[msg.guild.id].prefix = args.slice(1).join(' ');
            schedulePropsSave();
            return msg.channel.send(`Server prefix set to: \`${props.saved.guilds[msg.guild.id].prefix}\``);
          }
          break;

        case 'mutedrole':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send({
              embed: {
                title: 'Muted Role',
                description: `The muted role is currently set to: ${props.saved.guilds[msg.guild.id].mutedrole ? '<@&' + props.saved.guilds[msg.guild.id].mutedrole + '>' : 'nothing'}\n` +
                  `To change, run \`settings mutedrole set <@mention|id|name|query>\`.\nTo reset, run \`settings mutedrole reset\`.`,
              }
            });
          } else {
            if (args[1] == 'set') {
              let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
              if (Array.isArray(role)) {
                return msg.channel.send({
                  embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${roles.map(x => '<@&' + x.id + '>').join(' ')}` }
                });
              } else {
                props.saved.guilds[msg.guild.id].mutedrole = role.id;
                return msg.channel.send({ embed: { title: 'Muted Role', description: `<@&${role.id}> set as muted role.` } });
              }
            } else if (args[1] == 'reset') {
              if (props.saved.guilds[msg.guild.id].mutedrole) {
                props.saved.guilds[msg.guild.id].mutedrole = null;
                return msg.channel.send('Muted role reset.');
              } else {
                return msg.channel.send('Muted role not set in the first place.');
              }
            } else {
              return msg.channel.send('Invalid option. To change, run `settings mutedrole set <@mention|id|name|query>`.\nTo reset, run `settings mutedrole reset`.');
            }
          }
          break;

        case 'roles':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures the bot-level permissions certain roles have, ranging from music command access to muting, locking, kicking, banning, and bot settings control.\n\n' +
              'To view roles with bot-level permissions set, run `settings roles view`.\n' +
              'To view the permissions for one role, run `settings roles view <@mention|name|query>\n' +
              'To create permissions for a role, run `settings roles init <@mention|name|query>\n' +
              'To remove permissions for a role, run `settings roles clear <@mention|name|query>\n' +
              'To set a specific permission for a role, run `settings roles setperm <@mention|name|query> <permission name|permission id> [<2nd permission name|permission id> ...] <\'enable\'/\'disable\'>`',
            );
          } else {
            switch (args[1]) {
              case 'view':
                if (args.length == 2) {
                  return msg.channel.send({
                    embed: {
                      title: 'Roles',
                      description: 'Roles with bot-level permissions:\n' + Object.keys(props.saved.guilds[msg.guild.id].perms).map(x => `<@&${x}>`),
                    }
                  });
                } else {
                  let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (!props.saved.guilds[msg.guild.id].perms[role.id])
                      return msg.channel.send({
                        embed: {
                          title: 'No Permissions',
                          description: `No bot-level permissions for role <@&${role.id}>.`
                        }
                      });
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions',
                        description: `Permissions for <@&${role.id}>:\n` + 
                          common.getBotPermissionsArray(props.saved.guilds[msg.guild.id].perms[role.id]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n')
                      }
                    });
                  }
                }
                break;

              case 'init':
                let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (props.saved.guilds[msg.guild.id].perms[role.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Exist',
                        description: `Bot-level permissions already exist for role <@&${role.id}>.`
                      }
                    });
                  props.saved.guilds[msg.guild.id].perms[role.id] = props.saved.guilds[msg.guild.id].perms[msg.guild.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Created',
                      description: `Permissions created for role <@&${role.id}>`
                    }
                  });
                }
                break;

              case 'clear':
                let role2 = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                if (Array.isArray(role2)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role2.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!props.saved.guilds[msg.guild.id].perms[role2.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role2.id}>.`
                      }
                    });
                  delete props.saved.guilds[msg.guild.id].perms[role2.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role2.id}>`
                    }
                  });
                }
                break;

              case 'setperm':
                let role3 = common.searchRoles(msg.guild.roles, args[2]);
                if (Array.isArray(role3)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role3.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!props.saved.guilds[msg.guild.id].perms[role3.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role3.id}>.`
                      }
                    });
                  let permsToChange = args.slice(3, args.length - 1).map(perm => {

                  }).filter(x => x != null);
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role3.id}>`
                    }
                  });
                }
                break;

              default:
                return msg.channel.send('Invalid option. Run `settings roles` to view options.');
                break;
            }
          }
          break;

        case 'enabledcmds':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures which commands are enabled.\n\n' +
              'To view whether commands are enabled globally, run `settings enabledcmds view global`.\n' +
              'To view whether a particular command or category is enabled, run `settings enabledcmds view <\'category\'/\'command\'> <command/category>`.\n' +
              'To turn on or off whether commands are enabled globally, run `settings enabledcmds <\'enable\'/\'disable\'> global`.\n' +
              'To turn on or off whether a particular command or category, run `settings enabledcmds <\'enable\'/\'disable\'> <\'category\'/\'command\'> <command/category>`.\n',
            );
          } else {
            switch (args[1]) {
              case 'view':
                switch (args[2]) {
                  case 'global':
                    return msg.channel.send(`Commands are globally ${props.saved.guilds[msg.guild.id].enabled_commands.global ? 'enabled' : 'disabled'}`);
                    break;

                  case 'category':
                    let category = props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' is ${category ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The category '${ args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' is ${command ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  default:
                    return msg.channel.send('Invalid option. Run `settings enabledcmds` to view options.');
                    break;
                }
                break;

              case 'enable':
              case 'disable':
                switch (args[2]) {
                  case 'global':
                    props.saved.guilds[msg.guild.id].enabled_commands.global = args[1] == 'enable';
                    schedulePropsSave();
                    return msg.channel.send(`Global commands have been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    break;

                  case 'category':
                    let category = props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;
                }
                break;

              default:
                return msg.channel.send('Invalid option. Run `settings enabledcmds` to view options.');
                break;
            }
          }
          break;
      }
    }
  },
];