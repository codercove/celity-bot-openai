import { Client, GatewayIntentBits, REST, Routes, Events, Guild, GuildChannel } from 'discord.js'
import dotenv from 'dotenv'
import config_slash_commands from './config/config.js'
import { OpenAIApi, Configuration } from 'openai'
dotenv.config()

const client = new Client(
    {
        intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers]
    });
const BOT_TOKEN = process.env.BOT_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const PAST_MESSAGES = 5
const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID
const OPENAI_KEY = process.env.OPENAI_KEY
const BOT_CHANNEL = process.env.GUILD_CHANNEL
const config = new Configuration({
    apiKey: OPENAI_KEY
})

const openai = new OpenAIApi(config)


client.login(BOT_TOKEN)
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag} !`)
    config_slash_commands(BOT_TOKEN, CLIENT_ID)
    client.user.setStatus('online')
    client.user.setActivity('with Sanchez')
})
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case "ping":
            await interaction.reply('Pong!')
            break;
        case "owner":
            await interaction.reply('<@985250430512681072>')
            break;
        case "hello":
            await interaction.reply(`Hello, ${interaction.member.user}`)
            break;
        default:
            await interaction.reply('Invalid command')
            break;
    }
})

client.on(Events.GuildMemberAdd, (m) => {
    client.channels.cache.get(WELCOME_CHANNEL_ID).send(`${m.user}, We glad you to see here & Have a fun...`)
})


client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== BOT_CHANNEL) return;
    if(message.channel.type==="dm")return;

    message.channel.sendTyping()

    let messages = Array.from(await message.channel.messages.fetch({
        limit: PAST_MESSAGES,
        before: message.id
    }))
    messages = messages.map(m => m[1])
    messages.unshift(message)

    let users = [...new Set([...messages.map(m => m.author.username), client.user.username])]

    let lastUser = users.pop()

    let prompt = `The following is a conversation between ${users.join(", ")}, and ${lastUser}. \n\n`

    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        prompt += `${m.author.username}: ${m.content}\n`
    }
    prompt += `${client.user.username}:`
    console.log("prompt:", prompt)

    const response = await openai.createCompletion({
        prompt,
        model: "text-davinci-003",
        max_tokens: 500,
        stop: ["\n"]
    })

    console.log("response", response.data.choices[0].text)
    await message.channel.send(response.data.choices[0].text)
})
