import { REST, Routes } from 'discord.js'

const config_slash_commands = (BOT_TOKEN, CLIENT_ID) => {
    const commands = [
        {
          name: 'ping',
          description: 'Replies with Pong!',
        },
        {
            name:'owner',
            description:'Know who made me! '
        },
        {
          name:'hello',
          description:'Resplies with Hi, Your Name',
        },
      ];
      
      const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
      
      (async () => {
        try {
          console.log('Started refreshing application (/) commands.');
          await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
          console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
          console.error(error);
        }
      })();
}

export default config_slash_commands