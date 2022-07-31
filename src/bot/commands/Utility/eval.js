const { Command } = require('klasa');
const { inspect } = require('util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['ev', 'run'],
      permissionLevel: 7,
      description: 'Only developer.',
      deletable: true
    });
  }

  async run(message, [...params]) {
    try {
      var evaled = await inspect(eval(message));
    } catch(err) {
      var evaled = err;
    }

    message.channel.send(`\`\`\`js\n${evaled?.slice(0, 1990)\`\`\``);
  }
}
