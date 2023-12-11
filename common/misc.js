function formatPlaybackBar(frac, numElems) {
  if (!Number.isFinite(frac)) frac = 0;
  if (frac < 0 || frac > 1) frac = Math.min(Math.max(frac, 0), 1);
  if (!Number.isSafeInteger(numElems) || numElems < 0) numElems = 30;
  var dotElem = Math.floor(frac * numElems);
  return '-'.repeat(Math.max(dotElem, 0)) + '•' + '-'.repeat(Math.max(numElems - dotElem - 1, 0));
}

function explainChannel(channel, full) {
  if (full)
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms with ${channel.recipient.tag} (id ${channel.recipient.id})`;
  else
    return channel.guild ? `${channel.guild.name}:${channel.name}` : 'dms';
}

function stringToBoolean(str) {
  switch (str) {
    case 'true':
    case 'yes':
      return true;
    
    case 'false':
    case 'no':
      return false;
    
    default:
      return null;
  }
}

function removePings(str) {
  return str.replace(/@/g, '@\u200b');
}

function onMsgOneArgHelper(o) {
  let oneArg = o.argstring[0] == '"' || o.argstring[0] == '\'' ? o.rawArgs[0] : o.argstring;
  
  Object.defineProperty(o, 'asOneArg', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: oneArg,
  });
  
  return oneArg;
}

function onMsgOneArgSetHelper(o, val) {
  Object.defineProperty(o, 'asOneArg', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: val,
  });
}

function regCmdResp(o, message, mention) {
  if (mention) {
    if (typeof message == 'string') {
      return o.channel.send({ content: message, allowedMentions: { parse: ['users', 'roles', 'everyone'] } });
    } else {
      return o.channel.send({ ...message, allowedMentions: { parse: ['users', 'roles', 'everyone'] } });
    }
  } else {
    return o.channel.send(message);
  }
}

async function slashCmdDefer(o, ephemeral) {
  if (!o.interaction.replied) {
    return await o.interaction.deferReply({ ephemeral });
  }
}

function slashCmdResp(o, ephemeral, message, mention) {
  let replyObject;
  if (typeof message == 'object') {
    replyObject = {
      embeds: [message],
      ephemeral,
    };
  } else {
    replyObject = {
      content: message,
      ...(mention ? { allowedMentions: { parse: ['users', 'roles', 'everyone'] } } : null),
      ephemeral,
    };
  }
  if (o.alreadyReplied) {
    return o.interaction.followUp(replyObject);
  } else {
    o.alreadyReplied = true;
    if (o.interaction.deferred) {
      return o.interaction.editReply(replyObject);
    } else {
      return o.interaction.reply(replyObject);
    }
  }
}

function getGuilddata(guildId) {
  let guilddata = props.saved.guilds[guildId];
  if (!guilddata) return common.getEmptyGuildObject(guildId);
  return guilddata;
}

function createAndGetGuilddata(guildId) {
  let guilddata = props.saved.guilds[guildId];
  if (!guilddata) {
    guilddata = props.saved.guilds[guildId] = common.getEmptyGuildObject(guildId);
    schedulePropsSave();
  }
  return guilddata;
}

function slashCommandsInequal(cmd1, cmd2) {
  return cmd1.description != cmd2.description ||
    Array.isArray(cmd1.options) != Array.isArray(cmd2.options) && cmd1.options?.length != cmd1.options?.length ||
    Array.isArray(cmd1.options) && Array.isArray(cmd2.options) && (
      cmd1.options.length != cmd2.options.length || cmd1.options.some((y, i) =>
        y.type != cmd2.options[i].type ||
        y.name != cmd2.options[i].name ||
        y.description != cmd2.options[i].description ||
        (y.required ?? false) !== (cmd2.options[i].required ?? false) ||
        Array.isArray(y.choices) != Array.isArray(cmd2.options[i].choices) && y.choices?.length != cmd2.options[i].choices?.length ||
        Array.isArray(y.choices) && Array.isArray(cmd2.options[i].choices) && (
          y.choices.length != cmd2.options[i].choices.length || y.choices.some((z, j) =>
            z.name != cmd2.options[i].choices[j].name ||
            z.value != cmd2.options[i].choices[j].value
          )
        ) ||
        Array.isArray(y.options) != Array.isArray(cmd2.options[i].options) && y.options?.length != cmd2.options[i].options?.length ||
        Array.isArray(y.options) && Array.isArray(cmd2.options[i].options) && (
          y.options.length != cmd2.options[i].options.length || y.options.some((z, j) =>
            z.type != cmd2.options[i].options[j].type ||
            z.name != cmd2.options[i].options[j].name ||
            z.description != cmd2.options[i].options[j].description ||
            (z.required ?? false) !== (cmd2.options[i].options[j].required ?? false) ||
            Array.isArray(z.choices) != Array.isArray(cmd2.options[i].options[j].choices) && z.choices?.length != cmd2.options[i].options[j].choices?.length ||
            Array.isArray(z.choices) && Array.isArray(cmd2.options[i].options[j].choices) && (
              z.choices.length != cmd2.options[i].options[j].choices.length || z.choices.some((w, k) =>
                w.name != cmd2.options[i].options[j].choices[k].name ||
                w.value != cmd2.options[i].options[j].choices[k].value
              )
            ) ||
            Array.isArray(z.options) != Array.isArray(cmd2.options[i].options[j].options) && z.options?.length != cmd2.options[i].options[j].options?.length ||
            Array.isArray(z.options) && Array.isArray(cmd2.options[i].options[j].options) && (
              z.options.length != cmd2.options[i].options[j].options.length || z.options.some((w, k) =>
                w.type != cmd2.options[i].options[j].options[k].type ||
                w.name != cmd2.options[i].options[j].options[k].name ||
                w.description != cmd2.options[i].options[j].options[k].description ||
                (w.required ?? false) !== (cmd2.options[i].options[j].options[k].required ?? false) ||
                Array.isArray(w.choices) != Array.isArray(cmd2.options[i].options[j].options[k].choices) && w.choices?.length != cmd2.options[i].options[j].options[k].choices?.length ||
                Array.isArray(w.choices) && Array.isArray(cmd2.options[i].options[j].options[k].choices) && (
                  w.choices.length != cmd2.options[i].options[j].options[k].choices.length || w.choices.some((v, l) =>
                    v.name != cmd2.options[i].options[j].options[k].choices[l].name ||
                    v.value != cmd2.options[i].options[j].options[k].choices[l].value
                  )
                )
              )
            )
          )
        )
      )
    );
}

class BotError extends Error {}

// normal rps, where p1 and p2 are either 'rock', 'paper', or 'scissors', and the return value is 1 if p2 wins, -1 if p1 wins, and 0 if its a tie
function rps(p1, p2) {
  if (p1 == p2) return 0;
  switch (p1) {
    case 'rock':
      if (p2 == 'paper') return 1;
      else return -1;
    case 'scissors':
      if (p2 == 'rock') return 1;
      else return -1;
    case 'paper':
      if (p2 == 'scissors') return 1;
      else return -1;
  }
}

module.exports = {
  formatPlaybackBar,
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, onMsgOneArgSetHelper, regCmdResp, slashCmdDefer, slashCmdResp, getGuilddata, createAndGetGuilddata,
  slashCommandsInequal,
  BotError,
  rps,
};
