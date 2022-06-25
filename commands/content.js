/* fs.writeFileSync('ctnt.json', (() => {
  /* Discord = {
    MessageEmbed: class MessageEmbed {
      setImage(v) { this.url = v; return this; }
      setTitle(v) { this.title = v; return this; }
      setDescription(v) { this.description = v; return this; }
      setFooter(v) { this.footer = v; return this; }
    }
  }; * /
  
  let content_types = {
    "hey": "text_reply", "who am i": "text_reply", "temmie": "text_reply", "vsco": "text_reply", "bot": "text_reply", "pls money": "text_reply", "unretard": "text_reply", "techku": "text_reply", "goe mama": "text", "pp": "text_reply",
    "shut": "image", "joke": "text_multi_reply", "fun fact": "text_multi_reply", "pun": "text_multi_reply",
    "meme": "image_multi", "trump": "image_multi", "corona meme": "image_multi", "wholesome": "image_multi", "bonk": "image_multi", "cute animal": "image_multi", "doggo": "image_multi", "uwu": "image_multi", "surreal": "image_multi", "minecraft": "image_multi", "fortnite": "image", "gamer": "image", "true gamer": "image", "me lon": "image_multi", "mulan": "image", "poggers fish": "image_multi", "big boi": "image", "hug": "image", "bruh": "image"
  };
  return '{\n' + commands.map(x => {
    let type = content_types[x.name];
    if (!type) {
      console.log(`no command type for ${x.name}`);
      return `  ${JSON.stringify(x.name)}: null,`;
    }
    switch (type) {
      case 'text': {
        let text;
        x.execute({ channel: { send: v => text = v } });
        return `  ${JSON.stringify(x.name)}: { "type": ${JSON.stringify(type)}, "content": ${JSON.stringify(text)} },`;
      }
      case 'text_reply': {
        let text;
        x.execute({ reply: v => text = v });
        return `  ${JSON.stringify(x.name)}: { "type": ${JSON.stringify(type)}, "content": ${JSON.stringify(text)} },`;
      }
      case 'text_multi_reply': {
        let amount = Number(/(?<=Math.random\(\) \* )[0-9]+/.exec(x.execute.toString()));
        let texts = [];
        for (let i = 0; i < amount; i++)
          x.execute({ reply: v => texts.push(v) }, 0, 0, 0, [i + 1 + '']);
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)},\n    "contents": ${JSON.stringify(texts, null, 2).split('\n').map(x => '    ' + x).join('\n').trim()}\n  },`;
      }
      case 'image': {
        let embed;
        x.execute({ channel: { send: v => embed = v } });
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)}${embed.title ? `,\n    "title": ${JSON.stringify(embed.title)}` : ''}${embed.description ? `, "desc": ${JSON.stringify(embed.description)}` : ''}${embed.url ? `,\n    "image": ${JSON.stringify(embed.url)}` : ''}${embed.footer ? `,\n    "footer": ${JSON.stringify(embed.footer)}` : ''}\n  },`;
      }
      case 'image_multi': {
        let amount = Number(/(?<=Math.random\(\) \* )[0-9]+/.exec(x.execute.toString()));
        let embeds = [];
        for (let i = 0; i < amount; i++)
          x.execute({ channel: { send: v => embeds.push(v) } }, 0, 0, 0, [i + 1 + '']);
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)},\n    "embeds": ${JSON.stringify(embeds.map(x => ({ title: x.title, desc: x.description, image: x.url, footer: x.footer })), null, 2).split('\n').map(x => '    ' + x).join('\n').trim()}\n  },`;
      }
      default:
        throw new Error(`Content type not provided for command ${x.name}`);
    }
  }).join('\n') + '\n}';
})()); */

try {
  var commands = JSON.parse(fs.readFileSync(require.resolve('./content_commands.json')));
} catch (e) {
  console.error(e);
  var commands = {};
}

function contentCommand(o, msg, rawArgs) {
  let obj = commands[o.cmdName];
  switch (obj.type) {
    case 'text': return common.regCmdResp(o, obj.content);
    case 'text_reply': return msg.reply(obj.content);
    case 'text_multi_reply':
      if (rawArgs.length == 0) {
        return msg.reply(obj.contents[common.randInt(0, obj.contents.length)]);
      } else if (rawArgs[0] == 'count') {
        return common.regCmdResp(o, `The command has ${obj.contents.length} entries.`);
      } else {
        let num = Number(rawArgs[0]);
        if (!Number.isSafeInteger(num)) return common.regCmdResp(o, 'Invalid command entry number.');
        if (num < 1) return common.regCmdResp(o, 'Entry number must be greater than or equal to 1.');
        if (num > obj.contents.length) return common.regCmdResp(o, `Entry number greater than number of items. (${obj.contents.length})`);
        return msg.reply(obj.contents[num - 1]);
      }
    case 'image':
      return common.regCmdResp(o, { embeds: [{ title: obj.title, description: obj.desc, image: { url: obj.image }, footer: { text: obj.footer } }] });
    case 'image_multi':
      if (rawArgs.length == 0) {
        let embed = obj.embeds[common.randInt(0, obj.embeds.length)];
        return common.regCmdResp(o, { embeds: [{ title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } }] });
      } else if (rawArgs[0] == 'count') {
        return common.regCmdResp(o, `The command has ${obj.embeds.length} entries.`);
      } else {
        let num = Number(rawArgs[0]);
        if (!Number.isSafeInteger(num)) return common.regCmdResp(o, 'Invalid command entry number.');
        if (num < 1) return common.regCmdResp(o, 'Entry number must be greater than or equal to 1.');
        if (num > obj.embeds.length) return common.regCmdResp(o, `Entry number greater than number of items. (${obj.embeds.length})`);
        let embed = obj.embeds[num - 1];
        return common.regCmdResp(o, { embeds: [{ title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } }] });
      }
  }
}

function contentCommandNonSlash(o, msg, rawArgs) {
  let obj = commands[rawArgs[0] ? rawArgs[0].replaceAll('_', ' ') : ''];
  if (!obj) return common.regCmdResp(o, 'Invalid content name.');
  switch (obj.type) {
    case 'text': return common.regCmdResp(o, obj.content);
    case 'text_reply': return msg.reply(obj.content);
    case 'text_multi_reply':
      if (!rawArgs[1]) {
        return msg.reply(obj.contents[common.randInt(0, obj.contents.length)]);
      } else if (rawArgs[1] == 'count') {
        return common.regCmdResp(o, `The command has ${obj.contents.length} entries.`);
      } else {
        let num = Number(rawArgs[1]);
        if (!Number.isSafeInteger(num)) return common.regCmdResp(o, 'Invalid command entry number.');
        if (num < 1) return common.regCmdResp(o, 'Entry number must be greater than or equal to 1.');
        if (num > obj.contents.length) return common.regCmdResp(o, `Entry number greater than number of items. (${obj.contents.length})`);
        return msg.reply(obj.contents[num - 1]);
      }
    case 'image':
      return common.regCmdResp(o, { embeds: [{ title: obj.title, description: obj.desc, image: { url: obj.image }, footer: { text: obj.footer } }] });
    case 'image_multi':
      if (!rawArgs[1]) {
        let embed = obj.embeds[common.randInt(0, obj.embeds.length)];
        return common.regCmdResp(o, { embeds: [{ title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } }] });
      } else if (rawArgs[1] == 'count') {
        return common.regCmdResp(o, `The command has ${obj.embeds.length} entries.`);
      } else {
        let num = Number(rawArgs[1]);
        if (!Number.isSafeInteger(num)) return common.regCmdResp(o, 'Invalid command entry number.');
        if (num < 1) return common.regCmdResp(o, 'Entry number must be greater than or equal to 1.');
        if (num > obj.embeds.length) return common.regCmdResp(o, `Entry number greater than number of items. (${obj.embeds.length})`);
        let embed = obj.embeds[num - 1];
        return common.regCmdResp(o, { embeds: [{ title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } }] });
      }
  }
}

function contentCommandSlash(o, interaction, command, args) {
  let obj = commands[args[0].name.replaceAll('_', ' ')];
  switch (obj.type) {
    case 'text': return common.slashCmdResp(o, false, obj.content);
    case 'text_reply': return common.slashCmdResp(o, false, `<@${o.author.id}>, ` + obj.content);
    case 'text_multi_reply':
      if (!args[0].options[0]) {
        return common.slashCmdResp(o, false, `<@${o.author.id}>, ` + obj.contents[common.randInt(0, obj.contents.length)]);
      } else if (args[0].options[0].value == 'count') {
        return common.slashCmdResp(o, true, `The command has ${obj.contents.length} entries.`);
      } else {
        let num = Number(args[0].options[0].value);
        if (!Number.isSafeInteger(num)) return common.slashCmdResp(o, true, 'Invalid command entry number.');
        if (num < 1) return common.slashCmdResp(o, true, 'Entry number must be greater than or equal to 1.');
        if (num > obj.contents.length) return common.slashCmdResp(o, true, `Entry number greater than number of items. (${obj.contents.length})`);
        return common.slashCmdResp(o, false, `<@${o.author.id}>, ` + obj.contents[num - 1]);
      }
    case 'image':
      return common.slashCmdResp(o, false, { title: obj.title, description: obj.desc, image: { url: obj.image }, footer: { text: obj.footer } });
    case 'image_multi':
      if (!args[0].options[0]) {
        let embed = obj.embeds[common.randInt(0, obj.embeds.length)];
        return common.slashCmdResp(o, false, { title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } });
      } else if (args[0].options[0].value == 'count') {
        return common.slashCmdResp(o, true, `The command has ${obj.embeds.length} entries.`);
      } else {
        let num = Number(args[0].options[0].value);
        if (!Number.isSafeInteger(num)) return common.slashCmdResp(o, true, 'Invalid command entry number.');
        if (num < 1) return common.slashCmdResp(o, true, 'Entry number must be greater than or equal to 1.');
        if (num > obj.embeds.length) return common.slashCmdResp(o, true, `Entry number greater than number of items. (${obj.embeds.length})`);
        let embed = obj.embeds[num - 1];
        return common.slashCmdResp(o, false, { title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } });
      }
  }
}

module.exports = exports = [];

let commandKeys = Object.keys(commands);

for (var i = 0, numCommands = commandKeys.length / 25; i < numCommands; i++) {
  exports.push({
    name: `content${i ? i + 1 : ''}`,
    description_slash: `content${i ? i + 1 : ''}.`,
    flags: i == 0 ? 0b111110 : 0b101110,
    options: commandKeys.slice(i * 25, i * 25 + 25).map(x => ({
      type: 'SUB_COMMAND', name: x.replaceAll(' ', '_'), description: `type: ${commands[x].type.replaceAll('_', ' ')}`,
      ...commands[x].type.includes('multi') && {
        options: [ { type: 'STRING', name: 'value', description: 'empty for random content, a number for a specific content, and \'count\' for total number of contents' } ],
      },
    })),
    ...i == 0 && { execute: contentCommandNonSlash },
    execute_slash: contentCommandSlash,
  });
}

commandKeys.forEach(x => exports.push({
  name: x,
  flags: commands[x].type.endsWith('_multi') ? 0b011110 : 0b011111,
  execute: contentCommand,
}));

exports.push(
  {
    name: 'lamo',
    description_slash: 'puts a lamo in chat',
    flags: 0b111110,
    options: [ { type: 'INTEGER', name: 'length', description: 'length of the lamo', required: true } ],
    execute(o, msg, rawArgs) {
      let len = Math.min(Math.max(Math.floor(Number(rawArgs[0])), 3), 100);
      if (len != len || len < 4) {
        return common.regCmdResp(o, 'lamomamoemao');
      } else {
        len -= 4;
        let text = '', lastchar = 'o';
        let options = ['a', 'e', 'm', 'o'];
        let randints = common.randInts(0, 3, len--);
        for (; len >= 0; len--)
          text += lastchar = options.filter(x => x != lastchar)[randints[len]];
        if (text[text.length - 1] != 'o') text += 'o';
        return common.regCmdResp(o, `lamo${text}`);
      }
    },
    execute_slash(o, interaction, command, args) {
      let len = Math.min(Math.max(args[0].value, 3), 100);
      if (len != len || len < 4) {
        return common.slashCmdResp(o, false, 'lamomamoemao');
      } else {
        len -= 4;
        let text = '', lastchar = 'o';
        let options = ['a', 'e', 'm', 'o'];
        let randints = common.randInts(0, 3, len--);
        for (; len >= 0; len--)
          text += lastchar = options.filter(x => x != lastchar)[randints[len]];
        if (text[text.length - 1] != 'o') text += 'o';
        return common.slashCmdResp(o, false, `lamo${text}`);
      }
    },
  },
  {
    name: 'segue',
    flags: 0b011101,
    execute: props.data_code[1],
  },
  {
    name: 'hack',
    flags: 0b011110,
    execute(o, msg, rawArgs) {
      if (!rawArgs[0] || rawArgs[0].toLowerCase() == 'thebotcat') {
        return msg.reply('dont hack me plz');
      } else if (rawArgs[0].toLowerCase() == 'ryujin') {
        return msg.reply('bruh');
      } else if (rawArgs[0].toLowerCase() == 'coolguy284') {
        return msg.reply('bruhhurb');
      }
    },
  },
);

exports.contentCommand = contentCommand;
