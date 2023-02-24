import { REST, Routes } from 'discord.js'

const config_slash_commands = (BOT_TOKEN, CLIENT_ID) => {
    const commands = [
        {
          name: 'verify',
          description: 'Replies with verification message!',
        },
        {
            name:'roles',
            description:'Replies with roles reaction message!'
        },
        {
          name:'dev',
          description:'Replies with developer name!',
        },
        {
          name:'avatar',
          description:'Shows your avatar!',
        },
        {
          name:'welcome',
          description:'Know about us!'
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