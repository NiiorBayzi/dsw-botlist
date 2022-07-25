const { Command } = require('klasa');
const Bots = require("@models/bots");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'count',
            runIn: ['text'],
            aliases: ["list", "botcount", "bot-count"],
            permLevel: 0,
            botPerms: ["SEND_MESSAGES"],
            requiredSettings: [],
            description: "Veja quantos bots já possuímos."
        });
    }

    async run(message) {
        let bots = await Bots.find({}, { _id: false })
        bots = bots.filter(bot => bot.state !== "deleted");
        if (bots.length === 1) message.channel.send(`( <:dsw_community:998275127122874428> ) › Possuímos \`1 Bots\` em nossa botlist.`)
        else message.channel.send(`( <:dsw_community:998275127122874428> ) › Possuímos \`${bots.length} Bots\` em nossa botlist.`)
    }
};
