import express from 'express';
import { Server } from "socket.io";
import http from 'http';
import cors from 'cors';
import { BoardState } from './chess';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const allowedOrigins = ['http://localhost:5173']; // Your frontend origin

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true // If you need to handle cookies or authorization headers
}));

// Add a test route
app.get('/', (req, res) => {
  res.send('Chess server is running');
});

const server = http.createServer(app);
const PORT = process.env.PORT || 10000

const players = new Map<string, string>();  

const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the array here
    methods: ['GET', 'POST'],
    credentials: true // Match credentials setting if needed
  }
});

// Single global game state
const globalGame = {
  board: BoardState.createNew()
};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  // Send serialized game state
  socket.emit('game_start', {
    board: globalGame.board.getBoard().map(piece => {
      if (!piece) return null;
      return {
        color: piece.color,
        type: piece.type
      };
    }),
    turn: globalGame.board.turn,
    pawnStates: Array.from(globalGame.board.pawnStates.entries())
  });

  socket.on('make_move', ({ from, to }) => {
    try {
      const newState = globalGame.board.makeMove(from, to);
      
      if (newState) {
        globalGame.board = newState;
        
        io.emit('move_made', {
          board: newState.getBoard().map(piece => {
            if (!piece) return null;
            return {
              color: piece.color,
              type: piece.type
            };
          }),
          turn: newState.turn,
          pawnStates: Array.from(newState.pawnStates.entries())
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid move';
      socket.emit('move_error', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} `);
});

