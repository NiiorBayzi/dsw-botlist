const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Bots = require("@models/bots");

const { server: {mod_log_id, role_ids} } = require("@root/config.json");

var modLog;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            permissionLevel: 8,
            usage: '[User:user]'
        });
    }

    async run(message, [user]) {
        if (!user || !user.bot) return message.channel.send(`**( <:dsw_mention:1000943619236175892> ) › ${message.author.username}**, Mencione um bot.`);
        let bot = await Bots.findOne({botid: user.id}, { _id: false });

        const botUser = await this.client.users.fetch(user.id);
        if (bot.logo !== botUser.displayAvatarURL({format: "png", size: 256}))
            await Bots.updateOne({ botid: user.id }, {$set: {state: "verified", logo: botUser.displayAvatarURL({format: "png", size: 256})}});
        else 
            await Bots.updateOne({ botid: user.id }, {$set: { state: "verified" } })
        
        let owners = [bot.owners.primary].concat(bot.owners.additional)
        let e = new MessageEmbed()
            .setTitle('( <:dsw_verified:1000944362492022964> ) | Bot Verificado')
            .addField(`Bot`, `<@${bot.botid}>`, true)
            .addField(`Desenvolvedor(es)`, owners.map(x => x ? `<@${x}>` : ""), true)
            .addField(`Analisador`, message.author, true)
            .setThumbnail(botUser.displayAvatarURL({format: "png", size: 256}))
            .setTimestamp()
            .setColor(0x26ff00)
        modLog.send(e);
        modLog.send(owners.map(x => x ? `<@${x}>` : "")).then(m => { m.delete() });

        owners = await message.guild.members.fetch({user:owners})
        owners.forEach(o => {
            o.roles.add(message.guild.roles.cache.get(role_ids.bot_developer));
            o.send(`( <:dsw_iconBot:1000946700694863923> ) › Seu bot \`${bot.username}\` foi verificado.`)
        })
        message.guild.members.fetch(message.client.users.cache.find(u => u.id === bot.botid)).then(bot => {
            bot.roles.set([role_ids.verified]);
        })
        message.channel.send(`( <:dsw_iconBot:1000946700694863923> ) › O bot \`${bot.username}\` foi verificado.`);
    }

    async init() {
        modLog = await this.client.channels.fetch(mod_log_id);
    }
};
