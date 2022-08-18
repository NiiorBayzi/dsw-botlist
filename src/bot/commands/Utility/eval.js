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
    try {
      let code = message.args?.join(" ");
      let res;
      if (code.startsWith("--o ")) {
        message.args?.shift();
        code = message.args?.join(" ");
        this.client = message.client;
        this.message = message;
        this.Canvas = Canvas;
        res = require('util').inspect(await Object.getPrototypeOf(async () => { }).constructor(code)());
      } else {
        res = await require("util").inspect(eval(code));
      }

      message.channel.send(`\`\`\`js\n${res.slice(0, 1990)}\`\`\``)
    } catch (err) {
      message.channel.send(`\`\`\`js\n${err}\`\`\``)
    }
  }
}
