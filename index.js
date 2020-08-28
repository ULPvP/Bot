const Discord = require("discord.js");
const client = new Discord.Client();
const Canvacord = require("canvacord");
const fs = require("fs");

client.db = require("quick.db");
client.canvas = new Canvacord();
client.commands = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.config = {
    TOKEN: process.env.token,
    prefix: "ul!",
    cooldown: 5000
};

// Load Commands
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        if (!f.endsWith(".js")) return;
        let command = require(`./commands/${f}`);
        client.commands.set(command.help.name, command);
    });
});

// Events
client.once("ready", () => {
    console.log("Ready!");
});

client.on("error", console.error);

client.on("warn", console.warn);

client.on("message", async (message) => {
    if (!message.guild || message.author.bot) return;
    // Handle XP
    xp(message);
    // command handler
    if (!message.content.startsWith(client.config.prefix)) return;
    let args = message.content.slice(client.config.prefix.length).trim().split(" ");
    let command = args.shift().toLowerCase();
    let commandFile = client.commands.get(command);
    if (!commandFile) return;
    commandFile.run(client, message, args);
});



client.login(client.config.TOKEN);
