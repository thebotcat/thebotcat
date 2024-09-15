// log errors
var logErrors = true;

// true to use workers to evaluate math.js, false to use v8 vm
var doWorkers = true;

// true to use yt-dlp instead of ytdl
var useYTDLP = false;

// limit is 1 error logged every 24 hours
var errorCounter = 0;

// for timing data
var starttime = new Date(), readytime, ready2time, ready3time;

var fs = require('fs');

// load .env file
try {
  fs.readFileSync('.env').toString().split(/\r?\n/g).forEach(entry => {
    if (entry[0] == '#') return;
    var split = entry.split(':');
    var key = split[0].trim();
    var value = split.slice(1).join(':').trim();
    process.env[key] = value;
  });
} catch (e) {
  console.error('Error parsing .env, thebotcat will not be able to login');
  console.error(e);
}

// complicated exit handling flag
var exitHandled = 0;

// core requires
var cp = require('child_process');
var https = require('https');
var stream = require('stream');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');

// 3rd party requires
var Discord = require('discord.js');
var DiscordVoice = require('@discordjs/voice');
var ytdl = null, ytdl_ipv6Block, ytdl_workingProps, ytdl_getAgent;
if (!useYTDLP) {
  try {
    ytdl = require('@distube/ytdl-core');
    getRandomIPv6 = require('@distube/ytdl-core/lib/utils').getRandomIPv6;
    let COOKIES_FILE = 'extra_data/cookies.json';
    ytdl_workingProps = {};
    ytdl_workingProps.ipv6Block = process.env.YTDL_IPV6_BLOCK == 'null' ? null : process.env.YTDL_IPV6_BLOCK;
    ytdl_workingProps.tryCookies = process.env.YTDL_USE_COOKIES == 'true' ? true : false;
    ytdl_workingProps.lastAgentTime = null;
    ytdl_workingProps.currentAgent = null;
    ytdl_workingProps.cookies = null;
    ytdl_loadCookies = function ytdl_loadCookies() {
      try {
        if (ytdl_workingProps.cookies == null) {
          ytdl_workingProps.cookies = JSON.parse(fs.readFileSync(COOKIES_FILE).toString());
        }
      } catch (e) {
        console.error(e);
      }
    };
    ytdl_clearCookies = function ytdl_clearCookies() {
      ytdl_workingProps.cookies = null;
    };
    ytdl_getAgent = function ytdl_getAgent() {
      ytdl_loadCookies();
      if (ytdl_workingProps.ipv6Block == null) {
        if (ytdl_workingProps.lastAgentTime == null) {
          // new agent, only created once
          ytdl_workingProps.currentAgent = ytdl.createAgent(ytdl_workingProps.cookies, {});
        }
      } else {
        if (ytdl_workingProps.lastAgentTime == null || Date.now() > ytdl_workingProps.lastAgentTime + 10 * 60 * 1000) {
          // new agent, renews every 10 minutes to ensure ipv6 is rotated
          ytdl_workingProps.currentAgent = ytdl.createAgent(ytdl_workingProps.cookies, {
            localAddress: getRandomIPv6(ytdl_workingProps.ipv6Block),
          });
        }
      }
      
      return ytdl_workingProps.currentAgent;
    };
    ytdl_clearAgent = function ytdl_clearAgent() {
      ytdl.lastAgentTime = null;
      ytdl_clearCookies();
    };
  } catch (e) { ytdl = null; }
}
var ytpl;
try { ytpl = require('ytpl'); } catch (e) { ytpl = null; }
var yt_dlp_wrap = null;
if (useYTDLP) {
  try { yt_dlp_wrap = require('yt-dlp-wrap').default; } catch (e) { yt_dlp_wrap = null; }
}
var mathjs = require('mathjs');
var math = mathjs.create(mathjs.all);

Object.assign(global, { fs, cp, https, stream, util, v8, vm, Discord, DiscordVoice, ytdl, getRandomIPv6, ytdl_ipv6Block, ytdl_workingProps, ytdl_loadCookies, ytdl_clearCookies, ytdl_getAgent, ytdl_clearAgent, ytpl, yt_dlp_wrap, mathjs, math });

// botcat module requires
global.props = { data_code: require('./common/data_code') };
var common = require('./common/index');

Object.assign(global, { common });

// configure math.js library
math.config({ number: 'BigNumber' });
math.oldimport = math.import.bind(math);
math.oldcreateUnit = math.createUnit.bind(math);
math.import({
  'import': function (...args) { if (calccontext) throw new Error('Function import is disabled'); return math.oldimport(...args); },
  createUnit: function (...args) { if (calccontext) throw new Error('Function createUnit is disabled'); return math.oldcreateUnit(...args); },
  /*evaluate: function () { throw new Error('Function evaluate is disabled') },
  parse: function () { throw new Error('Function parse is disabled') },
  simplify: function () { throw new Error('Function simplify is disabled') },
  derivative: function () { throw new Error('Function derivative is disabled') },*/
  'delete': function (...args) {
    if (args.length == 2) {
      return delete args[0][args[1]];
    } else if (args.length == 1) {
      if (calccontext) return delete calccontext[args[0]];
    } else throw new Error('Invalid arguments');
  },
  cryptRandom: function (...args) {
    args = args.map(x => Number(x.valueOf()));
    if (!args.length)
      return math.bignumber(common.randFloat());
    else if (args.length == 1)
      return math.bignumber(common.randFloat() * args[0]);
    else if (args.length == 2)
      return math.bignumber(args[0] + common.randFloat() * (args[1] - args[0]));
  },
  cryptRandomInt: function (...args) {
    args = args.map(x => BigInt(x.valueOf()));
    if (!args.length)
      return math.bignumber(0);
    else if (args.length == 1)
      return math.bignumber(String(common.randInt(0n, args[0])));
    else if (args.length == 2)
      return math.bignumber(String(common.randInt(args[0], args[1])));
  },
  cryptRandomBig: function (...args) {
    args = args.map(x => Number(x.valueOf()));
    if (!args.length)
      return math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64'));
    else if (args.length == 1)
      return math.multiply(math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64')), args[0]);
    else if (args.length == 2)
      return math.add(args[0], math.multiply(math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64')), math.subtract(args[1], args[0])));
  },
}, { override: true });
global.calccontext = null;

// worker importing
if (doWorkers) {
  try {
    var workerpool = require('workerpool');
  } catch (e) {
    console.log('doWorkers set to true but workerpool not available so doWorkers ignored');
    doWorkers = false;
  }
}

if (doWorkers) {
  var worker = require('worker_threads');
  var pool = workerpool.pool(__dirname + '/worker.js', { workerType: 'process', maxWorkers: 3, forkOpts: { execArgv: ['--max_old_space_size=50'] } });
  Object.assign(global, { worker, workerpool, pool });
} else {
  var mathVMContext = vm.createContext({ math });
  Object.assign(global, { mathVMContext });
}

// download yt-dlp binary if not present
global.yt_dlp = null;

if (useYTDLP) {
  (async () => {
    
    var yt_dlp_binary_exists = false;
    
    try {
      await fs.promises.access(common.constants.YT_DLP_PATH);
      yt_dlp_binary_exists = true;
    } catch {}
    
    if (!yt_dlp_binary_exists) {
      await yt_dlp_wrap.downloadFromGithub(
        common.constants.YT_DLP_PATH,
        null, // version name, null for default
        null // platform, null to use nodejs os.platform()
      );
    }
    
    global.yt_dlp = new yt_dlp_wrap(common.constants.YT_DLP_PATH);
    
    nonlogmsg('yt-dlp initialized');
  })();
}

// create discord client
var client = new Discord.Client({
  allowedMentions: { parse: [] },
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.DirectMessageReactions,
    Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [
    Discord.Partials.Channel,
  ],
});
global.client = client;

// create bot specific config variables
var developers; try { developers = JSON.parse(process.env.DEVELOPERS); } catch (e) { developers = ['405091324572991498','312737536546177025']; }
var confirmdevelopers; try { confirmdevelopers = JSON.parse(process.env.CONFIRMDEVELOPERS); } catch (e) { confirmdevelopers = []; }
var addlbotperms; try { addlbotperms = JSON.parse(process.env.ADDLBOTPERMS); } catch (e) { addlbotperms = {}; }
var mutelist = [];

// status updating code
var version = require('./package.json').version;
async function updateStatus() {
  let newStatus = props.feat.status ?
    props.feat.status.replaceAll('{prefix}', defaultprefix).replaceAll('{guilds}', client.guilds.cache.size) : null;
  
  let currentStatus;
  try { currentStatus = client.user.presence.activities[0].name; } catch (e) {}
  
  let now = new Date();
  if (currentStatus != newStatus || !props.statusUpdatedAt || now.getTime() > props.statusUpdatedAt.getTime() + 24 * 60 * 60 * 1000) {
    try {
      client.user.setActivity(newStatus);
      props.statusUpdatedAt = now;
    } catch (e) {
      console.error(e);
    }
  }
}

// command variables
var commands = [], commandColl = new Discord.Collection(), commandCollWAliases = new Discord.Collection(), commandCategories = ['Information', 'Administrative', 'Interactive', 'Voice Channel', 'Music', 'Content', 'Troll'];

// command variables to be defined globally now as they are used globally afterward
Object.assign(global, { commands, commandColl, commandCollWAliases, commandCategories });

// bot config variables
var props = {
  feat: {
    version: process.env.VERSION ?? 'canary', // either 'normal' or 'canary'
    repl: true,
    savedms: true,
    loaddms: false,
    status: '{prefix} | {guilds} servers | {prefix}discord for support server',
  },
  saved: null,
  savedstringify: null,
  savescheduled: false,
  statusUpdatedAt: null,
  cCPUUsage: process.cpuUsage(),
  cCPUUsageDate: new Date(),
  pCPUUsage: null,
  pCPUUsageDate: null,
  CPUUsage: null,
  memoryUsage: process.memoryUsage(),
  botStatusChannel: null,
  botStatusMsg: null,
  botStatusMsgResolve: null,
  execCmdProcesses: [],
  data_code: global.props.data_code,
};

// prefix variable
var defaultprefix = props.feat.version == 'normal' ? '!' : '?';
var universalprefix = props.feat.version == 'normal' ? '!(thebotcat)' : '?(thebotcat)';

// prefix has to be defined globally now as it is used globally immediately afterward
Object.defineProperties(global, {
  defaultprefix: { configurable: true, enumerable: true, get: () => defaultprefix, set: val => { defaultprefix = val; } },
  universalprefix: { configurable: true, enumerable: true, get: () => universalprefix, set: val => { universalprefix = val; } },
});

// persData loading
var persData;
try {
  persData = common.persDataCreateVerifiedCopy(JSON.parse(process.env.PERSISTENT_DATA));
  console.log('Successfully loaded persData');
} catch (e) {
  console.error(`Unable to load persData: ${e.toString()}`);
  persData = { special_guilds: [], special_guilds_set: new Set(), propssaved_alias: {}, ids: { guilds: {}, channel: {}, user: {}, misc: {} } };
}

// propsSaved loading
if (fs.existsSync('props.json')) {
  try {
    props.saved = JSON.parse(props.savedstringify = fs.readFileSync('props.json').toString());
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

if (!props.saved) {
  props.saved = {};
  cleanPropsSaved();
  propsSave();
}

// setting propsSaved aliases
if (!props.saved.guilds) props.saved.guilds = {};
Object.keys(persData.propssaved_alias).forEach(x => {
  let alias = persData.propssaved_alias[x];
  Object.defineProperty(props.saved.guilds, x, {
    configurable: true,
    enumerable: false,
    get: () => props.saved.guilds[alias],
  });
});

if (!props.saved.guilds.default) props.saved.guilds.default = {};
Object.defineProperty(props.saved.guilds.default, 'prefix', {
  configurable: true, enumerable: false, get: () => defaultprefix, set: val => { defaultprefix = val; },
});

// propsSaved functions
function cleanPropsSaved() {
  props.saved = common.propsSavedCreateVerifiedCopy(props.saved);
  propsSave();
}

function propsSave() {
  let val;
  if ((val = JSON.stringify(props.saved, math.replacer)) != props.savedstringify) {
    fs.writeFileSync('props.json', val);
    props.savedstringify = val;
  }
}

function schedulePropsSave() {
  if (props.savescheduled) return;
  props.savescheduled = true;
  setTimeout(() => {
    propsSave();
    props.savescheduled = false;
  }, 60000);
}

// index eval
function indexeval(val) { eval(val); }

// logging functions
async function infomsg(guild, val) {
  let guildInfo = guild ? props.saved.guilds[guild.id] : undefined, channelId;
  if (guildInfo && (channelId = guildInfo.logging.main)) {
    if (persData.special_guilds_set.has(guild.id))
      nonlogmsg(`infomsg for ${guild.name}: ${val}`);
    return (await client.channels.fetch(channelId)).send(common.removePings(val));
  }
}

async function logmsg(val) {
  nonlogmsg(`logmsg ${val}`);
  return (await client.channels.fetch(persData.ids.channel.v0)).send(common.removePings(val));
}

function nonlogmsg(val) {
  console.log(`[${new Date().toISOString()}] ${val}`);
}

// command handling functions
function addCommand(cmd, category) {
  if (category)
    cmd = { category, ...cmd };
  commands.push(cmd);
  commandColl.set(cmd.name, cmd);
  commandCollWAliases.set(cmd.name, cmd);
  if (cmd.aliases) {
    cmd.aliases.forEach(x => {
      commandCollWAliases.set(x, cmd);
    });
  }
}

function addCommands(cmds, category) {
  cmds.forEach(x => addCommand(x, category));
}

function removeCommand(cmd) {
  var index;
  while ((index = commands.indexOf(cmd)) != -1)
    commands.splice(index, 1);
  commandColl.delete(cmd.name);
}

function removeCommands(cmds) {
  cmds.forEach(x => removeCommand(x));
}

function getCommandsCategorized(guilddata, slashContext) {
  let commandsList;
  if (guilddata == null) {
    commandsList = commands.filter(x => x.flags & 0b000010);
  } else if (!guilddata) {
    if (slashContext)
      commandsList = commands.filter(x => (x.flags & 0b101010) == 0b101010);
    else
      commandsList = commands.filter(x => (x.flags & 0b011010) == 0b011010);
  } else {
    if (slashContext)
      commandsList = commands.filter(x =>
        (x.flags & 0b100010) == 0b100010 && !(x.name != 'settings' &&
          (!guilddata.enabled_commands.global ||
          guilddata.enabled_commands.categories[x.category] == false ||
          guilddata.enabled_commands.commands[x.name] == false)));
    else
      commandsList = commands.filter(x =>
        (x.flags & 0b010110) == 0b010110 && !(x.name != 'settings' &&
          (!guilddata.enabled_commands.global ||
          guilddata.enabled_commands.categories[x.category] == false ||
          guilddata.enabled_commands.commands[x.name] == false)));
  }
  commandsList.map(x => x.aliases).filter(x => x).flat();
  let commandsCategorized = {}, uncategorized = [];
  commandsList.forEach(x => {
    if (x.category) {
      if (commandsCategorized[x.category])
        commandsCategorized[x.category].push(x);
      else
        commandsCategorized[x.category] = [x];
      if (x.aliases)
        commandsCategorized[x.category].push(...x.aliases.map(x => ({ name: x, alias: true })));
    } else {
      uncategorized.push(x);
      if (x.aliases)
        uncategorized.push(...x.aliases.map(x => ({ name: x, alias: true })));
    }
  });
  if (uncategorized.length > 0) commandsCategorized.Uncategorized = uncategorized;
  return [commandsList, commandsCategorized];
}

// adding commmands
addCommands(require('./commands/information.js'), 'Information');
addCommands(require('./commands/administrative-other.js'), 'Administrative');
addCommands(require('./commands/administrative-settings.js'), 'Administrative');
addCommands(require('./commands/administrative-main.js'), 'Administrative');
addCommands(require('./commands/interactive.js'), 'Interactive');
addCommands(require('./commands/vc.js'), 'Voice Channel');
addCommands(require('./commands/music.js'), 'Music');
addCommands(require('./commands/content.js'), 'Content');
addCommands(require('./commands/troll.js'), 'Troll');

// clean propssaved after commands are added
cleanPropsSaved();

async function updateSlashCommands(logfunc) {
  var currCmds = Array.from((await client.application.commands.fetch()).values());
  var currCmdsObj = {};
  currCmds.forEach(x => currCmdsObj[x.name] = x);
  
  var commandsToDelete = currCmds.filter(x => !commandColl.has(x.name) || (commandColl.get(x.name).flags & 0b100010) != 0b100010);
  
  var commandsToUpdate = currCmds.filter(x => {
    if (!commandColl.has(x.name) || (commandColl.get(x.name).flags & 0b100010) != 0b100010) return false;
    let cmd = commandColl.get(x.name);
    obj = {
      description: cmd.description_slash || cmd.description,
      options: cmd.options,
    };
    return common.slashCommandsInequal(currCmdsObj[x.name], obj);
  }).map(x => {
    let cmd = commandColl.get(x.name);
    return {
      name: cmd.name,
      description: cmd.description_slash || cmd.description,
      options: cmd.options,
    };
  });
  
  var commandsToAdd = commands.filter(x => !(x.name in currCmdsObj) && (commandColl.get(x.name).flags & 0b100010) == 0b100010).map(x => ({
    name: x.name,
    description: x.description_slash || x.description,
    options: x.options,
  }));
  
  var commandsToUpsert = [ ...commandsToUpdate, ...commandsToAdd ];
  
  // no bulk delete endpoint
  for (var commandToDelete of commandsToDelete) {
    logfunc(`Deleting ${commandToDelete.name}`);
    await client.application.commands.delete(commandToDelete);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // no bulk upsert endpoint
  for (var commandToUpsert of commandsToUpsert) {
    logfunc(`Upserting ${commandToUpsert.name}`);
    await client.application.commands.create(commandToUpsert);
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function updateNonPubSlashCommands(guildId, logfunc, extra) {
  var guildCommands = client.guilds.cache.get(guildId).commands;
  if (!extra) extra = { arr: [], coll: new Discord.Collection() };
  var currCmds = Array.from((await guildCommands.fetch()).values());
  var currCmdsObj = {};
  currCmds.forEach(x => currCmdsObj[x.name] = x);
  
  var commandsToDelete = currCmds.filter(x => (!commandColl.has(x.name) || (commandColl.get(x.name).flags & 0b100010) != 0b100000) && !extra.coll.has(x.name));
  
  var commandsToUpdate = currCmds.filter(x => {
    if ((!commandColl.has(x.name) || (commandColl.get(x.name).flags & 0b100010) != 0b100000) && !extra.coll.has(x.name)) return false;
    let obj = commandColl.get(x.name) ?? extra.coll.get(x.name);
    obj = {
      description: obj.description_slash || obj.description,
      options: obj.options,
    };
    return common.slashCommandsInequal(currCmdsObj[x.name], obj);
  }).map(x => {
    let cmd = commandColl.get(x.name);
    return {
      name: cmd.name,
      description: cmd.description_slash || cmd.description,
      options: cmd.options,
    };
  });
  
  var commandsToAdd = [ ...commands.filter(x => !(x.name in currCmdsObj) && (commandColl.get(x.name).flags & 0b100010) == 0b100000), ...extra.arr.filter(x => !(x.name in currCmdsObj) && (extra.coll.get(x.name).flags & 0b100010) == 0b100000) ].map(x => ({
    name: x.name,
    description: x.description_slash || x.description,
    options: x.options,
  }));
  
  var commandsToUpsert = [ ...commandsToUpdate, ...commandsToAdd ];
  
  // no bulk delete endpoint
  for (var commandToDelete of commandsToDelete) {
    logfunc(`Deleting ${commandToDelete.name}`);
    await guildCommands.delete(commandToDelete);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // no bulk upsert endpoint
  for (var commandToUpsert of commandsToUpsert) {
    logfunc(`Upserting ${commandToUpsert.name}`);
    await guildCommands.create(commandToUpsert);
    await new Promise(r => setTimeout(r, 1000));
  }
}

// slash commands updater
async function fullUpdateSlashCommands() {
  let loggedGlobalBegin = 0, logfunc = v => {
    if (loggedGlobalBegin == 0) {
      nonlogmsg('Updating global slash commands');
      nonlogmsg(v);
      loggedGlobalBegin = 1;
    } else {
      nonlogmsg(v);
    }
  };
  
  await updateSlashCommands(logfunc);
  if (loggedGlobalBegin == 1) nonlogmsg('Done updating global slash commands');
  
  let loggedGuildsUpdated = [];
  
  for (var guildId of persData.special_guilds) {
    if (!client.guilds.cache.has(guildId)) continue;
    let loggedOneGuildBegin = false, logfunc = v => {
      if (loggedOneGuildBegin == 0) {
        if (loggedGlobalBegin == 0) {
          loggedGlobalBegin = 2;
        }
        nonlogmsg(`Updating guild ${client.guilds.cache.get(guildId).name}`);
        nonlogmsg(v);
        loggedOneGuildBegin = true;
      } else {
        nonlogmsg(v);
      }
    };
    await updateNonPubSlashCommands(guildId, logfunc, guildId == persData.ids.guild.v2 ? props.data_code[2] : null);
    loggedGuildsUpdated.push(client.guilds.cache.get(guildId).name);
    if (loggedOneGuildBegin) nonlogmsg('Done updating slash commands for guild');
  }
  
  if (loggedGlobalBegin == 0 || loggedGlobalBegin == 2) {
    if (loggedGuildsUpdated.length) {
      nonlogmsg('Updated global slash commands, updated guild slash commands for:');
      nonlogmsg(loggedGuildsUpdated.join(', '));
    } else {
      nonlogmsg('Updated global slash commands, updated guild slash commands for no guilds');
    }
  } else if (loggedGlobalBegin == 1) {
    if (loggedGuildsUpdated.length) {
      nonlogmsg('Updated guild slash commands for:');
      nonlogmsg(loggedGuildsUpdated.join(', '));
    } else {
      nonlogmsg('Updated guild slash commands for no guilds');
    }
  }
}

// message handlers that should be run when botcat wakes
async function standardWakeHandlers() {
  if (props.feat.version == 'normal') {
    console.log('Checking for new messages in send only channel');
    let channel = client.channels.cache.get(persData.ids.channel.v1), messages;
    try {
      while (channel.lastMessageId != props.saved.misc.sendmsgid) {
        console.log('New messages detected');
        messages = await channel.messages.fetch({ after: props.saved.misc.sendmsgid });
        console.log('Loaded up to 50 new messages');
        messages = Array.from(messages.values()).sort((a, b) => { a = a.createdTimestamp; b = b.createdTimestamp; if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0; } });
        if (messages.length == 0) {
          props.saved.misc.sendmsgid = channel.lastMessageId;
          break;
        }
        for (var message of messages) {
          console.log(`Message handlering from ${props.saved.misc.sendmsgid}`);
          handlers.extra.message[0](message);
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } catch (e) {
      console.error(e.toString());
    }
    console.log('All caught up');
    cleanPropsSaved();
  }
}

// populate botStatusMessage
async function populateBotStatusMessage() {
  try {
    props.botStatusChannel = await client.channels.fetch('759507043685105757');
    if (props.feat.version == 'normal') {
      props.botStatusMsg = await props.botStatusChannel.messages.fetch('762432760680808479');
    } else if (props.feat.version == 'canary') {
      props.botStatusMsg = await props.botStatusChannel.messages.fetch('981658237533298738');
    }
  } catch (e) {
    console.error('Couldn\'t fetch bot status message');
    console.error(e);
  }
}

// client listeners
client.on('ready', async () => {
  nonlogmsg(`Logged in as ${client.user.tag}!`);
  
  updateStatus();
  
  await populateBotStatusMessage();
  
  await fullUpdateSlashCommands();
  
  readytime = new Date();
  
  await standardWakeHandlers();
  
  ready2time = new Date();
  
  if (props.feat.repl) startRepl();
  
  if (props.feat.loaddms) props.saved.misc.dmchannels.forEach(x => client.channels.fetch(x));
  
  ready3time = new Date();
});

client.on('guildCreate', () => {
  nonlogmsg('Joined a new guild!');
  
  updateStatus();
});

client.on('guildDelete', () => {
  nonlogmsg('Left a guild!');
  
  updateStatus();
});

client.on('reconnecting', () => {
  nonlogmsg('Reconnecting!');
});

client.on('disconnect', () => {
  nonlogmsg('Disconnected!');
});

['messageCreate', 'voiceStateUpdate', 'interactionCreate'].forEach(evtType => {
  client.on(evtType, async (...args) => {
    try {
      if (handlers.event[evtType]) {
        if (handlers.event[evtType].constructor == Function) handlers.event[evtType](...args);
        else await handlers.event[evtType](...args);
      }
    } catch (e) {
      console.error('ERROR in the handler function');
      console.error(e.stack);
      try {
        if (logErrors && errorCounter < 1) {
          errorCounter++;
          let oldLogErrors = logErrors;
          logErrors = false;
          client.channels.fetch(persData.ids.channel.v0).then(x => x.send('An error in the handler function has occurred.')).catch(e => {});
          logErrors = oldLogErrors;
        }
      } catch (e) {}
    }
  });
});

// tick function called every 60 seconds
var ticks = 0, tickStatUpdInt = 24 * 60, tickStatUpdNextPossible = false;
var tickFuncs = [];
function tickFunc() {
  if (ready3time) updateStatus();
  
  props.pCPUUsage = props.cCPUUsage;
  props.pCPUUsageDate = props.cCPUUsageDate;
  props.cCPUUsage = process.cpuUsage();
  props.cCPUUsageDate = new Date();
  var frac = (props.cCPUUsageDate.getTime() - props.pCPUUsageDate.getTime()) / 1000;
  props.CPUUsage = { user: (props.cCPUUsage.user - props.pCPUUsage.user) / (1000000 * frac), system: (props.cCPUUsage.system - props.pCPUUsage.system) / (1000000 * frac) };
  props.memoryUsage = process.memoryUsage();
  
  if (ticks % tickStatUpdInt == 0 || tickStatUpdNextPossible) {
    if (props.botStatusMsg && props.botStatusMsgResolve == null) {
      if (tickStatUpdNextPossible) tickStatUpdNextPossible = false;
      props.botStatusMsgResolve = props.botStatusMsg
        .edit(common.getBotcatFullStatusMessage(true, true))
        .then(x => props.botStatusMsgResolve = null)
        .catch(e => { console.error(e); props.botStatusMsgResolve = null; });
    } else {
      tickStatUpdNextPossible = true;
    }
  }
  
  if (ticks % 1440 == 0 && errorCounter > 0) errorCounter = 0;
  
  for (var tickFunc of tickFuncs) {
    tickFunc();
  }
  
  ticks++;
}
var tickInt = setInterval(() => tickFunc(), 60000);
var tickTimTemp = setTimeout(() => tickFunc(), 5000);

// uncaught unhandled handlers
process.on('uncaughtException', function (err) {
  console.error('ERROR uncaught exception. Bot state could be corrupted, contact coolguy284 or another developer. Details:');
  console.error(err);
  try {
    if (logErrors && errorCounter < 1) {
      errorCounter++;
      let oldLogErrors = logErrors;
      logErrors = false;
      client.channels.fetch(persData.ids.channel.v0).then(x => x.send('An uncaught exception has occurred.')).catch(e => {});
      logErrors = oldLogErrors;
    }
  } catch (e) {}
});

process.on('unhandledRejection', function (reason, p) {
  console.error('ERROR unhandled promise rejection from ' + p + ':');
  console.error(reason);
  try {
    if (logErrors && errorCounter < 1) {
      errorCounter++;
      let oldLogErrors = logErrors;
      logErrors = false;
      client.channels.fetch(persData.ids.channel.v0).then(x => x.send('An unhandled rejection has occurred.')).catch(e => {});
      logErrors = oldLogErrors;
    }
  } catch (e) {}
});

// exit handlers
function exitHandler() {
  if (props.feat.version == 'normal') {
    exitHandled++;
    switch (exitHandled - 1) {
      case 0:
        console.log('Are you sure you want to shut down thebotcat? Press Ctrl+C if yes.');
        setTimeout(() => { exitHandled = 0; startRepl(); }, 5000);
        break;
      case 2:
        shutdownBotImmediately();
        break;
      default:
        if (shutdownBot()) { exitHandled = 2; startRepl(); }
    }
  } else {
    if (exitHandled == 2) shutdownBotImmediately();
    if (exitHandled) return;
    exitHandled++;
    if (shutdownBot()) { exitHandled = 2; startRepl(); }
  }
}

function shutdownBotImmediately() {
  console.log('Shutting down');
  propsSave();
  process.removeAllListeners('exit');
  process.exit();
}

function shutdownBot(dontRunShutdown) {
  let text;
  
  if (Object.keys(props.saved.guilds).some(x=>props.saved.guilds[x].voice.mainloop)) {
    text = 'Someone\'s using me, no can do (currently playing music in a voice channel / voice channels).';
    console.log(text);
    return dontRunShutdown ? [text, false] : 1;
  }
  
  if (Object.keys(props.saved.guilds).some(x=>props.saved.guilds[x].voice.channel)) {
    text = 'Run this command within 1 minute (currently in a voice channel / voice channels):\n' +
      `${defaultprefix}eval ` + Object.keys(props.saved.guilds).map(x=>props.saved.guilds[x].voice.channel?`common.clientVCManager.join(props.saved.guilds["${x}"].voice,client.channels.cache.get("${props.saved.guilds[x].voice.channel.id}"))`:null).filter(x=>x).join(';') + ';';
  }
  
  if (text) console.log(text);
  
  if (!dontRunShutdown) shutdownBotImmediately();
  
  return dontRunShutdown ? [text, true] : 0;
}

process.on('exit', exitHandler);

process.on('SIGINT', exitHandler);

// defining vars as global
Object.assign(global, { developers, confirmdevelopers, addlbotperms, mutelist, updateStatus, persData, props, cleanPropsSaved, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, nonlogmsg, addCommand, addCommands, removeCommand, removeCommands, getCommandsCategorized, updateSlashCommands, updateNonPubSlashCommands, fullUpdateSlashCommands, standardWakeHandlers, populateBotStatusMessage, startRepl, handlers: common.handlers });

Object.defineProperties(global, {
  exitHandled: { configurable: true, enumerable: true, get: () => exitHandled, set: val => { exitHandled = val; } },
  starttime: { configurable: true, enumerable: true, get: () => starttime, set: val => { starttime = val; } },
  readytime: { configurable: true, enumerable: true, get: () => readytime, set: val => { readytime = val; } },
  ready2time: { configurable: true, enumerable: true, get: () => ready2time, set: val => { ready2time = val; } },
  ready3time: { configurable: true, enumerable: true, get: () => ready3time, set: val => { ready3time = val; } },
  doWorkers: { configurable: true, enumerable: true, get: () => doWorkers, set: val => { doWorkers = val; } },
  useYTDLP: { configurable: true, enumerable: true, get: () => useYTDLP, set: val => { useYTDLP = val; } },
  version: { configurable: true, enumerable: true, get: () => version, set: val => { version = val; } },
  messageHandler: { configurable: true, enumerable: true, get: () => handlers.event.message, set: val => { handlers.event.message = val; } },
  messageHandlers: { configurable: true, enumerable: true, get: () => handlers.extra.message, set: val => { handlers.extra.message = val; } },
  voiceStateUpdateHandler: { configurable: true, enumerable: true, get: () => voiceStateUpdateHandler, set: val => { voiceStateUpdateHandler = val; } },
  exitHandler: { configurable: true, enumerable: true, get: () => exitHandler, set: val => { exitHandler = val; } },
  shutdownBotImmediately: { configurable: true, enumerable: true, get: () => shutdownBotImmediately, set: val => { shutdownBotImmediately = val; } },
  shutdownBot: { configurable: true, enumerable: true, get: () => shutdownBot, set: val => { shutdownBot = val; } },
  ticks: { configurable: true, enumerable: true, get: () => ticks, set: val => { ticks = val; } },
  tickStatUpdInt: { configurable: true, enumerable: true, get: () => tickStatUpdInt, set: val => { tickStatUpdInt = val; } },
  tickStatUpdNextPossible: { configurable: true, enumerable: true, get: () => tickStatUpdNextPossible, set: val => { tickStatUpdNextPossible = val; } },
  tickFuncs: { configurable: true, enumerable: true, get: () => tickFuncs, set: val => { tickFuncs = val; } },
  tickFunc: { configurable: true, enumerable: true, get: () => tickFunc, set: val => { tickFunc = val; } },
  tickInt: { configurable: true, enumerable: true, get: () => tickInt, set: val => { tickInt = val;  } },
  tickTimTemp: { configurable: true, enumerable: true, get: () => tickTimTemp, set: val => { tickTimTemp = val; } },
});

// repl start function
function startRepl() {
  global.replServer = require('repl').start({
    prompt: '> ',
    terminal: true,
    useColors: true,
    useGlobal: true,
    preview: true,
    breakEvalOnSigint: true,
  });
  global.replServer.on('exit', exitHandler);
}

// login to discord
if (props.feat.version == 'normal') {
  client.login(process.env.THEBOTCAT_TOKEN);
} else if (props.feat.version == 'canary') {
  client.login(process.env.THEBOTCAT_CANARY_TOKEN);
}

// print info about repl
if (props.feat.repl) {
  console.log('To shut down thebotcat press Ctrl+C twice or Ctrl+D to exit the repl, after which a shutdown is performed that cleans up variables. Just pressing X could lead to data loss if props.saved was modified.');
} else {
  console.log('To shut down thebotcat press Ctrl+C, which performs a shutdown that cleans up variables. Just pressing X could lead to data loss if props.saved was modified.');
}
