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
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms`;
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
    return o.interaction.reply(replyObject).then(x => (o.alreadyReplied = true, x));
  }
}

function getGuilddata(guildId) {
  let guilddata = props.saved.guilds[guildId];
  if (!guilddata) return getEmptyGuildObject(guildId);
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
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, onMsgOneArgSetHelper, regCmdResp, slashCmdResp, getGuilddata, createAndGetGuilddata,
  BotError,
  rps,
};
