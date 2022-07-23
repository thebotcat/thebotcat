module.exports = [
  {
    name: 'coinflip',
    description: '`!coinflip` returns heads or tails with 50% probability each',
    description_slash: 'returns heads or tails with 50% probability each',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, `I'm flipping a coin, and the result is...: ${common.randInt(0, 2) ? 'heads' : 'tails'}!`);
    },
    execute_slash(o, interaction, command, args) {
      let ephemeral = args[0] ? args[0].value : true;
      return common.slashCmdResp(o, ephemeral, `I'm flipping a coin, and the result is...: ${common.randInt(0, 2) ? 'heads' : 'tails'}!`);
    },
  },
  {
    name: 'roll',
    description: '`!roll [<# of sides> [<# of times>]] | [d]<# of sides>[(+|-)<modifier>] | #d#[(+|-)<modifier>]` rolls a dice with the given number of sides (defaulting to 6), the given number of times (defaulting to 1), and adds the results together (with an optional modifier)',
    description_slash: 'rolls a dice with the given number of sides (defaulting to 6), the given number of times',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'sides', description: 'the number of sides of the die, or dnd notation' },
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'times', description: 'the number of times to roll' },
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'modifier', description: 'the modifier to add at the end' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let match, sides, times, modifier;
      if (match = /^d?(-?[0-9.e]+) +([0-9.e]+)(?: +(-?[0-9.e]+))?$/.exec(o.argstring)) {
        sides = match[1];
        times = match[2];
        modifier = match[3];
      } else if (match = /^([0-9.e]+)d(-?[0-9.e]+)(?:\+?(-?[0-9.e]+))?$/.exec(o.argstring)) {
        sides = match[2];
        times = match[1];
        modifier = match[3];
      } else if (match = /^d?(-?[0-9.e]+)(?:\+?(-?[0-9.e]+))?$/.exec(o.argstring)) {
        sides = match[1];
        times = 1;
        modifier = match[2];
      } else { sides = 6n; times = 1; }
      
      if (typeof sides != 'bigint') {
        try { sides = BigInt(sides); } catch (e) { try { sides = BigInt(Math.floor(Number(sides))); } catch (e) { sides = 6n; } }
      }
      if (typeof times != 'number') {
        times = Math.max(Math.floor(Number(times)), 0);
      }
      if (modifier != null) try { modifier = BigInt(modifier); } catch (e) { try { modifier = BigInt(Math.floor(Number(modifier))); } catch (e) { modifier = null; } }
      
      let size = (sides.toString().length + 2) * (times + 1);
      if (size > 1960) return common.regCmdResp(o, `Limit on times for the given sides value is ${Math.floor(1960 / (sides.toString().length + 2) - 1)}`);
      
      let result = [];
      if (Number.isFinite(times) && times <= 10000) {
        for (var i = 0; i < times; i++)
          result.push(common.randInt(1n, sides + 1n));
      }
      
      return common.regCmdResp(o, `Result of rolling a ${times}d${sides}${modifier != null ? (modifier < 0 ? modifier : '+' + modifier) : ''}: ${result.join(', ')}${result.length > 1 || modifier != null && result.length == 1 ? '; ' : ''}${result.length > 1 || result.length == 0 || modifier != null ? 'total ' + (result.reduce((a, c) => a + c, 0n) + (modifier != null ? modifier : 0n)) : ''}`);
    },
    execute_slash(o, interaction, command, args) {
      let match, sides = args[0] ? args[0].value : 6, times, modifier;
      if (match = /^d?(-?[0-9.e]+)$/.exec(sides)) {
        sides = match[1];
        times = args[1] ? args[1].value : 1;
        modifier = args[2] ? args[2].value : undefined;
      } else if (match = /^([0-9.e]+)d(-?[0-9.e]+)(?:\+?(-?[0-9.e]+))?$/.exec(sides)) {
        sides = match[2];
        times = match[1];
        modifier = match[3];
      } else if (match = /^d?(-?[0-9.e]+)(?:\+?(-?[0-9.e]+))?$/.exec(sides)) {
        sides = match[1];
        times = 1;
        modifier = match[2];
      } else {
        sides = 6n;
        times = args[1] ? args[1].value : 1;
        modifier = args[2] ? args[2].value : undefined;
      }
      
      if (typeof sides != 'bigint') {
        try { sides = BigInt(sides); } catch (e) { try { sides = BigInt(Math.floor(Number(sides))); } catch (e) { sides = 6n; } }
      }
      if (typeof times != 'number') {
        times = Math.max(Math.floor(Number(times)), 0);
      }
      if (modifier != null) try { modifier = BigInt(modifier); } catch (e) { try { modifier = BigInt(Math.floor(Number(modifier))); } catch (e) { modifier = null; } }
      
      let size = (sides.toString().length + 2) * (times + 1);
      if (size > 1960) return common.slashCmdResp(o, true, `Limit on times for the given sides value is ${Math.floor(1960 / (sides.toString().length + 2) - 1)}`);
      
      let result = [];
      if (Number.isFinite(times) && times <= 10000) {
        for (var i = 0; i < times; i++)
          result.push(common.randInt(1n, sides + 1n));
      }
      
      let ephemeral = args[3] ? args[3].value : true;
      return common.slashCmdResp(o, ephemeral, `Result of rolling a ${times}d${sides}${modifier != null ? (modifier < 0 ? modifier : '+' + modifier) : ''}: ${result.join(', ')}${result.length > 1 || modifier != null && result.length == 1 ? '; ' : ''}${result.length > 1 || result.length == 0 || modifier != null ? 'total ' + (result.reduce((a, c) => a + c, 0n) + (modifier != null ? modifier : 0n)) : ''}`);
    },
  },
  {
    name: 'randint',
    description: '`!randint [[<min>] <max>]` returns a random integer between min and max (inclusive)',
    description_slash: 'returns a random integer between min and max (inclusive)',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'min', description: 'the minimum number that can be returned' },
      { type: Discord.ApplicationCommandOptionType.Integer, name: 'max', description: 'the maximum number that can be returned' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let min = 0n, max = 1n;
      if (rawArgs.length == 1) try { max = BigInt(rawArgs[0]); } catch (e) {}
      else if (rawArgs.length > 1) {
        try { min = BigInt(rawArgs[0]); } catch (e) {}
        try { max = BigInt(rawArgs[1]); } catch (e) {}
      }
      
      let minStrLen = min.toString().length, maxStrLen = max.toString().length;
      if (minStrLen + maxStrLen + Math.max(minStrLen, maxStrLen) > 1960) return common.regCmdResp(o, 'Integers too large.');
      
      return common.regCmdResp(o, `Random integer between ${min} and ${max}: ${common.randInt(min, max + 1n)}`);
    },
    execute_slash(o, interaction, command, args) {
      let min = (args[0] && args[0].value) ?? 0, max = (args[1] && args[1].value) ?? 1;
      
      let minStrLen = min.toString().length, maxStrLen = max.toString().length;
      if (minStrLen + maxStrLen + Math.max(minStrLen, maxStrLen) > 1960) return common.slashCmdResp(o, 'Integers too large.');
      
      let ephemeral = args[2] ? args[2].value : true;
      return common.slashCmdResp(o, ephemeral, `Random integer between ${min} and ${max}: ${common.randInt(min, max + 1)}`);
    },
  },
  {
    name: 'randfloat',
    description: '`!randfloat [[<min>] <max>]` returns a random real number between min and max (inclusive lower bound)',
    description_slash: 'returns a random real number between min and max (inclusive lower bound)',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'min', description: 'the minimum number that can be returned' },
      { type: Discord.ApplicationCommandOptionType.String, name: 'max', description: 'the maximum number that can be returned' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let min, max;
      if (rawArgs.length == 0) {
        min = 0; max = 1;
      } else if (rawArgs.length == 1) {
        min = 0; max = Number(rawArgs[0]); max = Number.isNaN(max) ? 1 : max;
      } else if (rawArgs.length > 1) {
        min = Number(rawArgs[0]); min = Number.isNaN(min) ? 0 : min;
        max = Number(rawArgs[1]); max = Number.isNaN(max) ? 1 : max;
      }
      return common.regCmdResp(o, `Random real number between ${min} and ${max}: ${min + common.randFloat() * (max - min)}`);
    },
    execute_slash(o, interaction, command, args) {
      let min = args[0] == null ? 0 : Number(args[0].value), max = args[1] == null ? 1 : Number(args[1].value);
      min = Number.isNaN(min) ? 0 : min; max = Number.isNaN(max) ? 1 : max;
      let ephemeral = args[2] ? args[2].value : true;
      return common.slashCmdResp(o, ephemeral, `Random real number between ${min} and ${max}: ${min + common.randFloat() * (max - min)}`);
    },
  },
  {
    name: 'choice',
    description: '`!choice <choice1> [<choice2> ...]` picks a random option from the choices given',
    description_slash: 'picks a random option from the choices given',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: '1', description: 'the first choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '2', description: 'the second choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '3', description: 'the third choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '4', description: 'the fourth choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '5', description: 'the fifth choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '6', description: 'the sixth choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '7', description: 'the seventh choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '8', description: 'the eigth choice' },
      { type: Discord.ApplicationCommandOptionType.String, name: '9', description: 'the ninth choice' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let choice = common.randInt(0, rawArgs.length);
      choice = rawArgs[choice];
      return common.regCmdResp(o, `Random choice: ${choice}`);
    },
    execute_slash(o, interaction, command, args) {
      let choices = args.filter(x => x != null && x.name != 'ephemeral');
      let choice = common.randInt(0, choices.length);
      choice = choices[choice] && choices[choice].value;
      let ephemeral = args[9] ? args[9].value : true;
      return common.slashCmdResp(o, ephemeral, `Random choice: ${choice}`);
    },
  },
  {
    name: 'rps',
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    description_slash: 'plays a game of rock paper scissors with me, where I pick one randomly',
    flags: 0b111110,
    options: [
      {
        type: Discord.ApplicationCommandOptionType.String, name: 'choice', description: 'your choice', required: true,
        choices: [ { name: 'rock', value: 'rock' }, { name: 'paper', value: 'paper' }, { name: 'scissors', value: 'scissors' } ],
      },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = rawArgs[0];
      if (!uReply) return common.regCmdResp(o, `Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return common.regCmdResp(o, `Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = replies[common.randInt(0, replies.length)];
      
      let status = common.rps(uReply, result);
      
      if (status == 0) {
        return common.regCmdResp(o, `It's a tie! We had the same choice. (${result})`);
      } else if (status == 1) {
        return common.regCmdResp(o, `I chose ${result}, I won!`);
      } else if (status == -1) {
        return common.regCmdResp(o, `I chose ${result}, you won!`);
      }
    },
    execute_slash(o, interaction, command, args) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = args[0].value;
      
      let result = replies[common.randInt(0, replies.length)];
      
      let status = common.rps(uReply, result);
      
      let ephemeral = args[1] ? args[1].value : true;
      if (status == 0) {
        return common.slashCmdResp(o, ephemeral, `It's a tie! We had the same choice. (${result})`);
      } else if (status == 1) {
        return common.slashCmdResp(o, ephemeral, `I chose ${result}, I won!`);
      } else if (status == -1) {
        return common.slashCmdResp(o, ephemeral, `I chose ${result}, you won!`);
      }
    },
  },
  {
    name: 'spoilerbubblewrap',
    description: '`!spoilerbubblewrap <text>` returns text to copy paste that contains the original text wrapped in spoilers for every character',
    description_slash: 'returns text to copy paste that contains the original text wrapped in spoilers for every character',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'text', description: 'the text', required: true } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, 'wrapped: ' + o.asOneArg.split('').map(x => `\\||${x}\\||`).join(''));
    },
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, true, 'wrapped: ' + args[0].value.split('').map(x => `\\||${x}\\||`).join(''));
    },
  },
  {
    name: 'calc',
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate (<https://mathjs.org/docs/expressions/index.html> for info)\n' +
      'Additional functions:\n' +
      '  `delete`:\n' +
      '    `delete(obj, prop)` to delete `prop` from `obj`\n' +
      '    `delete(prop)` to delete `prop` from global scope\n' +
      '  `cryptRandom`:\n' +
      '    `cryptRandom()` for cryptographically-random float between `0` and `1`\n' +
      '    `cryptRandom(max)` for cryptographically-random float between `0` and `max`\n' +
      '    `cryptRandom(min, max)` for cryptographically-random float between `min` and `max`\n' +
      '  `cryptRandomInt`: same as `cryptRandom` but returns integers\n' +
      '  `cryptRandomBig`: same as `cryptRandom` but returns full precision bignumbers\n' +
      '`!calc :view` to print out serialized JSON of your calc scope\n' +
      '`!calc :clear` to clear your calc scope',
    description_slash: 'calculates an expression using math.js evaluate, do `help calc` for more information',
    flags: 0b111110,
    options: [
      { type: Discord.ApplicationCommandOptionType.String, name: 'expression', description: 'the expression to evaluate' },
      { type: Discord.ApplicationCommandOptionType.Boolean, name: 'ephemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.feat.calc) return common.regCmdResp(o, 'Calculation features are disabled');
      let expr = o.asOneArg;
      nonlogmsg(`calculating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(expr)}`);
      let user = props.saved.users[msg.author.id];
      if (!user) {
        if (expr == ':view' || expr == ':clear') return common.regCmdResp(o, 'User object not created yet');
        else {
          user = props.saved.users[msg.author.id] = common.getEmptyUserObject(props.saved.guilds[msg.guild.id]);
          schedulePropsSave();
        }
      }
      
      if (expr == ':view') {
        let text;
        if (user.calc_scope.length <= 2000) {
          console.log(text = user.calc_scope);
          return common.regCmdResp(o, text);
        } else {
          let scopeVars = Reflect.ownKeys(JSON.parse(user.calc_scope)).join(', ');
          if (scopeVars.length <= 1950) {
            console.log(text = `Scope too big to fit in a discord message, variables:\n${scopeVars}`);
            return common.regCmdResp(o, text);
          } else {
            console.log(text = 'Scope variables too big to fit in a discord message, use `!calc :clear` to wipe');
            return common.regCmdResp(o, text);
          }
        }
      } else if (expr == ':clear') {
        let text;
        if (user.calc_scope) {
          user.calc_scope = '{}';
          schedulePropsSave();
          console.log(text = 'Cleared scope successfully');
          return common.regCmdResp(o, text);
        } else {
          console.log(text = 'You do not have a scope created yet');
          return common.regCmdResp(o, text);
        }
      } else {
        let promise, res, calc_scope_new, shared_calc_scope_new;
        if (doWorkers) {
          if (calccontext == null) calccontext = 1;
          else calccontext++;
          try {
            if (!user.calc_scope_running) {
              try {
                user.calc_scope_running = true;
                [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}']);
                if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
                if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
                res = `Result: ${res}`;
              } catch (e) { throw e; }
              finally {
                user.calc_scope_running = false;
              }
            } else {
              [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}', 5]);
              if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
              if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
              res = `Result: ${res}`;
            }
            promise = common.regCmdResp(o, res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = common.regCmdResp(o, `Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else if (/^Error: Workerpool Worker terminated Unexpectedly/.test(res)) {
              promise = common.regCmdResp(o, 'Error: Workerpool Worker Terminated Unexpectedly (possibly an out of memory error)');
            } else {
              promise = common.regCmdResp(o, res);
            }
          } finally {
            calccontext--;
            if (calccontext <= 0) global.calccontext = null;
          }
        } else {
          let scope = JSON.parse(user.calc_scope, math.reviver);
          Object.defineProperty(scope, 'shared', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: JSON.parse(props.saved.users.default ? props.saved.users.default.calc_scope : '{}', math.reviver),
          });
          global.calccontext = scope;
          try {
            mathVMContext.expr = expr;
            mathVMContext.scope = scope;
            vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, { timeout: common.isDeveloper(msg) ? 1000 : 5 });
            res = mathVMContext.res;
            if (res === undefined) res = 'undefined';
            else if (res === null) res = 'null';
            else if (typeof res == 'string') res = util.inspect(res);
            else if (Object.getPrototypeOf(res) == Object.prototype) {
              res = math.matrix([res]).toString();
              res = res.slice(1, res.length - 1);
            } else res = res.toString();
            if (res.length > 1900) res = res.slice(0, 1900) + '...';
            res = `Result: ${res}`;
            calc_scope_new = JSON.stringify(scope, math.replacer);
            shared_calc_scope_new = JSON.stringify(scope.shared, math.replacer);
            calc_scope_new = user.calc_scope != calc_scope_new ? calc_scope_new : null;
            shared_calc_scope_new = (props.saved.users.default ? props.saved.users.default.calc_scope : '{}') != shared_calc_scope_new ? shared_calc_scope_new : null;
            if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
            if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
            promise = common.regCmdResp(o, res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = common.regCmdResp(o, `Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else {
              promise = common.regCmdResp(o, res);
            }
          } finally {
            global.calccontext = null;
          }
        }
        return promise;
      }
    },
    async execute_slash(o, interaction, command, args) {
      let ephemeral = args[1] ? args[1].value : true;
      if (!props.saved.feat.calc) return common.slashCmdResp(o, ephemeral, 'Calculation features are disabled');
      let expr = args[0] ? args[0].value : '';
      nonlogmsg(`calculating from ${o.author.tag} (id ${o.author.id}) in ${common.explainChannel(o.channel)}: ${util.inspect(expr)}`);
      let user = props.saved.users[o.author.id];
      if (!user) {
        if (expr == ':view' || expr == ':clear') return common.slashCmdResp(o, ephemeral, 'User object not created yet');
        else {
          user = props.saved.users[o.author.id] = common.getEmptyUserObject();
          schedulePropsSave();
        }
      }
      
      if (expr == ':view') {
        let text;
        if (user.calc_scope.length <= 2000) {
          console.log(text = user.calc_scope);
          return common.slashCmdResp(o, ephemeral, text);
        } else {
          let scopeVars = Reflect.ownKeys(JSON.parse(user.calc_scope)).join(', ');
          if (scopeVars.length <= 1950) {
            console.log(text = `Scope too big to fit in a discord message, variables:\n${scopeVars}`);
            return common.slashCmdResp(o, ephemeral, text);
          } else {
            console.log(text = 'Scope variables too big to fit in a discord message, use `!calc :clear` to wipe');
            return common.slashCmdResp(o, ephemeral, text);
          }
        }
      } else if (expr == ':clear') {
        let text;
        if (user.calc_scope) {
          user.calc_scope = '{}';
          schedulePropsSave();
          console.log(text = 'Cleared scope successfully');
          return common.slashCmdResp(o, ephemeral, text);
        } else {
          console.log(text = 'You do not have a scope created yet');
          return common.slashCmdResp(o, ephemeral, text);
        }
      } else {
        let promise, res, calc_scope_new, shared_calc_scope_new;
        if (doWorkers) {
          if (calccontext == null) calccontext = 1;
          else calccontext++;
          try {
            if (!user.calc_scope_running) {
              try {
                user.calc_scope_running = true;
                [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}']);
                if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
                if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
                res = `Result: ${res}`;
              } catch (e) { throw e; }
              finally {
                user.calc_scope_running = false;
              }
            } else {
              [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}', 5]);
              if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
              if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
              res = `Result: ${res}`;
            }
            promise = common.slashCmdResp(o, ephemeral, res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = common.slashCmdResp(o, ephemeral, `Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else if (/^Error: Workerpool Worker terminated Unexpectedly/.test(res)) {
              promise = common.slashCmdResp(o, ephemeral, 'Error: Workerpool Worker Terminated Unexpectedly (possibly an out of memory error)');
            } else {
              promise = common.slashCmdResp(o, ephemeral, res);
            }
          } finally {
            calccontext--;
            if (calccontext <= 0) global.calccontext = null;
          }
        } else {
          let scope = JSON.parse(user.calc_scope, math.reviver);
          Object.defineProperty(scope, 'shared', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: JSON.parse(props.saved.users.default ? props.saved.users.default.calc_scope : '{}', math.reviver),
          });
          global.calccontext = scope;
          try {
            mathVMContext.expr = expr;
            mathVMContext.scope = scope;
            vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, { timeout: common.isDeveloper(msg) ? 1000 : 5 });
            res = mathVMContext.res;
            if (res === undefined) res = 'undefined';
            else if (res === null) res = 'null';
            else if (typeof res == 'string') res = util.inspect(res);
            else if (Object.getPrototypeOf(res) == Object.prototype) {
              res = math.matrix([res]).toString();
              res = res.slice(1, res.length - 1);
            } else res = res.toString();
            if (res.length > 1900) res = res.slice(0, 1900) + '...';
            res = `Result: ${res}`;
            calc_scope_new = JSON.stringify(scope, math.replacer);
            shared_calc_scope_new = JSON.stringify(scope.shared, math.replacer);
            calc_scope_new = user.calc_scope != calc_scope_new ? calc_scope_new : null;
            shared_calc_scope_new = (props.saved.users.default ? props.saved.users.default.calc_scope : '{}') != shared_calc_scope_new ? shared_calc_scope_new : null;
            if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
            if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
            promise = common.slashCmdResp(o, ephemeral, res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = common.slashCmdResp(o, ephemeral, `Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else {
              promise = common.slashCmdResp(o, ephemeral, res);
            }
          } finally {
            global.calccontext = null;
          }
        }
        return promise;
      }
    },
  },
  {
    name: 'echo',
    description: '`!echo [string]` prints out the exact string sent to the command',
    description_slash: 'prints out the exact string sent to the command',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'string', description: 'the string parameter' } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, 'echo: ' + JSON.stringify(o.argstring).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    },
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, true, 'echo: ' + JSON.stringify(args[0] && args[0].value || '').replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    },
  },
  {
    name: 'echoargs',
    description: '`!echoargs [arguments]` prints out the parsed version of the arguments sent to the command',
    description_slash: 'prints out the parsed version of the arguments sent to the command',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'arguments', description: 'all non slash command arguments in one string parameter' } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, JSON.stringify({ rawArgs, args: o.args, kwargs: o.kwargs }).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    },
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, true, JSON.stringify(common.parseArgs(args[0] && args[0].value || '')).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    },
  },
  {
    name: 'lathe',
    description: 'lathe strategies',
    flags: 0b111110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'goe', description: 'mama' } ],
    execute(o, msg, rawArgs) {
      return common.regCmdResp(o, rawArgs[0] ? 'val: ' + rawArgs[0] : 'no val',);
    },
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, false, args[0] ? 'val: ' + args[0].value : 'no val');
    },
  },
  {
    name: 'lathe2',
    description: 'this one doesnt send a message in the channel so nobody knows you ran it oOo',
    flags: 0b101110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'goe', description: 'mama' } ],
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, true, args[0] ? 'val: ' + args[0].value : 'no val');
    },
  },
  {
    name: 'lathe3',
    description: 'lathe but no arguments',
    flags: 0b101110,
    execute_slash(o, interaction, command, args) {
      return common.slashCmdResp(o, true, 'no val');
    },
  },
  {
    name: 'lathe4',
    description: 'deferred ack version',
    flags: 0b101110,
    options: [ { type: Discord.ApplicationCommandOptionType.String, name: 'goe', description: 'mama' } ],
    execute_slash(o, interaction, command, args) {
      interaction.deferReply({ ephemeral: true });
      setTimeout(() => {
        interaction.editReply({ content: args[0] ? 'val: ' + args[0].value : 'no val' });
      }, 5000);
    },
  },
];
