/* ============================================================
   WBL Chat UI  —  chat.js
   ============================================================ */

(function () {
    'use strict';

    /* ── DOM refs ── */
    const sidebar         = document.getElementById('chatSidebar');
    const sidebarOverlay  = document.getElementById('sidebarOverlay');
    const headerMenuBtn   = document.getElementById('headerMenuBtn');
    const addProjectBtn   = document.getElementById('addProjectBtn');
    const projectList     = document.getElementById('projectList');
    const historyList     = document.getElementById('historyList');
    const headerProjectBadge = document.getElementById('headerProjectBadge');
    const chatMessages    = document.getElementById('chatMessages');
    const chatWelcome     = document.getElementById('chatWelcome');
    const messageInput    = document.getElementById('messageInput');
    const submitBtn       = document.getElementById('submitBtn');
    const charCount       = document.getElementById('charCount');

    const MAX_CHARS = 4000;
    let sessionMessages = [];
    let isWaiting = false;
    let currentProject = 'デフォルト';
    let projectCount = 1;

    /* ============================================================
       Sidebar Toggle
       ============================================================ */
    function isMobile() { return window.innerWidth <= 768; }

    function openSidebar() {
        sidebar.classList.add('mobile-open');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
    }

    headerMenuBtn.addEventListener('click', function () {
        if (sidebar.classList.contains('mobile-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay.addEventListener('click', closeSidebar);

    /* ============================================================
       Project Management
       ============================================================ */
    addProjectBtn.addEventListener('click', function () {
        const name = prompt('プロジェクト名を入力してください：', `プロジェクト ${++projectCount}`);
        if (!name || !name.trim()) return;

        const trimmed = name.trim();
        const li = createProjectItem(trimmed);
        projectList.appendChild(li);
        setActiveProject(li, trimmed);
    });

    function createProjectItem(name) {
        const li = document.createElement('li');
        li.className = 'sidebar-list-item';
        li.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
                <rect x="3" y="7" width="18" height="14" rx="2"/>
            </svg>
            <span>${escapeHtml(name)}</span>
        `;
        li.addEventListener('click', function () {
            setActiveProject(li, name);
            if (isMobile()) closeSidebar();
        });
        return li;
    }

    function setActiveProject(li, name) {
        projectList.querySelectorAll('.sidebar-list-item').forEach(el => el.classList.remove('active'));
        li.classList.add('active');
        currentProject = name;
        headerProjectBadge.textContent = name;
    }

    /* Set click on default project item */
    const defaultItem = projectList.querySelector('.sidebar-list-item');
    if (defaultItem) {
        defaultItem.addEventListener('click', function () {
            setActiveProject(defaultItem, 'デフォルト');
            if (isMobile()) closeSidebar();
        });
    }

    /* ============================================================
       Textarea Auto-resize & Validation
       ============================================================ */
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 160) + 'px';

        const len = this.value.length;
        charCount.textContent = `${len} / ${MAX_CHARS}`;
        charCount.classList.toggle('warn', len > MAX_CHARS * 0.8);

        submitBtn.disabled = this.value.trim().length === 0 || isWaiting || len > MAX_CHARS;
    });

    /* ============================================================
       Submit via button or Enter
       ============================================================ */
    submitBtn.addEventListener('click', handleSubmit);

    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!submitBtn.disabled) handleSubmit();
        }
    });

    /* ============================================================
       Suggestion Pills
       ============================================================ */
    document.querySelectorAll('.suggestion-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
            const prompt = this.dataset.prompt;
            if (prompt) {
                messageInput.value = prompt;
                messageInput.dispatchEvent(new Event('input'));
                messageInput.focus();
            }
        });
    });

    /* ============================================================
       Core: Submit Handler
       ============================================================ */
    function handleSubmit() {
        const text = messageInput.value.trim();
        if (!text || text.length > MAX_CHARS || isWaiting) return;

        // Hide welcome on first message
        if (chatWelcome && chatWelcome.style.display !== 'none') {
            chatWelcome.style.display = 'none';
        }

        const time = currentTime();

        appendMessage('user', text, time);
        sessionMessages.push({ role: 'user', content: text, time });
        addHistoryEntry(text);

        // Reset input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        charCount.textContent = `0 / ${MAX_CHARS}`;
        submitBtn.disabled = true;
        isWaiting = true;

        // Show typing
        const typingRow = appendTypingRow();

        // Call backend (or stub)
        sendToBackend(text)
            .then(function (reply) {
                typingRow.remove();
                const replyTime = currentTime();
                appendMessage('assistant', reply, replyTime);
                sessionMessages.push({ role: 'assistant', content: reply, time: replyTime });
            })
            .catch(function (err) {
                typingRow.remove();
                appendMessage('assistant', 'エラーが発生しました。もう一度お試しください。', currentTime());
                console.error('Chat error:', err);
            })
            .finally(function () {
                isWaiting = false;
                submitBtn.disabled = messageInput.value.trim().length === 0;
            });
    }

    /* ============================================================
       Backend Communication
       (Django API の接続先は以下のコメントを参照して実装)
       ============================================================ */
    async function sendToBackend(userText) {
        /* ── 本番実装例 ──────────────────────────────────────────
        const response = await fetch('/reviewer/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                message: userText,
                project: currentProject,
                history: sessionMessages,
            }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.reply;
        ────────────────────────────────────────────────────────── */

        // ── 開発用スタブ ──
        await delay(900 + Math.random() * 700);
        const preview = userText.length > 40 ? userText.substring(0, 40) + '…' : userText;
        return `【${currentProject}】への添削フィードバック\n\n「${preview}」\n\nバックエンド API が接続されると、実際の AI 添削結果がここに表示されます。\nプロジェクトごとに履歴が管理されます。`;
    }

    /* ============================================================
       DOM Helpers
       ============================================================ */
    function appendMessage(role, content, time) {
        const isUser = role === 'user';
        const row = document.createElement('div');
        row.className = `message-row ${isUser ? 'user-row' : 'assistant-row'}`;

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.textContent = isUser ? '👤' : 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = escapeHtml(content).replace(/\n/g, '<br>');

        const timeEl = document.createElement('div');
        timeEl.className = 'msg-time';
        timeEl.textContent = time;

        contentDiv.appendChild(bubble);
        contentDiv.appendChild(timeEl);
        row.appendChild(avatar);
        row.appendChild(contentDiv);

        chatMessages.appendChild(row);
        scrollBottom();
    }

    function appendTypingRow() {
        const row = document.createElement('div');
        row.className = 'message-row assistant-row';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.textContent = 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';

        const bubble = document.createElement('div');
        bubble.className = 'typing-bubble';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            bubble.appendChild(dot);
        }

        contentDiv.appendChild(bubble);
        row.appendChild(avatar);
        row.appendChild(contentDiv);
        chatMessages.appendChild(row);
        scrollBottom();
        return row;
    }

    function addHistoryEntry(text) {
        // Remove "no history" placeholder if present
        const empty = historyList.querySelector('.history-empty');
        if (empty) empty.remove();

        // Don't duplicate—update if already has active entry for this session
        let existing = historyList.querySelector('.history-item-session');
        if (!existing) {
            existing = document.createElement('li');
            existing.className = 'sidebar-list-item history-item-session active';
            existing.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>${escapeHtml(text.substring(0, 24))}${text.length > 24 ? '…' : ''}</span>
            `;
            historyList.prepend(existing);
        }
    }

    function scrollBottom() {
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    /* ============================================================
       Utilities
       ============================================================ */
    function escapeHtml(str) {
        return str
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;');
    }

    function currentTime() {
        return new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    function getCookie(name) {
        let val = null;
        document.cookie.split(';').forEach(function (c) {
            const t = c.trim();
            if (t.startsWith(name + '=')) {
                val = decodeURIComponent(t.slice(name.length + 1));
            }
        });
        return val;
    }

})();
