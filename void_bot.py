import discord
import asyncio


class VoidBot(discord.Client):
    def __init__(self, socketio):
        super().__init__()
        self.socketio = socketio

        self.messages = []  # [(ip, message)]

        asyncio.get_event_loop().create_task(self.send_queued_messages())

    def queue_message(self, ip, message):
        self.messages.append((ip, message))

    async def send_queued_messages(self):
        while True:
            while len(self.messages) > 0:
                message = self.messages.pop(0)
                await self.send_message(message[0], message[1])
            await asyncio.sleep(0.5)

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
