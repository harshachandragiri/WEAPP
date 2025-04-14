# chat.py
from flask_socketio import SocketIO, emit
from flask import request, current_app

socketio = SocketIO()

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('server_message', {'msg': 'Welcome to the chat!'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('send_message')
def handle_send_message(data):
    username = data.get('username')
    message = data.get('message')

    # Save message to MongoDB
    db = current_app.mongo.db
    db.messages.insert_one({
        'username': username,
        'message': message
    })

    # Broadcast message
    emit('receive_message', data, broadcast=True)
