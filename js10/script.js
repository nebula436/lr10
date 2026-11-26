const MAX_ATTEMPTS = 3;
const ROWS = 3;

const symbols = [
  { name: 'Яблуко', src: 'img/apple.png' },
  { name: 'Груша', src: 'img/pear.png' },
  { name: 'Лимон', src: 'img/lemon.png' },
  { name: 'Абрикос', src: 'img/apricot.png' },
  { name: 'Вишня', src: 'img/cherry.png' }
];

const playerNameEl = document.querySelector('#player-name');
const attemptInfoEl = document.querySelector('#attempt-info');
const spinBtn = document.querySelector('#spin-btn');
const columns = document.querySelectorAll('.slot-column');
const statusMessageEl = document.querySelector('#status-message');

let attempt = 0;
let isGameOver = false;

const getValidatedPlayerName = () => {
  const input = prompt('Введіть ваше ім’я:');
  if (input === null) {
    return 'User';
  }
  const cleanedName = input.trim();
  return cleanedName.length > 0 ? cleanedName : 'User';
};

const getUniqueColumnSymbols = (count) => {
  if (count > symbols.length) {
    throw new Error('Недостатньо унікальних картинок для стовпця.');
  }
  const pool = [...symbols];
  for (let i = pool.length - 1; i > 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[randIndex]] = [pool[randIndex], pool[i]];
  }
  return pool.slice(0, count);
};

const createCellElement = (symbol) => {
  const cell = document.createElement('div');
  cell.classList.add('slot-cell');
  cell.dataset.symbol = symbol.name;

  const img = document.createElement('img');
  img.src = symbol.src;
  img.alt = symbol.name;

  img.addEventListener('error', () => {
    img.remove();
    cell.textContent = symbol.name;
    cell.style.fontSize = '0.9rem';
    cell.style.fontWeight = '700';
    cell.style.color = '#ffffff';
  });

  cell.appendChild(img);
  return cell;
};

const getWinningRows = (grid) => {
  const winningRows = [];
  for (let row = 0; row < ROWS; row++) {
    const firstName = grid[0][row].name;
    const isRowMatch = grid.every((col) => col[row].name === firstName);
    if (isRowMatch) {
      winningRows.push(row);
    }
  }
  return winningRows;
};

const highlightWinningRows = (winningRows) => {
  winningRows.forEach((rowIndex) => {
    columns.forEach((colEl) => {
      const targetCell = colEl.children[rowIndex];
      if (targetCell) {
        targetCell.classList.add('win-cell');
        targetCell.style.backgroundColor = '#fef08a';
      }
    });
  });
};

const setButtonState = (mode) => {
  if (mode === 'restart') {
    spinBtn.textContent = 'Play again';
    spinBtn.style.cssText = 'background-color: #38bdf8; border-color: #0284c7; color: #0f172a;';
  } else {
    spinBtn.textContent = 'Generate';
    spinBtn.style.cssText = 'background-color: #00ff00; border-color: #00b300; color: #000000;';
  }
};

const renderInitialBoard = () => {
  columns.forEach((colEl) => {
    colEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('slot-cell');
      placeholder.textContent = '?';
      placeholder.style.fontSize = '1.5rem';
      placeholder.style.fontWeight = '700';
      placeholder.style.color = '#ffffff';
      colEl.appendChild(placeholder);
    }
  });
};

const resetGame = () => {
  attempt = 0;
  isGameOver = false;
  attemptInfoEl.textContent = `Спроба 0 з ${MAX_ATTEMPTS}`;
  statusMessageEl.textContent = '';
  statusMessageEl.style.color = '#111827';
  setButtonState('play');
  renderInitialBoard();
};

const playTurn = () => {
  if (isGameOver) {
    resetGame();
    return;
  }

  attempt += 1;
  attemptInfoEl.textContent = `Спроба ${attempt} з ${MAX_ATTEMPTS}`;

  const grid = [];

  columns.forEach((colEl) => {
    const colSymbols = getUniqueColumnSymbols(ROWS);
    grid.push(colSymbols);
    colEl.innerHTML = '';

    colSymbols.forEach((symbol) => {
      const cell = createCellElement(symbol);
      colEl.appendChild(cell);
    });
  });

  const winningRows = getWinningRows(grid);

  if (winningRows.length > 0) {
    highlightWinningRows(winningRows);
    statusMessageEl.textContent = `Вітаємо, ${playerNameEl.textContent}! Ви виграли!`;
    statusMessageEl.style.color = '#15803d';
    isGameOver = true;
    setButtonState('restart');
    return;
  }

  if (attempt >= MAX_ATTEMPTS) {
    statusMessageEl.textContent = `Спроби вичерпано. Натисніть «Play again», щоб зіграти ще раз.`;
    statusMessageEl.style.color = '#b91c1c';
    isGameOver = true;
    setButtonState('restart');
  } else {
    statusMessageEl.textContent = 'Спробуйте ще раз!';
    statusMessageEl.style.color = '#374151';
  }
};

window.addEventListener('DOMContentLoaded', () => {
  playerNameEl.textContent = getValidatedPlayerName();
  renderInitialBoard();
});

spinBtn.addEventListener('click', playTurn);