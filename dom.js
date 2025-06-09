let items = ["Item 1", "Item 2", "Item 3", "Item 4"];
let editingIndex = null;

const itemsList = document.getElementById('items');
const itemForm = document.getElementById('itemForm');
const input = document.getElementById('input');
const search = document.getElementById('search');
const itemCount = document.getElementById('itemCount');
const mainBox = document.querySelector('.main-box');
const darkModeToggle = document.getElementById('darkModeToggle');
let isDarkMode = false;

// Render items with optional filter
function renderItems(filter = "") {
  itemsList.innerHTML = "";
  let filteredItems = items
    .map((item, idx) => ({item, idx}))
    .filter(({item}) => item.toLowerCase().includes(filter.toLowerCase()));

  filteredItems.forEach(({item, idx}) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    if (editingIndex === idx) li.classList.add('editing');

    // Item text or input for editing
    if (editingIndex === idx) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = item;
      editInput.className = 'form-control mr-2';
      editInput.style.flex = "1";
      editInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') saveEdit(idx, editInput.value);
        if (e.key === 'Escape') cancelEdit();
      });
      li.appendChild(editInput);

      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn btn-success btn-sm ml-2';
      saveBtn.textContent = "Save";
      saveBtn.onclick = () => saveEdit(idx, editInput.value);
      li.appendChild(saveBtn);

      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary btn-sm ml-2';
      cancelBtn.textContent = "Cancel";
      cancelBtn.onclick = cancelEdit;
      li.appendChild(cancelBtn);
    } else {
      const span = document.createElement('span');
      span.textContent = item;
      li.appendChild(span);

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-info btn-sm btn-edit';
      editBtn.textContent = "Edit";
      editBtn.onclick = () => startEdit(idx);
      li.appendChild(editBtn);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-danger btn-sm btn-delete';
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteItem(idx, li);
      li.appendChild(delBtn);
    }

    itemsList.appendChild(li);
  });

  // Update item count
  itemCount.textContent = `${filteredItems.length} Item${filteredItems.length !== 1 ? 's' : ''}`;
}

// Add item at the top (replace Item 1, shift rest down)
itemForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let value = input.value.trim();
  if (!value) return;

  // Insert at the top
  items.unshift(value);
  input.value = '';
  renderItems(search.value);

  // Animate main box color
  animateMainBox("#a8ff78", "#fff");
});

// Delete item with animation and color
function deleteItem(idx, li) {
  li.classList.add('deleting');
  animateMainBox("#f5576c", "#fff");
  setTimeout(() => {
    items.splice(idx, 1);
    renderItems(search.value);
  }, 400);
}

// Edit item
function startEdit(idx) {
  editingIndex = idx;
  renderItems(search.value);
}

// Save edited item
function saveEdit(idx, value) {
  if (value.trim()) {
    items[idx] = value.trim();
    editingIndex = null;
    renderItems(search.value);
    animateMainBox("#f6d365", "#fff");
  }
}

// Cancel editing
function cancelEdit() {
  editingIndex = null;
  renderItems(search.value);
}

// Search/filter
search.addEventListener('input', function() {
  renderItems(this.value);
});

// Dark mode toggle
darkModeToggle.addEventListener('click', function() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  darkModeToggle.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  animateMainBox(isDarkMode ? "#232526" : "#fff", isDarkMode ? "#222a36" : "#fff");
});

// Animate main box background color
function animateMainBox(colorFrom, colorTo) {
  mainBox.style.background = colorFrom;
  setTimeout(() => {
    mainBox.style.background = colorTo;
  }, 300);
}

// Initial render
renderItems();
