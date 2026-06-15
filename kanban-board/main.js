document.addEventListener("DOMContentLoaded", () => {
  // Initial Render
  renderBoard(boardState);

  // Clear Board Button Setup
  const clearBtn = document.getElementById("clear-board-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear the entire board? This cannot be undone.")) {
        boardState = structuredClone(DEFAULT_STATE);
        saveBoard(boardState);
        renderBoard(boardState);
      }
    });
  }

  // Add Card Inline UI
  document.querySelectorAll(".column").forEach(col => {
    const addBtn = col.querySelector(".add-card-btn");
    const inputWrap = col.querySelector(".add-input-wrap");
    const textarea = col.querySelector(".add-card-input");
    const columnId = col.dataset.column;

    if (!addBtn || !inputWrap || !textarea) return;

    addBtn.addEventListener("click", () => {
      addBtn.style.display = "none";
      inputWrap.classList.remove("hidden");
      textarea.focus();
    });

    const hideInput = () => {
      textarea.value = "";
      inputWrap.classList.add("hidden");
      addBtn.style.display = "flex";
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addCard(columnId, textarea.value);
        hideInput();
      } else if (e.key === "Escape") {
        hideInput();
      }
    });

    textarea.addEventListener("blur", () => {
      if (textarea.value.trim() !== "") {
        addCard(columnId, textarea.value);
      }
      hideInput();
    });
  });
});
