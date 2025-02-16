const { Router } = require("express");
const { auth } = require('@utils/discordApi');

let { web: {recaptcha_v2: {site_key}}, bot_options: {bot_tags, max_summary_length} } = require("@root/config.json");
site_key = process.env.RESITE;

const route = Router();

route.get("/", auth, async (req, res) => {
    res.render("add", {
        bot_tags,
        max_summary_length,
        site_key,
        req
    })
});

module.exports = route;
