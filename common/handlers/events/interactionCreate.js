module.exports = async interaction => {
  switch (interaction.type) {
    case 'APPLICATION_COMMAND':
      let o = {
        interaction,
        cmd: commandColl.get(interaction.commandName),
        command: interaction.commandName,
        args: null,
        channel: interaction.channel,
        guild: null,
        author: null,
        member: null,
      };
      
      if (o.cmd) {
        if (Array.isArray(o.cmd.options) && o.cmd.options.length) {
          o.args = o.cmd.options.map(x => {
            var interactionValue = interaction.options.get(x.name)?.value;
            return interactionValue != null ? { value: interactionValue } : null;
          });
        } else {
          o.args = [];
        }
      } else {
        o.args = interaction.options;
      }
      
      if (interaction.member) {
        o.author = interaction.user;
        o.member = interaction.member;
        o.guild = interaction.guild;
      } else {
        o.author = interaction.user;
      }
      
      if (handlers.extra.interactionCreate) {
        let res;
        for (var i = 0; i < handlers.extra.interactionCreate.length; i++) {
          if (handlers.extra.interactionCreate[i].constructor == Function) res = handlers.extra.interactionCreate[i](o, i);
          else res = await handlers.extra.interactionCreate[i](o, i);
          if (res === 0) return;
        }
      }
      
      if (!o.cmd) return;
      
      if (o.cmd.execute_slash) {
        if (!common.hasBotPermissions(o, common.constants.botRolePermBits.NORMAL))
          return common.slashCmdResp(o, true, 'You lack permission to use this command.');
        if (o.guild ? o.cmd.flags & 0b000100 : o.cmd.flags & 0b001000) {
          if (!(o.cmd.flags & 0b000010) && (!o.guild || !persData.special_guilds_set.has(o.guild.id)))
            return common.slashCmdResp(o, true, 'Command invalid.');
          if (o.guild && o.command != 'settings' &&
            props.saved.guilds[o.guild.id] && (
              !props.saved.guilds[o.guild.id].enabled_commands.global ||
              props.saved.guilds[o.guild.id].enabled_commands.categories[o.cmd.category] == false ||
              props.saved.guilds[o.guild.id].enabled_commands.commands[o.command] == false ||
              o.command == 'join' && props.saved.guilds[o.guild.id].enabled_commands.commands['leave'] == false ||
              o.command == 'play' && props.saved.guilds[o.guild.id].enabled_commands.commands['stop'] == false))
            return common.slashCmdResp(o, true, 'Command is disabled in this server.');
          
          try {
            if (o.cmd.execute_slash.constructor == Function)
              return o.cmd.execute_slash(o, interaction, o.command, o.args);
            else
              return await o.cmd.execute_slash(o, interaction, o.command, o.args);
          } catch (e) {
            if (e instanceof common.BotError) {
              return common.slashCmdResp(o, true, `Error: ${e.message}`);
            } else throw e;
          }
        } else {
          return common.slashCmdResp(o, true, o.guild ? 'Command not for guilds.' : 'Command not for dms.');
        }
      }
      break;
  }
};
