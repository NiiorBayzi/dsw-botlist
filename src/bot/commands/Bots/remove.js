const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Bots = require("@models/bots");

const { server: {mod_log_id, role_ids} } = require("@root/config.json");

const reasons = {
    '1': 'Responde a outros prefixos além do prefixo do bot.',
    '2': 'Possui prefixo igual a outro bot do servidor.',
    '3': 'Tem menos de 1 Semana de criação.',
    '4': 'Tem comandos NSFW que não são restritos a canais adultos.',
    '5': 'Não responde a menção.',
    '6': 'Tem menos de 10 Comandos utilizáveis por qualquer membro.',
    '7': 'Tem mais de 8 Erros.',
    '8': 'Não possui nenhum comando mostrando o dono.',
    '9': 'Está em menos de 10 Servidores.',
    '10': 'Tem conteúdos que prejudica o usuário.',
    '11': 'Tem mais de 5 Comandos copiados de outros bots.',
    '12': 'O bot quebra alguma regra do servidor.'
}
var modLog;

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'remover',
            runIn: ['text'],
            aliases: ['delete', 'deletar', 'remove'],
            permissionLevel: 8,
            botPerms: ['SEND_MESSAGES'],
            description: 'Remove o bot dá botlist.',
            usage: '[Member:user]'
        });
    }

    async run(message, [Member]) {
        if (!Member || !Member.bot) return message.channel.send(`**( <:dsw_wolfShare:998885362774581279> ) › ${message.author.username}**, você não mencionou um bot..`)
        let e = new MessageEmbed()
            .setTitle('Motivos')
            .setColor(0x6b83aa)
            .addField(`Removendo o bot `, `${Member}`)
        let cont = ``;
        for (let k in reasons) {
            let r = reasons[k];
            cont += `\`[ ${k}. ]\` — ${r}\n`
        }
        cont += `\nEnvie um número válido ou seu próprio motivo.`
        e.setDescription(cont)
        message.channel.send(e);
        let filter = m => m.author.id === message.author.id;

        let collected = await message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });
        let reason = collected.first().content
        let r = collected.first().content;
        if (parseInt(reason)) {
            r = reasons[reason]
            if (!r) return message.channel.send(`**( <:dsw_denied:1000944417353502831> ) › ${message.author.username}**, número inválido.`)
        }

        let bot = await Bots.findOne({ botid: Member.id }, { _id: false });
        await Bots.updateOne({ botid: Member.id }, { $set: { state: "deleted", owners: {primary: bot.owners.primary, additional: []} } });
        const botUser = await this.client.users.fetch(Member.id);

        if (!bot) return message.channel.send(`Unknown Error. Bot not found.`)
        let owners = [bot.owners.primary].concat(bot.owners.additional)
        e = new MessageEmbed()
            .setTitle('( <:dsw_denied:1000944417353502831> ) | Bot removido')
            .addField('Bot', `${botUser?.username} \`( ${bot.botid} )\``, true)
            .addField('Dono(s)', owners.map(x => x ? `<@${x}>` : ""), true)
            .addField('Verificador', message.author, true)
            .addField('Motivo', r)
            .setThumbnail(botUser.displayAvatarURL({format: "png", size: 256}))
            .setTimestamp()
            .setColor(0xffaa00)
        modLog.send(e)
        modLog.send(owners.map(x => x ? `<@${x}>` : "")).then(m => { m.delete() });
        message.channel.send(`**( <:dsw_denied:1000944417353502831> ) › ${message.author.username}**, O bot ${botUser?.username} foi reprovado. Check <#${mod_log_id}>.`)
        
        owners = await message.guild.members.fetch({user: owners})
        owners.forEach(o => {
            o.send(`**( <:dsw_denied:1000944417353502831> ) ›** O seu bot ${bot.username} foi removido da DSW:\n>>> ${r}`)
        })
        if (!message.client.users.cache.find(u => u.id === bot.botid).bot) return;
        try {
            message.guild.members.fetch(message.client.users.cache.find(u => u.id === bot.botid))
                .then(bot => {
                    bot.kick().then(() => {})
                        .catch(e => { console.log(e) })
                }).catch(e => { console.log(e) });
        } catch (e) { console.log(e) }
    }

    async init() {
        modLog = await this.client.channels.fetch(mod_log_id);
    }
};
