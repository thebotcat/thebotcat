// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { recursiveReaddir } = require('./convenience');

var randomModule = require('./random');
var { fastIntLog2, randBytes, randFloat, randInt, randInts } = randomModule;

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, IdToDate, dateToId } = require('./time_format');

var { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage } = require('./status_gen');

var {
  formatPlaybackBar,
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, onMsgOneArgSetHelper, regCmdResp, slashCmdDefer, slashCmdResp, getGuilddata, createAndGetGuilddata,
  slashCommandsInequal,
  BotError,
  rps,
} = require('./misc');

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./worker_buf');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions } = require('./perm_check');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./perm_serialize');

var { parseArgs } = require('./parse_cmd_args');

var { searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser } = require('./coll_search');

var { leftPadId, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./general_serialize');

var invokeMessageHandler = require('./msg_invoke');

var BufferStream = require('./buffer_stream');

var clientVCManager = require('./client_vc_manager');

var handlers = require('./handlers/index');

var { isId, isObject, persDataCreateVerifiedCopy, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject } = require('./pers_data_verif');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants, recursiveReaddir, fastIntLog2,
  get randomBytes() { return randomModule.randomBytes; }, set randomBytes(val) { randomModule.randomBytes = val; },
  get randomOffset() { return randomModule.randomOffset; }, set randomOffset(val) { randomModule.randomOffset = val; },
  randBytes, randFloat, randInt, randInts,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, IdToDate, dateToId,
  getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage,
  formatPlaybackBar,
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, onMsgOneArgSetHelper, regCmdResp, slashCmdDefer, slashCmdResp, getGuilddata, createAndGetGuilddata,
  slashCommandsInequal,
  BotError,
  rps,
  BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  parseArgs,
  searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser,
  leftPadId, getFancyGuilds, getSortedChannels, getFancyChannels,
  invokeMessageHandler,
  BufferStream,
  clientVCManager,
  handlers,
  isId, isObject, persDataCreateVerifiedCopy, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject,
};
