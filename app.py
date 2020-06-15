from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
from void_bot import VoidBot
import threading
import uuid


app = Flask(__name__)
socketio = SocketIO(app)
void_bot = VoidBot(socketio)


@socketio.on("register")
def handle_register():
    return str(uuid.uuid4())


@socketio.on("submit")
def handle_message(submit):
    void_bot.queue_message(submit["id"], submit["message"])


@app.route('/')
def hello_world():
    return render_template("index.html")


if __name__ == '__main__':
    app = threading.Thread(target=socketio.run, args=(app,))
    app.start()

    void_bot.run(open("discord_token.txt").read().strip())
