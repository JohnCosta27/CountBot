import "dotenv/config";
import {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
} from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

type UserCount = {
  user: string;
  count: number;
};

interface State {
  users: UserCount[];
}

const state: State = {
  users: [],
};

const test = new SlashCommandBuilder()
  .setName("increase")
  .setDescription("dsmaidmsao")
  .addUserOption((options) =>
    options.setName("user").setDescription("users name")
  );

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "count",
    description: "increase counter",
  },
  {
    name: "score",
    description: "show user score",
  },
  test.toJSON(),
];

let count = 0;

if (process.env.BOT_TOKEN) {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands("1010258505065836574"), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();

  client.on("ready", () => {
    if (!client.user?.tag) return;
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (interaction.commandName === "count") {
      count++;
      await interaction.reply(`${count}`);
    } else if (interaction.commandName === "increase") {
      const userId = interaction.options.data[0].user?.id;
      if (!userId) return;

      const user = state.users.find((u) => u.user === userId);
      if (user) {
        user.count += 1;
      } else {
        state.users.push({
          user: userId,
          count: 1,
        });
      }
      await interaction.reply("Ok!");
    } else if (interaction.commandName === "score") {
      await interaction.reply(JSON.stringify(state));
    }
  });

  client.login(process.env.BOT_TOKEN);
}
