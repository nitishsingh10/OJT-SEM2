const DEFAULT_STATE = {
  columns: {
    todo: { title: "To Do", cards: [] },
    inProgress: { title: "In Progress", cards: [] },
    done: { title: "Done", cards: [] }
  }
};

const STORAGE_KEY = "kanban_board_v1";

function loadBoard() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved || structuredClone(DEFAULT_STATE);
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveBoard(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let boardState = loadBoard();

function addCard(columnId, text) {
  if (!text.trim()) return;
  const card = { 
    id: crypto.randomUUID(), 
    text: text.trim(),
    createdAt: new Date().toISOString() 
  };
  boardState.columns[columnId].cards.push(card);
  saveBoard(boardState);
  renderBoard(boardState);
}

function deleteCard(columnId, cardId) {
  boardState.columns[columnId].cards = boardState.columns[columnId].cards.filter(c => c.id !== cardId);
  saveBoard(boardState);
  renderBoard(boardState);
}

function editCard(columnId, cardId, newText) {
  const card = boardState.columns[columnId].cards.find(c => c.id === cardId);
  if (card && newText.trim()) { 
    card.text = newText.trim();
    saveBoard(boardState);
    renderBoard(boardState); 
  }
}

function moveCard(fromCol, cardId, toCol) {
  const cards = boardState.columns[fromCol].cards;
  const idx = cards.findIndex(c => c.id === cardId);
  if (idx === -1) return;
  const [card] = cards.splice(idx, 1);
  boardState.columns[toCol].cards.push(card);
  saveBoard(boardState);
  renderBoard(boardState);
}
