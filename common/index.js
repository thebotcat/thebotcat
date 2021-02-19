// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { recursiveReaddir } = require('./convenience');

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString } = require('./time'); 

function formatPlaybackBar(frac, numElems) {
  if (!Number.isFinite(frac)) frac = 0;
  if (frac < 0 || frac > 1) frac = Math.min(Math.max(frac, 0), 1);
  if (!Number.isSafeInteger(numElems) || numElems < 0) numElems = 30;
  var dotElem = Math.floor(frac * numElems);
  return '-'.repeat(Math.max(dotElem, 0)) + '•' + '-'.repeat(Math.max(numElems - dotElem - 1, 0));
}

var { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage } = require('./status');

var explainChannel = (channel, full) => {
  if (full)
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms with ${channel.recipient.tag} (id ${channel.recipient.id})`;
  else
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms`;
};

var stringToBoolean = str => {
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
};

var removePings = str => {
  return str.replace(/@/g, '@\u200b');
};

class BotError extends Error {}

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./workerbuffer');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions } = require('./isposition');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./permserialize');

var { parseArgs } = require('./parsecommand');

var { searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser } = require('./searchcollection');

var { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./generalserialize');

var invokeMessageHandler = require('./invokemsg');

var { rps } = require('./misc');

var BufferStream = require('./bufferstream');

var clientVCManager = require('./clientvcmanager');

var handlers = require('./handlers/index');

var { isId, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject } = require('./propssavedverif');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants, recursiveReaddir,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, formatPlaybackBar,
  getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage,
  explainChannel, stringToBoolean, removePings,
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
  isId, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject,
};
