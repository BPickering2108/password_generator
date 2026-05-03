// Theme
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') ?? 'dark';
themeToggle.textContent = savedTheme === 'dark' ? '☀' : '☽';

themeToggle.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀' : '☽';
});

// Feedback helper
function setFeedback(id, message, type) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.className = `feedback ${type}`;
    setTimeout(() => {
        el.textContent = '';
        el.className = 'feedback';
    }, 3000);
}

// Format uptime
function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

// Load stats
async function loadStats() {
    try {
        const res  = await fetch('/admin/api/stats');
        const data = await res.json();

        document.getElementById('stat-counter').textContent    = data.count;
        document.getElementById('stat-uptime').textContent     = formatUptime(data.uptime);

        const maintEl = document.getElementById('stat-maintenance');
        maintEl.innerHTML = data.maintenance
            ? `<span class="status-pill offline"><span class="status-dot"></span> Maintenance</span>`
            : `<span class="status-pill online"><span class="status-dot"></span> Online</span>`;

        document.getElementById('maintToggle').checked = !data.maintenance;
    } catch {
        document.getElementById('stat-counter').textContent = '?';
        document.getElementById('stat-uptime').textContent  = '?';
    }
}

// Load greeting
async function loadGreeting() {
    try {
        const res  = await fetch('/api/me');
        const data = await res.json();
        if (data.loggedIn) {
            const raw  = data.username.split('@')[0].split('.')[0];
            const name = raw.charAt(0).toUpperCase() + raw.slice(1);
            document.getElementById('greeting').textContent = `Signed in as ${name}`;
        }
    } catch {
        document.getElementById('greeting').textContent = '';
    }
}

// Counter reset
document.getElementById('resetBtn').addEventListener('click', async () => {
    const value = parseInt(document.getElementById('counter-value').value, 10);
    if (isNaN(value) || value < 0) {
        setFeedback('counter-feedback', 'Enter a valid non-negative number', 'error');
        return;
    }
    await resetCounter(value);
});

document.getElementById('resetZeroBtn').addEventListener('click', () => resetCounter(0));

async function resetCounter(value) {
    try {
        const res  = await fetch('/admin/api/counter/reset', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Reset failed');
        document.getElementById('stat-counter').textContent = data.count;
        document.getElementById('counter-value').value = '';
        setFeedback('counter-feedback', `Counter reset to ${data.count}`, 'success');
    } catch (err) {
        setFeedback('counter-feedback', err.message, 'error');
    }
}

// Maintenance toggle
document.getElementById('maintToggle').addEventListener('change', async () => {
    try {
        const res  = await fetch('/admin/api/maintenance', { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error('Toggle failed');

        const maintEl = document.getElementById('stat-maintenance');
        maintEl.innerHTML = data.maintenance
            ? `<span class="status-pill offline"><span class="status-dot"></span> Maintenance</span>`
            : `<span class="status-pill online"><span class="status-dot"></span> Online</span>`;

        setFeedback(
            'maint-feedback',
            data.maintenance ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
            data.maintenance ? 'error' : 'success'
        );
    } catch (err) {
        setFeedback('maint-feedback', err.message, 'error');
        // Revert toggle on failure
        const toggle = document.getElementById('maintToggle');
        toggle.checked = !toggle.checked;
    }
});

// Session invalidation
document.getElementById('invalidateBtn').addEventListener('click', async () => {
    if (!confirm('This will sign out all users including yourself. Continue?')) return;
    try {
        const res = await fetch('/admin/api/sessions/invalidate', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to invalidate sessions');
        window.location.href = '/';
    } catch (err) {
        setFeedback('session-feedback', err.message, 'error');
    }
});

// Init
loadStats();
loadGreeting();