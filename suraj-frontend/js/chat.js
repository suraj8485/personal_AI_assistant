// Chat screen logic: centered "ask a question" state, moving the composer
// to the bottom once a chat starts, the thinking/loading spinner, and the
// demo reply logic. See the NOTE below for where to plug in your backend.

/* ---------------- CHAT LOGIC (demo only) ---------------- */
const intro = document.getElementById('intro');
const messagesEl = document.getElementById('messages');
const composer = document.getElementById('composer');
const composerSlot = document.getElementById('composerSlot');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
let started = false;

// ========== SIMPLE HISTORY SYSTEM ==========
let chatHistory = [];
let currentChatId = null;

const historyList = document.getElementById('historyList');

// Clear the demo history items
historyList.innerHTML = '';

function createHistoryItem(title, id) {
  const item = document.createElement('div');
  item.className = 'history-item';
  item.textContent = title;
  item.dataset.id = id;

  item.addEventListener('click', () => {
    loadChat(id);
  });

  return item;
}

function addToHistory(title) {
  const id = Date.now();
  currentChatId = id;

  chatHistory.push({
    id: id,
    title: title,
    messages: []
  });

  const item = createHistoryItem(title, id);

  document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  historyList.prepend(item);
}

function saveCurrentMessage(role, text) {
  if (!currentChatId) return;

  const chat = chatHistory.find(c => c.id === currentChatId);
  if (chat) {
    chat.messages.push({ role, text });
  }
}

function loadChat(id) {
  const chat = chatHistory.find(c => c.id === id);
  if (!chat) return;

  currentChatId = id;

  document.querySelectorAll('.history-item').forEach(i => {
    i.classList.toggle('active', i.dataset.id == id);
  });

  messagesEl.innerHTML = '';
  chat.messages.forEach(msg => {
    addMessage(msg.role, msg.text, false);
  });

  if (!started) startChat();
}

function addMessage(role, text, save = true) {
  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;

  const formattedText = text.replace(/\n/g, '<br>');

  wrap.innerHTML = `
    <div class="m-avatar">${role === 'user' ? 'YOU' : ''}</div>
    <div class="bubble">${formattedText}</div>
  `;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  if (save) {
    saveCurrentMessage(role, text);
  }

  return wrap;
}

// loading icon shown while Suraj is "thinking"
function showThinking(){
  const wrap = document.createElement('div');
  wrap.className = 'msg assistant';
  wrap.innerHTML = `<div class="m-avatar"></div><div class="bubble"><div class="thinking"><div class="spinner"></div>Suraj is thinking...</div></div>`;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return wrap;
}

function startChat(){
  started = true;
  intro.style.display = 'none';
  messagesEl.classList.add('show');
  composerSlot.appendChild(composer);
  composerSlot.classList.add('show');
}

function resetChat() {
  started = false;
  currentChatId = null;
  messagesEl.innerHTML = '';
  messagesEl.classList.remove('show');
  composerSlot.classList.remove('show');
  intro.appendChild(composer);
  intro.style.display = 'flex';
  input.focus();

  document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
}

async function handleSend(){
  const text = input.value.trim();
  if(!text) return;
  if(!started) startChat();

  addMessage('user', text);

// Add to history only if this is a new chat
  if (!currentChatId) {
    const title = text.length > 32 ? text.substring(0, 32) + "..." : text;
    addToHistory(title);
  }
  input.value = '';
  input.style.height = 'auto';

  const thinkingEl = showThinking();

  try {
    const response = await fetch('https://personal-ai-assistant-dhlp.onrender.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: text }),
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();

    thinkingEl.remove();
    addMessage('assistant', data.answer);

  } catch (error) {
    console.error(error);
    thinkingEl.remove();
    addMessage('assistant', 'Sorry, something went wrong. Please try again.');
  }
}

sendBtn.addEventListener('click', handleSend);
input.addEventListener('keydown', e=>{
  if(e.key==='Enter' && !e.shiftKey){
    e.preventDefault();
    handleSend();
  }
});
input.addEventListener('input', ()=>{
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 140) + 'px';
});

document.getElementById('newChatBtn').addEventListener('click', resetChat);

document.querySelectorAll('.history-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    document.querySelectorAll('.history-item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    if(!started) startChat();
    messagesEl.innerHTML = '';
    addMessage('assistant', `Picking up "${item.textContent}" — this is a demo thread, connect your backend to load real history.`);
  });
});
