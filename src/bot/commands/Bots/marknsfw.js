const { Command } = require('klasa');
const Bots = require("@models/bots");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["nsfw", "toggle-nsfw", "togglensfw"],
            permissionLevel: 8,
            usage: "[User:user]"
        });
    }

    async run(message, [user]) {
        if (!user || !user.bot) return message.channel.send(`( <:dsw_mention:1000943619236175892> ) › Mencione um bot.`);
        let bot = await Bots.findOne({botid: user.id});
        await Bots.updateOne({ botid: user.id }, {$set: { nsfw: !bot.nsfw } })
        message.channel.send(`( 🚫 ) › O bot \`${user.tag}\` foi marcado como ${bot.nsfw ? "não" : ""} NSFW.`)
    }
};
