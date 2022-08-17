const { Router } = require("express");
const Canvas = require("@napi-rs/canvas");
const Bots = require("@models/bots");
const fs = require('fs');

const { web: {domain_with_protocol}, server: {id} } = require("@root/config.json");

const path = require("path");

const route = Router();

route.get("/:id", async (req, res) => {
  const bot = await Bots.findOne({ botid: req.params.id }, { _id: false })
  if (!bot) return res.sendStatus(404);
  try {
    let owner = await req.app.get("client").guilds.cache.get(id).members.fetch(bot.owners.primary);
    let discord_verified = (await (await req.app.get('client').users.fetch(req.params.id)).fetchFlags()).has("VERIFIED_BOT");

    const canvas = Canvas.createCanvas(500, 250);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage(`${__dirname}/widget.png`);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    

    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(await canvas.encode('png'), "binary");
  } catch (e) {
    throw e
    res.sendStatus(500);
  }
});

module.exports = route;
