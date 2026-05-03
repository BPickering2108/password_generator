const CONFIG = {
    appName: "Arcanum",
    appTagline: "Cryptographically secure generation",
    types: [
        { value: "passphrase", label: "Passphrase" },
        { value: "random",     label: "Random" },
        { value: "pin",        label: "PIN" },
    ],
    delimiters: [
        { value: "-",  label: "Hyphen  ( - )" },
        { value: ".",  label: "Period  ( . )" },
        { value: "_",  label: "Underscore  ( _ )" },
        { value: " ",  label: "Space" },
        { value: "",   label: "None" },
    ],
    wordCounts: [2, 3, 4, 5, 6, 7, 8],
    options: [
        { id: "opt-uppercase", label: "Uppercase",         default: true },
        { id: "opt-numbers",   label: "Numbers",           default: true },
        { id: "opt-symbols",   label: "Symbols",           default: true },
        { id: "opt-ambiguous", label: "Include ambiguous", default: false },
    ],
    defaults: {
        type:       "passphrase",
        length:     16,
        pinLength:  6,
        wordCount:  4,
        delimiter:  "-",
    }
};

function buildHeader() {
    document.title = CONFIG.appName;
    document.getElementById('pageTitle').textContent = CONFIG.appName;

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-8';
    header.innerHTML = `
        <div>
            <h1 class="font-display text-3xl" style="color: var(--text);">
                ${CONFIG.appName}
            </h1>
            <p class="text-xs mt-0.5" style="color: var(--muted);">${CONFIG.appTagline}</p>
        </div>
        <div class="flex items-center gap-3">
            <div class="counter-badge"><span id="counter">—</span> generated</div>
            <button class="theme-toggle" id="themeToggle" title="Toggle theme">☀</button>
        </div>
    `;
    return header;
}

function buildDivider() {
    const hr = document.createElement('hr');
    hr.className = 'divider';
    return hr;
}

function buildTypeSelector() {
    const wrap = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'section-label mb-3';
    label.textContent = 'Type';

    const row = document.createElement('div');
    row.className = 'flex gap-2';

    CONFIG.types.forEach(type => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'type';
        input.id = `type-${type.value}`;
        input.value = type.value;
        input.className = 'type-radio';
        if (type.value === CONFIG.defaults.type) input.checked = true;

        const lbl = document.createElement('label');
        lbl.htmlFor = `type-${type.value}`;
        lbl.className = 'type-label';
        lbl.textContent = type.label;

        row.appendChild(input);
        row.appendChild(lbl);
    });

    wrap.appendChild(label);
    wrap.appendChild(row);
    return wrap;
}

function buildOptions() {
    const wrap = document.createElement('div');

    const label = document.createElement('div');
    label.className = 'section-label mb-3';
    label.textContent = 'Options';

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-3';

    CONFIG.options.forEach(opt => {
        const cbWrap = document.createElement('label');
        cbWrap.className = 'cb-wrap';
        cbWrap.id = `${opt.id}-wrap`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = opt.id;
        input.checked = opt.default;

        const span = document.createElement('span');
        span.textContent = opt.label;

        cbWrap.appendChild(input);
        cbWrap.appendChild(span);
        grid.appendChild(cbWrap);
    });

    wrap.appendChild(label);
    wrap.appendChild(grid);
    return wrap;
}

function buildLengthInput() {
    const wrap = document.createElement('div');
    wrap.className = 'length-opt';

    const label = document.createElement('div');
    label.className = 'section-label mb-3';
    label.textContent = 'Length';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'opt-length';
    input.className = 'field';
    input.value = CONFIG.defaults.length;
    input.min = 4;
    input.max = 128;
    input.style.width = '6rem';

    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
}

function buildPassphraseOptions() {
    const wrap = document.createElement('div');
    wrap.className = 'passphrase-opts';

    const label = document.createElement('div');
    label.className = 'section-label mb-3';
    label.textContent = 'Passphrase';

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 gap-4';

    // Word count
    const wordCountWrap = document.createElement('div');
    const wordCountLabel = document.createElement('label');
    wordCountLabel.className = 'text-xs mb-1 block';
    wordCountLabel.style.color = 'var(--muted)';
    wordCountLabel.textContent = 'Word count';

    const wordCountSelect = document.createElement('select');
    wordCountSelect.id = 'opt-wordcount';
    wordCountSelect.className = 'field';

    CONFIG.wordCounts.forEach(count => {
        const option = document.createElement('option');
        option.value = count;
        option.textContent = `${count} words`;
        option.selected = count === CONFIG.defaults.wordCount;
        wordCountSelect.appendChild(option);
    });

    wordCountWrap.appendChild(wordCountLabel);
    wordCountWrap.appendChild(wordCountSelect);

    // Delimiter
    const delimiterWrap = document.createElement('div');
    const delimiterLabel = document.createElement('label');
    delimiterLabel.className = 'text-xs mb-1 block';
    delimiterLabel.style.color = 'var(--muted)';
    delimiterLabel.textContent = 'Delimiter';

    const delimiterSelect = document.createElement('select');
    delimiterSelect.id = 'opt-delimiter';
    delimiterSelect.className = 'field';

    CONFIG.delimiters.forEach(delim => {
        const option = document.createElement('option');
        option.value = delim.value;
        option.textContent = delim.label;
        option.selected = delim.value === CONFIG.defaults.delimiter;
        delimiterSelect.appendChild(option);
    });

    delimiterWrap.appendChild(delimiterLabel);
    delimiterWrap.appendChild(delimiterSelect);

    grid.appendChild(wordCountWrap);
    grid.appendChild(delimiterWrap);
    wrap.appendChild(label);
    wrap.appendChild(grid);
    return wrap;
}

function buildExclusions() {
    const wrap = document.createElement('div');
    wrap.id = 'exclusions-wrap';
    wrap.className = 'hidden';

    const divider = document.createElement('hr');
    divider.className = 'divider';

    const label = document.createElement('div');
    label.className = 'section-label mb-2';
    label.textContent = 'Additional exclusions';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'opt-exclusions';
    input.className = 'field';
    input.placeholder = 'e.g.  @ £ ~';

    wrap.appendChild(divider);
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
}

function buildOutput() {
    const wrap = document.createElement('div');

    // Generate button
    const generateBtn = document.createElement('button');
    generateBtn.id = 'generateBtn';
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = 'Generate';

    // Error message
    const errorMsg = document.createElement('p');
    errorMsg.id = 'errorMsg';
    errorMsg.className = 'error-msg';

    // Result label
    const resultLabel = document.createElement('div');
    resultLabel.className = 'section-label mb-2';
    resultLabel.textContent = 'Result';

    // Output box
    const outputBox = document.createElement('div');
    outputBox.id = 'outputBox';
    outputBox.className = 'output-box';

    const placeholder = document.createElement('span');
    placeholder.className = 'output-placeholder';
    placeholder.textContent = 'Your result will appear here';
    outputBox.appendChild(placeholder);

    // Action buttons
    const btnRow = document.createElement('div');
    btnRow.className = 'flex gap-2 mt-2';

    const copyBtn = document.createElement('button');
    copyBtn.id = 'copyBtn';
    copyBtn.className = 'btn-ghost';
    copyBtn.textContent = 'Copy';
    copyBtn.disabled = true;

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearBtn';
    clearBtn.className = 'btn-ghost';
    clearBtn.textContent = 'Clear clipboard';
    clearBtn.disabled = true;

    btnRow.appendChild(copyBtn);
    btnRow.appendChild(clearBtn);

    wrap.appendChild(generateBtn);
    wrap.appendChild(errorMsg);
    wrap.appendChild(resultLabel);
    wrap.appendChild(outputBox);
    wrap.appendChild(btnRow);
    return wrap;
}

function buildFooter() {
    const footer = document.createElement('p');
    footer.className = 'text-center mt-6 text-xs';
    footer.style.color = 'var(--muted)';

    const code = document.createElement('code');
    code.style.fontFamily = 'DM Mono, monospace';
    code.style.color = 'var(--lavender)';
    code.textContent = 'crypto.randomInt';

    footer.appendChild(document.createTextNode('Uses '));
    footer.appendChild(code);
    footer.appendChild(document.createTextNode(' — cryptographically secure'));

    return footer;
}

function buildApp() {
    const app = document.getElementById('app');
    app.appendChild(buildHeader());

    const card = document.createElement('div');
    card.className = 'card p-6 flex flex-col gap-5';

    card.appendChild(buildTypeSelector());
    card.appendChild(buildDivider());
    card.appendChild(buildOptions());
    card.appendChild(buildDivider());
    card.appendChild(buildLengthInput());
    card.appendChild(buildPassphraseOptions());
    //card.appendChild(buildDivider());
    card.appendChild(buildExclusions());
    card.appendChild(buildDivider());
    card.appendChild(buildOutput());

    app.appendChild(card);
    app.appendChild(buildFooter());
}

function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') ?? 'dark';
    html.classList.toggle('dark', savedTheme === 'dark');

    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.getElementById('themeToggle').textContent = isDark ? '☀' : '☽';
    });

    document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀' : '☽';
}

function updateVisibility() {
    const type   = document.querySelector('input[name="type"]:checked').value;
    const isPIN  = type === 'pin';
    const length = document.getElementById('opt-length');

    document.querySelector('.passphrase-opts').classList.toggle('hidden', type !== 'passphrase');
    document.querySelector('.length-opt').classList.toggle('hidden', type === 'passphrase');
    document.getElementById('exclusions-wrap').classList.toggle('hidden', type !== 'random');

    // Swap length default based on type
    if (isPIN) {
        length.value = CONFIG.defaults.pinLength;
        length.max   = 12;
    } else {
        length.value = CONFIG.defaults.length;
        length.max   = 128;
    }

    CONFIG.options.forEach(opt => {
        const input = document.getElementById(opt.id);
        const wrap  = document.getElementById(`${opt.id}-wrap`);
        input.disabled     = isPIN;
        wrap.style.opacity = isPIN ? '0.4' : '1';
    });
}

async function loadDefaults() {
    try {
        const res = await fetch('/defaults');
        const data = await res.json();
        document.getElementById('counter').textContent = data.count ?? 0;
    } catch {
        document.getElementById('counter').textContent = '?';
    }
}

async function handleGenerate() {
    const type = document.querySelector('input[name="type"]:checked').value;

    const options = {
        type,
        uppercase:            document.getElementById('opt-uppercase').checked,
        numbers:              document.getElementById('opt-numbers').checked,
        symbols:              document.getElementById('opt-symbols').checked,
        includeAmbiguous:     document.getElementById('opt-ambiguous').checked,
        length:               parseInt(document.getElementById('opt-length').value, 10),
        wordCount:            parseInt(document.getElementById('opt-wordcount').value, 10),
        delimiter:            document.getElementById('opt-delimiter').value,
        additionalExclusions: document.getElementById('opt-exclusions').value,
    };

    const generateBtn = document.getElementById('generateBtn');
    const errorMsg    = document.getElementById('errorMsg');
    const outputBox   = document.getElementById('outputBox');

    errorMsg.classList.remove('visible');
    generateBtn.textContent = 'Generating…';
    generateBtn.disabled    = true;

    try {
        const res  = await fetch('/generate', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(options),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? 'Generation failed');

        outputBox.textContent = data.result;
        outputBox.classList.add('has-value');

        document.getElementById('copyBtn').disabled  = false;
        document.getElementById('clearBtn').disabled = false;
        document.getElementById('copyBtn').textContent = 'Copy';
        document.getElementById('copyBtn').classList.remove('success');

        if (data.count !== undefined) {
            document.getElementById('counter').textContent = data.count;
        }

    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.add('visible');
    } finally {
        generateBtn.textContent = 'Generate';
        generateBtn.disabled    = false;
    }
}

async function handleCopy() {
    const text = document.getElementById('outputBox').textContent;
    const copyBtn = document.getElementById('copyBtn');
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied';
        copyBtn.classList.add('success');
    } catch {
        copyBtn.textContent = 'Failed';
    }
}

async function handleClear() {
    const clearBtn = document.getElementById('clearBtn');
    try {
        await navigator.clipboard.writeText('');
        clearBtn.textContent = 'Cleared';
        setTimeout(() => { clearBtn.textContent = 'Clear clipboard'; }, 1500);
    } catch {
        clearBtn.textContent = 'Failed';
    }
}

async function loadUser() {
    try {
        const res  = await fetch('/api/me');
        const data = await res.json();

        const header = document.querySelector('.flex.items-center.justify-between');
        if (!header) return;

        const adminBtn = document.createElement('a');
        adminBtn.className = 'btn-ghost';
        adminBtn.style.textDecoration = 'none';

        if (data.loggedIn) {
            // Extract first name from email or display name
            const raw  = data.username.split('@')[0].split('.')[0];
            const name = raw.charAt(0).toUpperCase() + raw.slice(1);
            const greeting = document.createElement('span');
            greeting.className = 'text-xs';
            greeting.style.color = 'var(--muted)';
            greeting.textContent = `Hi, ${name}`;

            adminBtn.href = '/admin';
            adminBtn.textContent = 'Admin';

            const userWrap = document.createElement('div');
            userWrap.className = 'flex items-center gap-2';
            userWrap.appendChild(greeting);
            userWrap.appendChild(adminBtn);

            // Insert before theme toggle
            const themeToggle = document.getElementById('themeToggle');
            themeToggle.parentElement.insertBefore(userWrap, themeToggle);
        } else {
            adminBtn.href = '/auth/login';
            adminBtn.textContent = 'Admin';
            const themeToggle = document.getElementById('themeToggle');
            themeToggle.parentElement.insertBefore(adminBtn, themeToggle);
        }
    } catch {
        // Silently fail - admin button is non-critical
    }
}

buildApp();
initTheme();
updateVisibility();
loadDefaults();
loadUser();

document.querySelectorAll('input[name="type"]').forEach(r =>
    r.addEventListener('change', updateVisibility)
);
document.getElementById('generateBtn').addEventListener('click', handleGenerate);
document.getElementById('copyBtn').addEventListener('click', handleCopy);
document.getElementById('clearBtn').addEventListener('click', handleClear);