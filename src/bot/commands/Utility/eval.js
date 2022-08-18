const { Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { inspect } = require('util');
const Canvas = require('@napi-rs/canvas');
const Bots = require("@models/bots");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['ev', 'run'],
      permissionLevel: 9,
      description: 'Only developer.',
      deletable: true
    });
  }

  async run(message, [...params]) {
    let evaled;
    evaled = await inspect(eval(message.args?.join(' ')).catch((err) => { evaled = err }));
    evaled = `${evaled}`;

    message.channel.send(`\`\`\`js\n${evaled.slice(0, 1990)}\`\`\``);
  }
}
