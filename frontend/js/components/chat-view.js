/**
 * AI 对话助教 - 聊天浮窗
 */

let chatSessionId = null;

function initChatView() {
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  fab.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  sendBtn.addEventListener('click', sendChatMessage);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  const messagesContainer = document.getElementById('chatMessages');

  // 添加用户消息
  messagesContainer.appendChild(createMessageBubble('user', message));
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  input.value = '';
  input.disabled = true;

  // 添加 AI 消息占位
  const aiBubble = createMessageBubble('assistant', '');
  messagesContainer.appendChild(aiBubble);
  const aiContent = aiBubble.querySelector('.msg-content');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(Auth.authHeaders ? Auth.authHeaders() : {}) },
      body: JSON.stringify({
        message,
        currentSection: AppState.currentSection || undefined,
        sessionId: chatSessionId,
      }),
    });

    if (!response.ok) throw new Error('网络请求失败');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data) continue;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            aiContent.textContent = `错误: ${parsed.error}`;
            break;
          }
          if (parsed.done) {
            chatSessionId = parsed.sessionId || chatSessionId;
            continue;
          }
          if (parsed.content) {
            // 简单渲染：将内容追加显示（不做流式 markdown 渲染）
            aiContent.textContent += parsed.content;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  } catch (err) {
    aiContent.textContent = `错误: ${err.message}。请检查 API Key 配置和网络连接。`;
  }

  input.disabled = false;
  input.focus();
}

function createMessageBubble(role, content) {
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'msg-content';
  if (content) {
    contentDiv.textContent = content;
  }

  div.appendChild(contentDiv);
  return div;
}
