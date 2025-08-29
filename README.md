# Memory Match Game

A responsive browser-based memory card matching game built with vanilla JavaScript, HTML, and CSS.

## Features

- **Three Difficulty Levels**: Easy (4×4), Medium (4×6), and Hard (6×6) grids
- **Score Tracking**: Moves counter and timer with best score persistence
- **Smooth Animations**: 3D card flip effects and hover interactions
- **Pause/Resume**: Game state preservation during breaks
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Local Storage**: Best scores saved across browser sessions

## Game Rules

1. Click on cards to flip them and reveal symbols
2. Find matching pairs by flipping two cards with identical symbols
3. Matched pairs stay face-up permanently
4. Mismatched cards flip back after a brief delay
5. Complete the game by matching all pairs
6. Try to finish with fewer moves and less time!

## How to Run in VS Code

### Prerequisites
- Visual Studio Code installed
- Live Server extension for VS Code (recommended)

### Setup Instructions

1. **Extract the ZIP file** to your desired location
2. **Open VS Code**
3. **Open the project folder**:
   - File → Open Folder
   - Select the `memory-match-game` folder
4. **Install Live Server extension** (if not already installed):
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install the extension by Ritwick Dey

### Running the Game

**Option 1: Using Live Server (Recommended)**
1. Right-click on `index.html` in the VS Code explorer
2. Select "Open with Live Server"
3. The game will open in your default browser at `http://127.0.0.1:5500`

**Option 2: Direct Browser Opening**
1. Right-click on `index.html` in VS Code explorer
2. Select "Copy Path"
3. Paste the path in your browser address bar
4. The game will load directly

### Project Structure

```
memory-match-game/
├── index.html          # Main HTML file
├── style.css          # Styling and animations
├── app.js            # Game logic and functionality
└── README.md         # This documentation
```

## Controls

- **Click**: Flip cards
- **Pause Button**: Pause/resume game
- **Restart Button**: Start over with same difficulty
- **Difficulty Buttons**: Choose game complexity

## Technical Details

- **Pure Vanilla JavaScript**: No frameworks or libraries
- **CSS Grid**: Responsive game board layout
- **CSS Transforms**: 3D card flip animations
- **Local Storage API**: Best score persistence
- **Event Delegation**: Efficient click handling
- **Modular Code**: Clean, readable class-based structure

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Known Issues

- Sound effects are placeholder console logs (can be enhanced with Web Audio API)
- No multiplayer functionality (single-player only)

## Future Enhancements

- Sound effects integration
- Online leaderboard
- Custom card themes
- Multiplayer support
- Progressive difficulty scaling

## Development

To modify the game:

1. **Game Logic**: Edit `app.js` - contains all game mechanics
2. **Styling**: Modify `style.css` - controls appearance and animations  
3. **Layout**: Update `index.html` - for structural changes

The code is well-commented and follows modern JavaScript practices for easy maintenance and extension.

Enjoy playing! 🎮
