var commonConstants = require('./constants');

// the next five functions are self explanatory, although isMod refers to bot moderator role
// msg can either be a message object or an interactions object
function isDeveloper(msg) {
  if (typeof msg == 'object') {
    return (!props.erg || msg.channel.id == persData.ids.channel.v9 || msg.channel.id == persData.ids.channel.v10) && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id);
  } else {
    return !props.erg && (msg == '405091324572991498' || msg == '312737536546177025') || developers.includes(msg);
  }
}

function isConfirmDeveloper(msg) {
  return confirmdevelopers.includes(msg.author.id);
}

function isOwner(msg) {
  if (!msg.guild) return false;
  return msg.guild.ownerId == msg.author.id;
}

function isAdmin(msg) {
  if (!msg.guild) return false;
  try {
    return msg.member ? msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) : false;
  } catch (e) {
    console.error(e);
    isPositionErrorMsg = msg;
    if (msg instanceof Discord.Message) msg.fetch();
    return false;
  }
}


function hasBotPermissions(msg, permMask, channel) {
  if (typeof permMask == 'string') permMask = commonConstants.botRolePermBits[permMask];
  else if (Array.isArray(permMask)) permMask = permMask.map(x => commonConstants.botRolePermBits[x]).reduce((a, c) => a | c, 0);
  
  if (!msg.guild) return permMask & commonConstants.botRolePermBits.NORMAL;
  if (!msg.member) return 0;
  
  let guilddata = common.getGuilddata(msg.guild.id);
  
  if (channel === undefined) channel = msg.channel;
  
  let guildPerms = guilddata.perms,
    channelOverrides = channel ? guilddata.overrides[channel.id] : null;
  let guildPermKeys = Object.keys(guildPerms),
    channelOverrideKeys = channelOverrides ? Object.keys(channelOverrides) : null;
  
  let serverPerms = Array.from(msg.member.roles.cache.keys())
    .filter(x => guildPermKeys.includes(x))
    .reduce((a, c) => a | guildPerms[c] & permMask, 0)
    & commonConstants.botRolePermAll;
  
  let channelPerms = serverPerms;
  if (channelOverrides) {
    if (channelOverrides[msg.guild.id])
      channelPerms = channelPerms & ~channelOverrides[msg.guild.id].denys | channelOverrides[msg.guild.id].allows;
    let roleIntersect = Array.from(msg.member.roles.cache.keys())
      .filter(x => x != msg.guild.id && channelOverrideKeys.includes(x));
    let denys = roleIntersect.reduce((a, c) => a | channelOverrides[c].denys & commonConstants.botRolePermCnl & permMask, 0),
      allows = roleIntersect.reduce((a, c) => a | channelOverrides[c].allows & commonConstants.botRolePermCnl & permMask, 0);
    channelPerms = channelPerms & ~denys | allows;
  }
  
  if (permMask & commonConstants.botRolePermBits.NORMAL &&
    !(channelPerms & commonConstants.botRolePermBits.NORMAL) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.NORMAL;
  
  if (permMask & commonConstants.botRolePermBits.BYPASS_LOCK &&
    !(channelPerms & commonConstants.botRolePermBits.BYPASS_LOCK) &&
    ((channel ? channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ManageRoles) : msg.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) || channelPerms & commonConstants.botRolePermBits.LOCK_CHANNEL))
    channelPerms |= commonConstants.botRolePermBits.BYPASS_LOCK;
  
  if (permMask & commonConstants.botRolePermBits.JOIN_VC &&
    !(channelPerms & commonConstants.botRolePermBits.JOIN_VC) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.JOIN_VC;
  
  if (permMask & commonConstants.botRolePermBits.LEAVE_VC &&
    !(channelPerms & commonConstants.botRolePermBits.LEAVE_VC) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.LEAVE_VC;
  
  if (permMask & commonConstants.botRolePermBits.PLAY_SONG &&
    !(channelPerms & commonConstants.botRolePermBits.PLAY_SONG) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.PLAY_SONG;
  
  if (permMask & commonConstants.botRolePermBits.PLAY_PLAYLIST &&
    !(channelPerms & commonConstants.botRolePermBits.PLAY_PLAYLIST) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.PLAY_PLAYLIST;
  
  if (permMask & commonConstants.botRolePermBits.REMOTE_CMDS &&
    !(channelPerms & commonConstants.botRolePermBits.REMOTE_CMDS) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.REMOTE_CMDS;
  
  if (permMask & commonConstants.botRolePermBits.DELETE_MESSAGES &&
    !(channelPerms & commonConstants.botRolePermBits.DELETE_MESSAGES) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.DELETE_MESSAGES;
  
  if (permMask & commonConstants.botRolePermBits.LOCK_CHANNEL &&
    !(channelPerms & commonConstants.botRolePermBits.LOCK_CHANNEL) &&
    (channel ? channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ManageRoles) : msg.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)))
    channelPerms |= commonConstants.botRolePermBits.LOCK_CHANNEL;
  
  if (permMask & commonConstants.botRolePermBits.MUTE &&
    !(channelPerms & commonConstants.botRolePermBits.MUTE) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles) &&
      (guilddata.mutedrole == null ||
        msg.member.roles.highest.position > msg.guild.roles.cache.get(guilddata.mutedrole).position) || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.MUTE;
  
  if (permMask & commonConstants.botRolePermBits.KICK &&
    !(channelPerms & commonConstants.botRolePermBits.KICK) &&
    msg.member.permissions.has(Discord.PermissionsBitField.Flags.KickMembers))
    channelPerms |= commonConstants.botRolePermBits.KICK;
  
  if (permMask & commonConstants.botRolePermBits.BAN &&
    !(channelPerms & commonConstants.botRolePermBits.BAN) &&
    msg.member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers))
    channelPerms |= commonConstants.botRolePermBits.BAN;
  
  if (permMask & commonConstants.botRolePermBits.MANAGE_BOT &&
    !(channelPerms & commonConstants.botRolePermBits.MANAGE_BOT) &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg)))
    channelPerms |= commonConstants.botRolePermBits.MANAGE_BOT;
  
  if (permMask & commonConstants.botRolePermBits.MANAGE_BOT_FULL &&
    (msg.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) &&
      msg.member.roles.highest.position > msg.guild.me.roles.highest.position || isOwner(msg))) {
    if (!(channelPerms & commonConstants.botRolePermBits.MANAGE_BOT_FULL))
      channelPerms |= commonConstants.botRolePermBits.MANAGE_BOT_FULL;
  } else if (channelPerms & commonConstants.botRolePermBits.MANAGE_BOT_FULL)
    channelPerms &= ~commonConstants.botRolePermBits.MANAGE_BOT_FULL;
  
  if (permMask & commonConstants.botRolePermBits.SLOWMODE &&
    !(channelPerms & commonConstants.botRolePermBits.SLOWMODE) &&
    (channel ? channel.permissionsFor(msg.member).has(Discord.PermissionsBitField.Flags.ManageChannels) : msg.member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)))
    channelPerms |= commonConstants.botRolePermBits.SLOWMODE;
  
  return channelPerms;
}


function getBotPermissions(msg, channelMode) {
  let perms = typeof msg == 'number' || typeof msg == 'object' ? msg : hasBotPermissions(msg, channelMode ? commonConstants.botRolePermCnl : commonConstants.botRolePermAll, null);
  let obj = {};
  if (channelMode)
    Object.keys(commonConstants.botRolePermBits).forEach(x => x != 'MANAGE_BOT_FULL' && commonConstants.botRolePermBits[x] & commonConstants.botRolePermCnl ? obj[x] = Math.sign((perms.allows & commonConstants.botRolePermBits[x]) - (perms.denys & commonConstants.botRolePermBits[x])) : null);
  else
    Object.keys(commonConstants.botRolePermBits).forEach(x => x != 'MANAGE_BOT_FULL' ? obj[x] = Boolean(perms & commonConstants.botRolePermBits[x]) : null);
  return obj;
}

function getBotPermissionsArray(msg, channelMode) {
  let perms = getBotPermissions(msg, channelMode);
  return Object.keys(perms).map(x => [x, perms[x]]);
}


// this function isnt used but it might be handy, pass in a message object and it calls all five of the above functions on them
function getPermissions(msg) {
  return {
    developer: isDeveloper(msg),
    confirmdeveloper: isConfirmDeveloper(msg),
    owner: isOwner(msg),
    admin: isAdmin(msg),
    perms: getBotPermissions(msg),
  };
}


module.exports = { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions };
