function renderBoard(state) {
  Object.keys(state.columns).forEach(colId => {
    const col = state.columns[colId];
    const list = document.querySelector(`.cards-list[data-column="${colId}"]`);
    const badge = document.querySelector(`.col-badge[data-column="${colId}"]`);
    
    if (!list) return;
    
    list.innerHTML = "";
    badge.textContent = col.cards.length;
    
    col.cards.forEach(card => {
      const li = document.createElement("div");
      li.className = `kanban-card state-${colId}`;
      li.dataset.cardId = card.id;
      li.dataset.column = colId;
      
      const date = new Date(card.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      let moveButtons = '';
      if (colId === 'todo') {
        moveButtons = `<button class="action-btn move" title="Move to In Progress" data-target="inProgress" data-id="${card.id}" data-col="${colId}">→</button>`;
      } else if (colId === 'inProgress') {
        moveButtons = `
          <button class="action-btn move" title="Move to To Do" data-target="todo" data-id="${card.id}" data-col="${colId}">←</button>
          <button class="action-btn move" title="Move to Done" data-target="done" data-id="${card.id}" data-col="${colId}">→</button>
        `;
      } else if (colId === 'done') {
        moveButtons = `<button class="action-btn move" title="Move to In Progress" data-target="inProgress" data-id="${card.id}" data-col="${colId}">←</button>`;
      }

      li.innerHTML = `
        <p class="card-text">${card.text.replace(/\n/g, '<br>')}</p>
        <div class="card-footer">
          <small class="card-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formattedDate}
          </small>
          <div class="card-actions">
            ${moveButtons}
            <button class="action-btn edit" data-id="${card.id}" data-col="${colId}">Edit</button>
            <button class="action-btn delete" data-id="${card.id}" data-col="${colId}">Del</button>
          </div>
        </div>
      `;
      list.appendChild(li); 
    }); 
  });

  // Bind move events
  document.querySelectorAll('.action-btn.move').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const colId = e.target.dataset.col;
      const cardId = e.target.dataset.id;
      const targetCol = e.target.dataset.target;
      moveCard(colId, cardId, targetCol);
    });
  });

  // Bind edit events
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const colId = e.target.dataset.col;
      const cardId = e.target.dataset.id;
      const card = boardState.columns[colId].cards.find(c => c.id === cardId);
      
      // Inline edit simulation with prompt
      const newText = prompt("Edit Task:", card.text);
      if (newText !== null && newText.trim() !== "") {
        editCard(colId, cardId, newText);
      }
    });
  });

  // Bind delete events
  document.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if(confirm("Are you sure you want to delete this task?")) {
        const colId = e.target.dataset.col;
        const cardId = e.target.dataset.id;
        deleteCard(colId, cardId);
      }
    });
  });
}
