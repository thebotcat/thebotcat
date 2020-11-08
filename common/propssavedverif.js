var commonConstants = require('./constants');

// props.saved integrity checks / conversion from older format
function isId(val) {
  return typeof val == 'string' && /[0-9]{16,20}/.test(val);
}

module.exports = {
  isId,
  propsSavedCreateVerifiedCopy: function propsSavedCreateVerifiedCopy(obj) {
    if (typeof obj != 'object') obj = {};
    if (!Number.isSafeInteger(obj.version) || obj.version == 1) {
      let featIsObj = typeof obj.feat == 'object';
      let guildsIsObj = typeof obj.guilds == 'object';
      let perGuildFunc = (guild, id) => {
        let guildIsObj = typeof guild == 'object';
        let newGuild = {
          prefix: guildIsObj && typeof guild.prefix == 'string' ? guild.prefix : defaultprefix,
          enabled_commands: {
            global: true,
            categories: (() => {
              let catObj = {};
              commandCategories.forEach(x => catObj[x] = true);
              return catObj;
            })(),
            commands: (() => {
              let cmdObj = {};
              commands.forEach(x => x.public ? cmdObj[x.name] = true : null);
              return cmdObj;
            })(),
          },
          logging: {
            main: guildIsObj && isId(guild.infochannel) ? guild.infochannel : null,
          },
          perms: (() => {
            let includesEveryone = false;
            let obj = {};
            (guildIsObj && Array.isArray(guild.modroles) ? guild.modroles : [])
              .forEach(x => {
                if (!isId(x)) return null;
                if (x == id && !includesEveryone) includesEveryone = true;
                obj[x] = commonConstants.botRolePermMod;
              });
            if (!includesEveryone) obj[id] = commonConstants.botRolePermDef;
            return obj;
          })(),
          overrides: {},
          mutedrole: null,
          events: [],
          temp: {
            stashed: {
              channeloverrides: (() => {
                if (!guildIsObj || typeof guild.savedperms != 'object') return {};
                let overObj = {};
                Object.keys(guild.savedperms).forEach(x => {
                  if (typeof guild.savedperms[x] != 'object' ||
                    typeof guild.savedperms[x].id != 'string' ||
                    guild.savedperms[x].type != 'role' && guild.savedperms[x].type != 'member' ||
                    !Number.isSafeInteger(guild.savedperms[x].allow) ||
                    !Number.isSafeInteger(guild.savedperms[x].deny)) return;
                  overObj[x] = {
                    id: guild.savedperms[x].id,
                    type: guild.savedperms[x].type,
                    allow: guild.savedperms[x].allow,
                    deny: guild.savedperms[x].deny,
                  };
                });
                return overObj;
              })(),
            },
          },
        };
        Object.defineProperty(newGuild, 'voice', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: guildIsObj && 'voice' in guild ? guild.voice : common.clientVCManager.getEmptyVoiceObject(),
        });
        return newGuild;
      };
      let perUserFunc = user => {
        let userIsObj = typeof user == 'object';
        let userObj = {
          calc_scope: userIsObj ? JSON.stringify(user) : '{}',
        };
        Object.defineProperty(userObj, 'calc_scope_working', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: JSON.parse(userObj.calc_scope, math.reviver),
        });
        return userObj;
      };
      let newObj = {
        version: 2,
        feat: {
          calc: featIsObj && typeof obj.feat.calc == 'boolean' ? obj.feat.calc : true,
          audio: featIsObj && Number.isSafeInteger(obj.feat.audio) && obj.feat.audio >= 0 && obj.feat.audio < 4 ? obj.feat.audio : 3,
          lamt: featIsObj && Number.isSafeInteger(obj.feat.lamt) ? obj.feat.lamt : 0,
        },
        guilds: { default: perGuildFunc(guildsIsObj ? obj.guilds.default : null) },
        users: { default: perUserFunc(typeof obj.calc_scopes == 'object' ? obj.calc_scopes.shared : null) },
        misc: {
          dmchannels: Array.isArray(obj.dmchannels) ? obj.dmchannels.filter(x => isId(x)) : [],
          sendmsgid: typeof obj.sendmsgid == 'string' ? obj.sendmsgid : '1',
        },
      };
      client.guilds.cache.keyArray().forEach(x => newObj.guilds[x] = perGuildFunc(guildsIsObj ? obj.guilds[x] : null, x));
      if (guildsIsObj) {
        let props = Object.getOwnPropertyDescriptors(obj.guilds);
        let keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          if (props[keys[i]].enumerable && isId(keys[i]))
            newObj.guilds[keys[i]] = perGuildFunc(obj.guilds[keys[i]], keys[i]);
          else if (props[keys[i]].get)
            Object.defineProperty(newObj.guilds, keys[i], {
              configurable: true,
              enumerable: false,
              get: props[keys[i]].get,
            });
        }
      }
      if (typeof obj.calc_scopes == 'object')
        Object.keys(obj.calc_scopes).forEach(x => x != 'shared' && isId(x) ? newObj.users[x] = perUserFunc(obj.calc_scopes[x]) : null);
      return newObj;
    } else if (obj.version == 2) {
      let featIsObj = typeof obj.feat == 'object';
      let guildsIsObj = typeof obj.guilds == 'object';
      let perGuildFunc = (guild, id) => {
        let guildIsObj = typeof guild == 'object';
        let newGuild = {
          prefix: guildIsObj && typeof guild.prefix == 'string' ? guild.prefix : defaultprefix,
          enabled_commands: {
            global: guildIsObj && typeof guild.enabled_commands == 'object' && typeof guild.enabled_commands.global == 'boolean' ? guild.enabled_commands.global : true,
            categories: (() => {
              let ecco = guildIsObj && typeof guild.enabled_commands == 'object' && typeof guild.enabled_commands.categories == 'object';
              let catObj = {};
              commandCategories.forEach(x => catObj[x] = ecco && typeof guild.enabled_commands.categories[x] == 'boolean' ? guild.enabled_commands.categories[x] : true);
              return catObj;
            })(),
            commands: (() => {
              let ecco = guildIsObj && typeof guild.enabled_commands == 'object' && typeof guild.enabled_commands.commands == 'object';
              let cmdObj = {};
              commands.forEach(x => x.public ? (cmdObj[x.name] = ecco && typeof guild.enabled_commands.commands[x] == 'boolean' ? guild.enabled_commands.commands[x] : true) : null);
              return cmdObj;
            })(),
          },
          logging: {
            main: guildIsObj && typeof guild.logging == 'object' && isId(guild.logging.main) ? guild.logging.main : null,
          },
          perms: (() => {
            let includesEveryone = false;
            let obj = (guildIsObj && typeof guild.perms == 'object' ? guild.perms : {}), newObj = {};
            Object.keys(obj)
              .forEach(x => {
                if (!isId(x)) return;
                if (x == id && !includesEveryone) includesEveryone = true;
                newObj[x] = Number.isSafeInteger(obj[x]) ? obj[x] : 0;
              });
            if (!includesEveryone) newObj[id] = commonConstants.botRolePermDef;
            return newObj;
          })(),
          overrides: (() => {
            if (!guildIsObj || typeof guild.overrides != 'object') return {};
            let overObj = {};
            Object.keys(guild.overrides).forEach(x => {
              let includesEveryone = false;
              let obj = guild.overrides[x], newObj = {};
              Object.keys(obj)
                .forEach(x => {
                  if (!isId(x)) return;
                  if (x == id && !includesEveryone) includesEveryone = true;
                  newObj[x] = Number.isSafeInteger(obj[x]) ? obj[x] : 0;
                });
              if (!includesEveryone) newObj[id] = commonConstants.botRolePermDef;
              overObj[x] = newObj;
            });
            return overObj;
          })(),
          mutedrole: guildIsObj && typeof guild.mutedrole == 'string' ? guild.mutedrole : null,
          events: guildIsObj && Array.isArray(guild.events) ? guild.events : [],
          temp: {
            stashed: {
              channeloverrides: (() => {
                if (!guildIsObj || typeof guild.temp != 'object' || typeof guild.temp.stashed != 'object' || typeof guild.temp.stashed.channeloverrides != 'object') return {};
                let overrides = guild.temp.stashed.channeloverrides;
                let overObj = {};
                Object.keys(overrides).forEach(x => {
                  if (typeof overrides[x] != 'object' ||
                    typeof overrides[x].id != 'string' ||
                    overrides[x].type != 'role' && overrides[x].type != 'member' ||
                    !Number.isSafeInteger(overrides[x].allow) ||
                    !Number.isSafeInteger(overrides[x].deny)) return;
                  overObj[x] = {
                    id: overrides[x].id,
                    type: overrides[x].type,
                    allow: overrides[x].allow,
                    deny: overrides[x].deny,
                  };
                });
                return overObj;
              })(),
            },
          },
        };
        Object.defineProperty(newGuild, 'voice', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: guildIsObj && 'voice' in guild ? guild.voice : common.clientVCManager.getEmptyVoiceObject(),
        });
        return newGuild;
      };
      let newObj;
      let perUserFunc = user => {
        let userIsObj = typeof user == 'object';
        let userObj = {
          calc_scope: userIsObj && typeof user.calc_scope == 'string' ? user.calc_scope : '{}',
        };
        let scope = JSON.parse(userObj.calc_scope, math.reviver);
        if (newObj && newObj.users && newObj.users.default)
          Object.defineProperty(scope, 'shared', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: newObj.users.default.calc_scope_working,
          });
        Object.defineProperty(userObj, 'calc_scope_working', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: scope,
        });
        return userObj;
      };
      newObj = {
        version: 2,
        feat: {
          calc: featIsObj && typeof obj.feat.calc == 'boolean' ? obj.feat.calc : true,
          audio: featIsObj && Number.isSafeInteger(obj.feat.audio) && obj.feat.audio >= 0 && obj.feat.audio < 4 ? obj.feat.audio : 3,
          lamt: featIsObj && Number.isSafeInteger(obj.feat.lamt) ? obj.feat.lamt : 0,
        },
        guilds: { default: perGuildFunc(guildsIsObj ? obj.guilds.default : null) },
        users: { default: perUserFunc(typeof obj.users == 'object' ? obj.users.default : null) },
        misc: {
          dmchannels: typeof obj.misc == 'object' && Array.isArray(obj.misc.dmchannels) ? obj.misc.dmchannels.filter(x => typeof x == 'string') : [],
          sendmsgid: typeof obj.misc == 'object' && typeof obj.misc.sendmsgid == 'string' ? obj.misc.sendmsgid : '1',
        },
      };
      client.guilds.cache.keyArray().forEach(x => newObj.guilds[x] = perGuildFunc(guildsIsObj ? obj.guilds[x] : null, x));
      if (guildsIsObj) {
        let props = Object.getOwnPropertyDescriptors(obj.guilds);
        let keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          if (props[keys[i]].enumerable && isId(keys[i]))
            newObj.guilds[keys[i]] = perGuildFunc(obj.guilds[keys[i]], keys[i]);
          else if (props[keys[i]].get)
            Object.defineProperty(newObj.guilds, keys[i], {
              configurable: true,
              enumerable: false,
              get: props[keys[i]].get,
            });
        }
      }
      if (typeof obj.users == 'object')
        Object.keys(obj.users).forEach(x => x != 'default' && isId(x) ? newObj.users[x] = perUserFunc(obj.users[x]) : null);
      return newObj;
    }
  },

  getEmptyGuildObject: () => {
    return {
      prefix: defaultprefix,
      enabled_commands: {
        global: true,
        categories: (() => {
          let catObj = {};
          commandCategories.forEach(x => catObj[x] = true);
          return catObj;
        })(),
        commands: (() => {
          let cmdObj = {};
          commands.forEach(x => x.public ? cmdObj[x.name] = true : null);
          return cmdObj;
        })(),
      },
      logging: {
        main: null,
      },
      perms: [],
      overrides: {},
      mutedrole: null,
      events: [],
      temp: {
        stashed: {
          channeloverrides: {},
        },
      },
    };
  },
  
  getEmptyUserObject: (guildObj) => {
    let obj = {
      calc_scope: '',
    };
    let scope = {};
    if (guildObj && guildObj.users && guildObj.users.default)
      Object.defineProperty(scope, 'shared', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: guildObj.users.default.calc_scope_working,
      });
    Object.defineProperty(obj, 'calc_scope_working', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: {},
    });
    return obj;
  },
};