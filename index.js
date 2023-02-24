import { Client, GatewayIntentBits,PermissionsBitField, EmbedBuilder, Role, Partials, REST, Routes, Events, Guild, GuildChannel } from 'discord.js'
import dotenv from 'dotenv'
import config_slash_commands from './config/config.js'
import { OpenAIApi, Configuration } from 'openai'
dotenv.config()


const client = new Client(
	{
		intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers],
		partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.User],
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
	client.user.setActivity('with Sanchez >> !')
})

const verify_embed = new EmbedBuilder()
	.setColor('DarkNavy')
	.setTitle('Nucleus Network')
	.setAuthor({ name: 'Sanchez', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' })
	.setDescription('After you get verified you will be in our server!')
	.setThumbnail('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
	.addFields({
		name: 'How to verify', value: 'React to this message with ✅ icon'
	}, { name: '\u200B', value: '\u200B' })
	.setImage('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
	.setTimestamp()
	.setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)

const roles_embed = new EmbedBuilder()
       .setColor('DarkNavy')
	   .setTitle('Nucleus Network')
	   .setAuthor({ name: 'Sanchez', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' })
	   .setDescription('Assign self roles! After this, it will display some hidden channels')
	   .setThumbnail('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
	   .addFields({
             name:'How to assign roles?',value:'React to this message with following emojis to get following roles!'
	   },{ name: '\u200B', value: '\u200B' },{name:"👨‍💻 : Developer",value:'Developer Role'},{name:"🎮 : Gamer",value:'Gamer Role'},{name:"🔞 : NSFW",value:'NSFW Role'},{ name: '\u200B', value: '\u200B' })
	   .setImage('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
	   .setTimestamp()
	   .setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)

	client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	switch (interaction.commandName) {
		case "dev":
			await interaction.reply('<@985250430512681072> is the developer of mine.')
			break;
		case "verify":
			await client.channels.cache.get('1078692068647522324').send({ embeds: [verify_embed] })
			break;
		case "roles":
			await client.channels.cache.get('1078688301122322512').send({ embeds: [roles_embed] })
			break;
		case "avatar":
			const user = interaction.options.getUser('target')
			await interaction.reply({embeds:[
				new EmbedBuilder()
				    .setColor('DarkNavy')
				    .addFields({
					     name: 'Name', value: interaction.user.username
				         }, { name: '\u200B', value: '\u200B' })
				    .setImage(user || interaction.user.avatarURL())
				    .setTimestamp()
				    .setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)                            
			
			]})
			break;
			case "welcome":
				interaction.reply({embeds:[
					new EmbedBuilder()
					.setColor('DarkNavy')
					.setTitle('Nucleus Network')
					.setAuthor({ name: 'Sanchez', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' })
					.setDescription('@ᴠᴇʀɪꜰɪᴇᴅ , Welcome to Nucleus Network ')
					.setThumbnail('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
					.addFields({
						name: 'Who are we?', value: 'We are an active and modern community...'
					}, { name: '\u200B', value: '\u200B' })
					.setImage('https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg')
					.setTimestamp()
					.setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)
				]})
				break;
		default:
			await interaction.reply('Invalid command')
			break;
	}
})


client.on(Events.GuildMemberAdd, (m) => {
	client.channels.cache.get(WELCOME_CHANNEL_ID).send(`${m.user}, We glad you to see here & Have a fun...`)
})
client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (reaction.message.id === `1078728472559636482`) {
		if(reaction.emoji.name!=="✅")return;
		const member = await reaction.message.guild.members.fetch(user.id)
		await member.roles.add(`1078677918747734137`)
		
	}
	if(reaction.message.id===`1078740709529632808`){
		const member = await reaction.message.guild.members.fetch(user.id)

		switch(reaction.emoji.name){
			case '👨‍💻':
				await member.roles.add('1078686686902485102')
				break;
				case '🎮':
					await member.roles.add('1078686819840958504')
					break
					case '🔞':
						await member.roles.add('1078687184124649564')
						break;
		}
	}
})
client.on(Events.MessageReactionRemove,async(reaction, user)=>{
	if(reaction.message.id===`1078740709529632808`){
		const member = await reaction.message.guild.members.fetch(user.id)
		switch(reaction.emoji.name){
			case '👨‍💻':
				if (member.roles.cache.some(role => role.id === '1078686686902485102')) {
					await member.roles.remove('1078686686902485102')
				}
				
				break;
				case '🎮':
					if (member.roles.cache.some(role => role.id === '1078686819840958504')) {
						await member.roles.remove('1078686819840958504')
					}
					
					break
					case '🔞':
						if (member.roles.cache.some(role => role.id === '1078687184124649564')) {
							await member.roles.remove('1078687184124649564')
						}
						break;
		}
	}
})

client.on(Events.GuildMemberAdd,(member)=>{
    client.channels.cache.get(WELCOME_CHANNEL_ID).send({embeds:[
		new EmbedBuilder()
		.setColor('DarkNavy')
		.setTitle('Nucleus Network')
		.setAuthor({ name: 'Sanchez', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' })
		.setDescription(`${member.user.tag}, Welcome To Nucleus Network `)
		.setThumbnail(member.user.avatarURL())
		.setTimestamp()
		.setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)
	]})
})
client.on(Events.GuildMemberRemove,(member)=>{
    client.channels.cache.get(WELCOME_CHANNEL_ID).send({embeds:[
		new EmbedBuilder()
		.setColor('DarkNavy')
		.setTitle('Nucleus Network')
		.setAuthor({ name: 'Sanchez', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' })
		.setDescription(`${member.user.tag}, Don't Come Again...Bitch `)
		.setThumbnail(member.user.avatarURL())
		.setTimestamp()
		.setFooter({ text: 'From VIP', iconURL: 'https://i.ibb.co/LtxZGrB/wallpaperflare-com-wallpaper.jpg' },)
	]})
})
client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== BOT_CHANNEL) return;
	if (message.channel.type === "dm") return;

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
		if (m.author.username === "Sanchez") {
			prompt += `${m.author.username}(boyfriend): ${m.content}\n`
		} else {
			prompt += `${m.author.username}: ${m.content}\n`
		}
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
