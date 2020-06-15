from flask import Flask, render_template, request
from flask_socketio import SocketIO
from void_bot import VoidBot
import threading
import discord
import asyncio


app = Flask(__name__)
socketio = SocketIO(app)
void_bot = VoidBot(socketio)


@socketio.on("submit")
def handle_message(message):
    socketio.emit("message", message)
    ip = request.remote_addr
    print(message)


@app.route('/')
def hello_world():
    return render_template("index.html")


if __name__ == '__main__':
    app = threading.Thread(target=socketio.run, args=(app,))
    app.start()

    void_bot.run(open("discord_token.txt").read().strip())
