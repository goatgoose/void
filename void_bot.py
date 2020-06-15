import discord
import events


class VoidBot(discord.Client):
    def __init__(self, socketio):
        super().__init__()

        self.socketio = socketio

    async def send_message(self, ip, message):
        guild: discord.guild.Guild = self.guilds[0]
        channel: discord.guild.TextChannel = discord.utils.get(guild.channels, name=ip)
        if not channel:
            channel = await guild.create_text_channel(ip)
        await channel.send(message)

    async def on_ready(self):
        print("ready")

    async def on_message(self, message):
        if message.author == self.user:
            return
        self.socketio.emit("message", message.content)


if __name__ == '__main__':
    client = VoidBot()
    client.run(open("discord_token.txt").read().strip())
