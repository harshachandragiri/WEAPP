// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { io, Socket } from 'socket.io-client';

// @Component({
//   selector: 'app-chat',
//   standalone: true, // 👈 this is important!
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css'],
//   imports: [CommonModule, FormsModule]  // 👈 this works only with standalone: true
// })
// export class ChatComponent implements OnInit {
//   socket!: Socket;
//   username: string = '';
//   room: string = 'general';
//   message: string = '';
//   messages: { user: string; msg: string }[] = [];

//   rooms: string[] = ['general', 'tech', 'random'];
//   selectedRoom: string = 'general';

//   ngOnInit(): void {
//     this.username = prompt('Enter your username') || 'Anonymous';
//     this.socket = io('http://localhost:5000');

//     this.socket.emit('join', {
//       username: this.username,
//       room: this.room
//     });

//     this.socket.on('message', (data: { user: string; msg: string }) => {
//       this.messages.push(data);
//     });
//   }

//   sendMessage(): void {
//     if (this.message.trim()) {
//       this.socket.emit('message', {
//         username: this.username,
//         msg: this.message,
//         room: this.room
//       });
//       this.message = '';
//     }
//   }

//   leaveRoom(): void {
//     this.socket.emit('leave', {
//       username: this.username,
//       room: this.room
//     });
//   }

//   switchRoom(): void {
//     this.leaveRoom();
//     this.room = this.selectedRoom;
//     this.socket.emit('join', {
//       username: this.username,
//       room: this.room
//     });
//     this.messages = []; // Clear chat history when switching
//   }

//   ngOnDestroy(): void {
//     this.leaveRoom();
//     this.socket.disconnect();
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router'; // 👈 make sure this import is at the top




@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  socket!: Socket;
  username: string = '';
  room: string = 'general';
  message: string = '';
  messages: { user: string; msg: string }[] = [];

  rooms: string[] = ['general', 'tech', 'random'];
  selectedRoom: string = 'general';
  usernameSet: boolean = false;  // Track if the username is set
  constructor(private router: Router) {} // 👈 add this to your constructor

  ngOnInit(): void {
    if (!this.usernameSet) {
      // Show a modal or form asking for the username
    } else {
      this.socket = io('http://localhost:5000');
      this.socket.emit('join', {
        username: this.username,
        room: this.room
      });

      this.socket.on('message', (data: { user: string; msg: string }) => {
        this.messages.push(data);
      });
    }
  }

  setUsername(user: string): void {
    this.username = user || 'Anonymous';
    this.usernameSet = true;

    this.socket = io('http://localhost:5000');
    this.socket.emit('join', {
      username: this.username,
      room: this.room
    });

    this.socket.on('message', (data: { user: string; msg: string }) => {
      this.messages.push(data);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.socket.emit('message', {
        username: this.username,
        msg: this.message,
        room: this.room
      });
      this.message = '';
    }
  }

  leaveRoom(): void {
    if (this.socket) {
      this.socket.emit('leave', {
        username: this.username,
        room: this.room
      });
    }
  }
  

  switchRoom(): void {
    this.leaveRoom();
    this.room = this.selectedRoom;
    this.socket.emit('join', {
      username: this.username,
      room: this.room
    });
    this.messages = []; // Clear chat history when switching
  }

  logout(): void {
    this.leaveRoom();
    if (this.socket) {
      this.socket.disconnect();
    }
  
    this.username = '';
    this.room = 'general';
    this.messages = [];
    this.usernameSet = false;
  
    this.router.navigate(['/login']);
  }
  

  ngOnDestroy(): void {
    this.leaveRoom();
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  
}
