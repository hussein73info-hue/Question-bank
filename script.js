let currentSem = 1;
let quizQuestions = [];
let currentStep = 0;

// تشغيل عند التحميل
window.onload = () => {
    selSem(1);
};

function goPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

function selSem(s) {
    currentSem = s;
    const grid = document.getElementById('unit-grid');
    grid.innerHTML = '';
    CUR[s].forEach(u => {
        const div = document.createElement('div');
        div.className = 'unit-card';
        div.innerHTML = `<div class="unit-num">${u.id}</div><div class="unit-name">${u.name}</div>`;
        div.onclick = () => renderLessons(u);
        grid.appendChild(div);
    });
}

function renderLessons(unit) {
    const cont = document.getElementById('lesson-container');
    cont.innerHTML = `<h3>دروس ${unit.name}</h3>`;
    unit.lessons.forEach(l => {
        const key = `${currentSem}|${unit.id}|${l}`;
        const qCount = BANK[key] ? BANK[key].length : 0;
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>${l}</strong> <small>(${qCount} سؤال)</small>`;
        cont.appendChild(div);
    });
}

function qSelSem(s) {
    document.querySelectorAll('.setup-opt').forEach(o => o.classList.remove('sel'));
    document.getElementById('opt-q-' + s).classList.add('sel');
    currentSem = s;
}

function startQuiz() {
    quizQuestions = [];
    CUR[currentSem].forEach(u => {
        u.lessons.forEach(l => {
            const key = `${currentSem}|${u.id}|${l}`;
            if (BANK[key]) quizQuestions.push(...BANK[key]);
        });
    });

    if (quizQuestions.length === 0) return alert("لا توجد أسئلة لهذا الفصل حالياً");
    
    currentStep = 0;
    document.getElementById('quiz-overlay').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentStep];
    const body = document.getElementById('qz-body');
    body.innerHTML = `
        <div class="quiz-q-card">
            <div class="quiz-q-text">${q.text}</div>
            <div class="quiz-opts">
                ${q.options.map((o, i) => `
                    <div class="quiz-opt" onclick="checkAns(${i})">
                        <span class="opt-circle">${LABELS[i]}</span> ${o}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('qz-step').innerText = `السؤال ${currentStep + 1} من ${quizQuestions.length}`;
}

function nextQ() {
    if (currentStep < quizQuestions.length - 1) {
        currentStep++;
        showQuestion();
    } else {
        alert("انتهى الاختبار!");
        document.getElementById('quiz-overlay').style.display = 'none';
    }
}