// Game Data
const CARD_SYMBOLS = ["🌟", "🎯", "🚀", "🎨", "🎵", "⚡", "🔥", "💎", "🌸", "🍀", "🎪", "🎭"];

const DIFFICULTIES = {
  easy: { name: 'Easy', rows: 4, cols: 4, pairs: 8 },
  medium: { name: 'Medium', rows: 4, cols: 6, pairs: 12 },
  hard: { name: 'Hard', rows: 6, cols: 6, pairs: 18 }
};

// Game State
class MemoryGame {
  constructor() {
    this.currentDifficulty = 'easy';
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isPaused = false;
    this.gameActive = false;

    this.initializeElements();
    this.attachEventListeners();
    this.loadBestScores();
    this.updateBestScoreDisplay();
  }

  initializeElements() {
    // Screens
    this.difficultyScreen = document.getElementById('difficulty-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.winScreen = document.getElementById('win-screen');
    this.pauseOverlay = document.getElementById('pause-overlay');

    // Game elements
    this.gameBoardEl = document.getElementById('game-board');
    this.movesCount = document.getElementById('moves-count');
    this.timeDisplay = document.getElementById('time-display');
    this.bestScore = document.getElementById('best-score');
    this.currentDifficultySpan = document.getElementById('current-difficulty');
    this.gameMessage = document.getElementById('game-message');

    // Win screen elements
    this.finalMoves = document.getElementById('final-moves');
    this.finalTime = document.getElementById('final-time');
    this.finalDifficulty = document.getElementById('final-difficulty');
    this.newRecord = document.getElementById('new-record');

    // Control buttons
    this.pauseBtn = document.getElementById('pause-btn');
    this.restartBtn = document.getElementById('restart-btn');
  }

  attachEventListeners() {
    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const difficulty = e.currentTarget.dataset.difficulty;
        this.startGame(difficulty);
      });
    });

    // Control buttons
    this.pauseBtn?.addEventListener('click', () => this.togglePause());
    this.restartBtn?.addEventListener('click', () => this.restartGame());

    // Win screen buttons
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      this.restartGame();
    });

    document.getElementById('change-difficulty-btn')?.addEventListener('click', () => {
      this.showDifficultyScreen();
    });

    // Pause overlay buttons
    document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
    document.getElementById('quit-btn')?.addEventListener('click', () => this.showDifficultyScreen());
  }

  startGame(difficulty) {
    this.currentDifficulty = difficulty;
    this.resetGameState();
    this.createGameBoard();
    this.showGameScreen();
    this.startTimer();
  }

  resetGameState() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.gameActive = true;
    this.isPaused = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.updateDisplay();
    this.gameMessage.textContent = '';
  }

  createGameBoard() {
    const difficulty = DIFFICULTIES[this.currentDifficulty];
    const totalCards = difficulty.rows * difficulty.cols;
    const pairs = totalCards / 2;

    // Create pairs of cards
    const symbols = CARD_SYMBOLS.slice(0, pairs);
    const cardData = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle cards
    this.cards = this.shuffleArray(cardData);

    // Clear and setup game board
    this.gameBoardEl.innerHTML = '';
    this.gameBoardEl.className = `game-board ${this.currentDifficulty}`;

    // Create card elements
    this.cards.forEach((card, index) => {
      const cardEl = this.createCardElement(card, index);
      this.gameBoardEl.appendChild(cardEl);
    });

    this.currentDifficultySpan.textContent = difficulty.name;
  }

  createCardElement(card, index) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = index;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${card.symbol}</div>
      </div>
    `;

    cardEl.addEventListener('click', () => this.handleCardClick(index));
    return cardEl;
  }

  handleCardClick(index) {
    if (!this.gameActive || this.isPaused) return;

    const card = this.cards[index];
    const cardEl = document.querySelector(`[data-index="${index}"]`);

    // Don't flip if already flipped or matched
    if (card.isFlipped || card.isMatched) return;

    // Don't allow more than 2 cards flipped
    if (this.flippedCards.length >= 2) return;

    // Flip the card
    this.flipCard(index);

    // Check for matches when 2 cards are flipped
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateDisplay();

      setTimeout(() => {
        this.checkForMatch();
      }, 1000);
    }
  }

  flipCard(index) {
    const card = this.cards[index];
    const cardEl = document.querySelector(`[data-index="${index}"]`);

    card.isFlipped = true;
    cardEl.classList.add('flipped');
    this.flippedCards.push(index);

    this.playSound('flip');
  }

  checkForMatch() {
    const [firstIndex, secondIndex] = this.flippedCards;
    const firstCard = this.cards[firstIndex];
    const secondCard = this.cards[secondIndex];

    if (firstCard.symbol === secondCard.symbol) {
      // Match found
      this.handleMatch(firstIndex, secondIndex);
    } else {
      // No match - flip cards back
      this.handleMismatch(firstIndex, secondIndex);
    }

    this.flippedCards = [];
  }

  handleMatch(firstIndex, secondIndex) {
    const firstCardEl = document.querySelector(`[data-index="${firstIndex}"]`);
    const secondCardEl = document.querySelector(`[data-index="${secondIndex}"]`);

    this.cards[firstIndex].isMatched = true;
    this.cards[secondIndex].isMatched = true;

    firstCardEl.classList.add('matched');
    secondCardEl.classList.add('matched');

    this.matchedPairs++;
    this.gameMessage.textContent = `Great! ${this.matchedPairs} pairs found!`;

    this.playSound('match');

    // Check win condition
    const totalPairs = DIFFICULTIES[this.currentDifficulty].pairs;
    if (this.matchedPairs === totalPairs) {
      setTimeout(() => this.handleWin(), 500);
    }
  }

  handleMismatch(firstIndex, secondIndex) {
    const firstCardEl = document.querySelector(`[data-index="${firstIndex}"]`);
    const secondCardEl = document.querySelector(`[data-index="${secondIndex}"]`);

    this.cards[firstIndex].isFlipped = false;
    this.cards[secondIndex].isFlipped = false;

    firstCardEl.classList.remove('flipped');
    secondCardEl.classList.remove('flipped');

    this.gameMessage.textContent = 'Try again!';
    setTimeout(() => {
      this.gameMessage.textContent = '';
    }, 1500);
  }

  handleWin() {
    this.gameActive = false;
    this.stopTimer();

    const timeString = this.formatTime(this.elapsedTime);
    const isNewRecord = this.checkAndSaveBestScore();

    this.finalMoves.textContent = this.moves;
    this.finalTime.textContent = timeString;
    this.finalDifficulty.textContent = DIFFICULTIES[this.currentDifficulty].name;

    if (isNewRecord) {
      this.newRecord.classList.add('show');
    } else {
      this.newRecord.classList.remove('show');
    }

    this.playSound('win');
    this.showWinScreen();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.gameActive) {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  togglePause() {
    if (!this.gameActive) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseOverlay.classList.add('active');
      this.pauseBtn.textContent = '▶️ Resume';
    } else {
      this.pauseOverlay.classList.remove('active');
      this.pauseBtn.textContent = '⏸️ Pause';
      // Adjust start time to account for pause duration
      const pauseDuration = Date.now() - (this.startTime + this.elapsedTime);
      this.startTime += pauseDuration;
    }
  }

  restartGame() {
    this.startGame(this.currentDifficulty);
  }

  showDifficultyScreen() {
    this.gameActive = false;
    this.stopTimer();
    this.isPaused = false;
    this.pauseOverlay.classList.remove('active');

    this.difficultyScreen.classList.add('active');
    this.gameScreen.classList.remove('active');
    this.winScreen.classList.remove('active');
  }

  showGameScreen() {
    this.difficultyScreen.classList.remove('active');
    this.gameScreen.classList.add('active');
    this.winScreen.classList.remove('active');
  }

  showWinScreen() {
    this.difficultyScreen.classList.remove('active');
    this.gameScreen.classList.remove('active');
    this.winScreen.classList.add('active');
  }

  updateDisplay() {
    this.movesCount.textContent = this.moves;
    this.timeDisplay.textContent = this.formatTime(this.elapsedTime);
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  loadBestScores() {
    try {
      const stored = localStorage.getItem('memoryGameBestScores');
      this.bestScores = stored ? JSON.parse(stored) : {
        easy: null,
        medium: null,
        hard: null
      };
    } catch (error) {
      console.error('Error loading best scores:', error);
      this.bestScores = { easy: null, medium: null, hard: null };
    }
  }

  saveBestScores() {
    try {
      localStorage.setItem('memoryGameBestScores', JSON.stringify(this.bestScores));
    } catch (error) {
      console.error('Error saving best scores:', error);
    }
  }

  checkAndSaveBestScore() {
    const currentScore = { moves: this.moves, time: this.elapsedTime };
    const currentBest = this.bestScores[this.currentDifficulty];

    let isNewRecord = false;

    if (!currentBest || 
        currentScore.moves < currentBest.moves || 
        (currentScore.moves === currentBest.moves && currentScore.time < currentBest.time)) {

      this.bestScores[this.currentDifficulty] = currentScore;
      this.saveBestScores();
      isNewRecord = true;
    }

    this.updateBestScoreDisplay();
    return isNewRecord;
  }

  updateBestScoreDisplay() {
    const bestScore = this.bestScores[this.currentDifficulty];
    if (bestScore) {
      this.bestScore.textContent = `${bestScore.moves} moves`;
    } else {
      this.bestScore.textContent = '--';
    }
  }

  playSound(type) {
    // Placeholder for sound effects
    // In a real implementation, you would play actual audio files
    console.log(`Playing sound: ${type}`);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});