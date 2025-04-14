from flask_socketio import SocketIO, emit, join_room, leave_room
from collections import defaultdict

socketio = SocketIO(cors_allowed_origins="*")

# Track users in rooms
users_in_rooms = defaultdict(list)  # room -> list of usernames

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    # Cleanup when client disconnects
    for room, users in users_in_rooms.items():
        # Find and remove user from the room
        for user in users:
            if user == request.sid:  # Assuming you use session ID for user identification
                users_in_rooms[room].remove(user)
                break

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    
    # Join the room
    join_room(room)
    
    # Track the user in the room
    users_in_rooms[room].append(username)
    
    # Notify the room that the user has joined
    emit('message', {'user': 'System', 'msg': f"{username} has joined the room."}, room=room)

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    
    # Leave the room
    leave_room(room)
    
    # Remove the user from the room tracking
    if username in users_in_rooms[room]:
        users_in_rooms[room].remove(username)
    
    # Notify the room that the user has left
    emit('message', {'user': 'System', 'msg': f"{username} has left the room."}, room=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    emit('message', {'user': data['username'], 'msg': data['msg']}, room=room)
