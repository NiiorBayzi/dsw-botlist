const { Command } = require('klasa');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { inspect } = require('util');
const { loadImage, createCanvas, Context2d, ...Canvas } = require('canvas');
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
    try {
      var evaled = await inspect(eval(message.args?.join(' ')));
    } catch(err) {
      var evaled = err;
    }
    evaled = `${evaled}`;

    message.channel.send(`\`\`\`js\n${evaled.slice(0, 1990)}\`\`\``);
  }
}
