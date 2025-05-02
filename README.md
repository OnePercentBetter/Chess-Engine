# Chess Game - Frontend

![Chess Game Screenshot](docs/screenshot.png)

This project is the frontend for a real-time web-based chess application, built with React, TypeScript, and Vite. It communicates with a backend server via Socket.IO to handle game logic and state updates.

## Functionality

*   **Visual Chessboard:** Displays an 8x8 chessboard with pieces rendered using SVG images.
*   **Piece Movement:** Allows users to click squares to select and move their pieces according to standard chess rules (validation handled by the backend).
*   **Real-time Updates:** Uses Socket.IO to connect to the backend, receive game state updates (like opponent moves), and reflect them instantly on the board.
*   **Turn Indication:** Shows whose turn it currently is ("White" or "Black").


## Setup

1.  Navigate to the `chessFrontend` directory.
2.  Install dependencies:
    ```bash
    bun install
    ```
    *(Or `npm install` / `yarn install` if you prefer)*

## Running the Development Server

1.  Make sure the backend server (`chessEngine`) is running.
2.  Start the frontend development server:
    ```bash
    bun run dev
    ```
3.  Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
