// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { recursiveReaddir } = require('./convenience');

var randomModule = require('./random');
var { fastIntLog2, randBytes, randFloat, randInt, randInts } = randomModule;

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, IDToDate, dateToID } = require('./time_format'); 

function formatPlaybackBar(frac, numElems) {
  if (!Number.isFinite(frac)) frac = 0;
  if (frac < 0 || frac > 1) frac = Math.min(Math.max(frac, 0), 1);
  if (!Number.isSafeInteger(numElems) || numElems < 0) numElems = 30;
  var dotElem = Math.floor(frac * numElems);
  return '-'.repeat(Math.max(dotElem, 0)) + '•' + '-'.repeat(Math.max(numElems - dotElem - 1, 0));
}

var { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage } = require('./status_gen');

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

function regCmdResp(o, message) {
  return o.msg.channel.send(message);
}

function slashCmdResp(o, ephemeral, message) {
  if (typeof message == 'object') {
    return o.interaction.reply({
      embeds: [message],
      ephemeral,
    });
  } else {
    return o.interaction.reply({
      content: message,
      ephemeral,
    });
  }
}

class BotError extends Error {}

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./worker_buf');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions } = require('./perm_check');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./perm_serialize');

var { parseArgs } = require('./parse_cmd_args');

var { searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser } = require('./coll_search');

var { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./general_serialize');

var invokeMessageHandler = require('./msg_invoke');

var { rps } = require('./misc');

var BufferStream = require('./buffer_stream');

var clientVCManager = require('./client_vc_manager');

var handlers = require('./handlers/index');

var { isId, isObject, persDataCreateVerifiedCopy, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject } = require('./pers_data_verif');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants, recursiveReaddir, fastIntLog2,
  get randomBytes() { return randomModule.randomBytes }, set randomBytes(val) { randomModule.randomBytes = val; },
  get randomOffset() { return randomModule.randomOffset }, set randomOffset(val) { randomModule.randomOffset = val; },
  randBytes, randFloat, randInt, randInts,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, IDToDate, dateToID, formatPlaybackBar,
  getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage,
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, onMsgOneArgSetHelper, regCmdResp, slashCmdResp,
  BotError,
  BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  parseArgs,
  searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser,
  leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels,
  invokeMessageHandler,
  rps,
  BufferStream,
  clientVCManager,
  handlers,
  isId, isObject, persDataCreateVerifiedCopy, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject,
};
