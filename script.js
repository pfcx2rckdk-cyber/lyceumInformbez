// ========== УТИЛИТА ПЛАВНОЙ ПРОКРУТКИ ==========
function scrollToElement(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const navHeight = document.querySelector('.nav').offsetHeight;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
    window.scrollTo({ top: top, behavior: 'smooth' });
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        scrollToElement(target);
    });
});

// ========== ПРОГРЕСС-БАР И КНОПКА НАВЕРХ ==========
const progressBar = document.getElementById('progressBar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
    
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.classList.contains('stat-card')) {
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl && !numberEl.dataset.animated) {
                    animateNumber(numberEl);
                    numberEl.dataset.animated = 'true';
                }
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ========== АНИМАЦИЯ ЧИСЕЛ ==========
function animateNumber(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1800;
    const start = performance.now();
    
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        
        if (isDecimal) {
            el.textContent = current.toFixed(1).replace('.', ',') + suffix;
        } else if (target >= 1000) {
            el.textContent = Math.floor(current).toLocaleString('ru-RU') + suffix;
        } else {
            el.textContent = Math.floor(current) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isDecimal) {
                el.textContent = target.toFixed(1).replace('.', ',') + suffix;
            } else if (target >= 1000) {
                el.textContent = target.toLocaleString('ru-RU') + suffix;
            } else {
                el.textContent = target + suffix;
            }
        }
    }
    requestAnimationFrame(update);
}

// ========== АККОРДЕОН ПРАВИЛ ==========
document.querySelectorAll('.rule-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.rule-content');
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.rule-item').forEach(i => {
            i.classList.remove('active');
            i.querySelector('.rule-content').style.maxHeight = null;
        });
        
        if (!isActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// ========== АККОРДЕОН МОШЕННИЧЕСТВА ==========
document.querySelectorAll('.scam-header').forEach(header => {
    header.addEventListener('click', () => {
        const card = header.parentElement;
        const content = card.querySelector('.scam-content');
        const isActive = card.classList.contains('active');
        
        if (isActive) {
            card.classList.remove('active');
            content.style.maxHeight = null;
        } else {
            card.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// ========== FAQ ==========
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');
        
        if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = null;
        } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ========== КВИЗ ==========
const quizData = [
    {
        scenario: '📞 Вам звонит "сотрудник банка" и сообщает о подозрительной операции. Просит продиктовать код из СМС для "отмены операции".',
        options: [
            'Продиктовать код — банк же звонит!',
            'Положить трубку и позвонить в банк по номеру на карте',
            'Спросить имя сотрудника и его отдел'
        ],
        correct: 1,
        explanation: 'Верно! Настоящий банк никогда не просит код из СМС. Положите трубку и перезвоните сами по номеру на обратной стороне карты.'
    },
    {
        scenario: '📩 Пришло СМС: "Ваш счёт заблокирован! Срочно подтвердите данные по ссылке: sber-bank-secure.ru"',
        options: [
            'Быстро перейти по ссылке, пока не поздно!',
            'Перейти по ссылке, но ничего не вводить',
            'Не переходить по ссылке — проверить через официальное приложение банка'
        ],
        correct: 2,
        explanation: 'Верно! Ссылка ведёт на поддельный сайт (обратите внимание на лишние слова в адресе). Зайдите в банк через официальное приложение.'
    },
    {
        scenario: '🛒 "Покупатель" на Авито хочет купить ваш товар и пишет: "Переведу деньги, но нужен код из СМС для подтверждения получения".',
        options: [
            'Продиктовать код — ведь это же деньги!',
            'Отказаться и общаться только через чат Авито',
            'Попросить покупателя прислать свои данные'
        ],
        correct: 1,
        explanation: 'Верно! Для получения денег код НЕ нужен. Это мошенник, который хочет войти в ваш аккаунт или списать деньги. Общайтесь только через чат сайта.'
    },
    {
        scenario: '🚔 Звонят "из полиции": "На ваше имя оформлен штраф. Если не оплатите сейчас — счёт арестуют через 10 минут!"',
        options: [
            'Срочно оплатить, чтобы не потерять деньги',
            'Положить трубку и проверить штрафы через Госуслуги',
            'Перевести деньги на "безопасный счёт"'
        ],
        correct: 1,
        explanation: 'Верно! Полиция не звонит с требованиями срочной оплаты. Штрафы проверяются через Госуслуги или ГИБДД. Любая срочность и угрозы — признак мошенников.'
    },
    {
        scenario: '👵 Вам звонит "родственник" плачущим голосом: "Бабушка, я попал в аварию! Срочно нужны деньги, переведи на этот номер!"',
        options: [
            'Срочно перевести — человек же плачет!',
            'Положить трубку и перезвонить этому родственнику на известный номер',
            'Спросить, сколько именно нужно денег'
        ],
        correct: 1,
        explanation: 'Верно! Это классическая схема "голосовой подделки". В 2026 году мошенники используют дипфейки — они могут имитировать голос любого человека. Перезвоните родственнику на его обычный номер.'
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuiz() {
    const progress = document.getElementById('quizProgress');
    const content = document.getElementById('quizContent');
    
    progress.innerHTML = quizData.map((_, i) => {
        let cls = 'quiz-progress-dot';
        if (i < currentQuestion) cls += ' completed';
        else if (i === currentQuestion) cls += ' active';
        return `<div class="${cls}"></div>`;
    }).join('');
    
    if (currentQuestion >= quizData.length) {
        renderResult();
        return;
    }
    
    const q = quizData[currentQuestion];
    content.innerHTML = `
        <div class="quiz-question">Вопрос ${currentQuestion + 1} из ${quizData.length}</div>
        <div class="quiz-scenario">${q.scenario}</div>
        <div class="quiz-options" id="quizOptions">
            ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <div class="quiz-nav">
            <div>Счёт: <strong>${score}</strong> из ${quizData.length}</div>
            <button class="btn btn-primary" id="nextBtn" style="display:none;">Далее →</button>
        </div>
    `;
    
    answered = false;
    
    document.querySelectorAll('#quizOptions .quiz-option').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestion++;
            renderQuiz();
        });
    }
}

function handleAnswer(index) {
    if (answered) return;
    answered = true;
    
    const q = quizData[currentQuestion];
    const options = document.querySelectorAll('#quizOptions .quiz-option');
    const feedback = document.getElementById('quizFeedback');
    
    options.forEach((btn, i) => {
        btn.classList.add('disabled');
        if (i === q.correct) btn.classList.add('correct');
        else if (i === index) btn.classList.add('wrong');
    });
    
    if (index === q.correct) {
        score++;
        feedback.className = 'quiz-feedback show correct';
        feedback.innerHTML = '✅ ' + q.explanation;
    } else {
        feedback.className = 'quiz-feedback show wrong';
        feedback.innerHTML = '❌ Неверно. ' + q.explanation;
    }
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'inline-block';
}

function renderResult() {
    const content = document.getElementById('quizContent');
    const percent = Math.round((score / quizData.length) * 100);
    let icon, title, message;
    
    if (percent === 100) {
        icon = '🏆';
        title = 'Превосходно!';
        message = 'Вы отлично распознаёте мошенников! Поделитесь этими знаниями с близкими.';
    } else if (percent >= 60) {
        icon = '👍';
        title = 'Хороший результат!';
        message = 'Вы знаете основы безопасности. Повторите правила, чтобы стать ещё защищённее.';
    } else {
        icon = '📚';
        title = 'Стоит повторить правила';
        message = 'Не переживайте! Изучите 5 правил выше — они помогут вам защититься от мошенников.';
    }
    
    content.innerHTML = `
        <div class="quiz-result">
            <div class="quiz-result-icon">${icon}</div>
            <h3>${title}</h3>
            <div class="quiz-score">${score} /${quizData.length}</div>
            <p style="font-size: 1.15rem; margin-bottom: 25px;">${message}</p>
            <button class="btn btn-primary" id="restartBtn">🔄 Пройти ещё раз</button>
        </div>
    `;
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        renderQuiz();
    });
}

renderQuiz();

// ========== СИМУЛЯТОР ЗВОНКА ==========
const dialogSteps = [
    { speaker: '👤', text: 'Здравствуйте! Это Мария Ивановна? Меня зовут Алексей, я сотрудник службы безопасности Сбербанка.' },
    { speaker: '👤', text: 'С вашего счёта только что попытались списать 47 000 рублей. Мы остановили операцию, но ваш счёт под угрозой!' },
    { speaker: '👤', text: 'Срочно продиктуйте код из СМС, которое сейчас придёт, иначе через 5 минут все деньги будут украдены!' }
];

let dialogIndex = 0;
let simulatorActive = false;

const btnAnswer = document.getElementById('btnAnswer');
const btnHangup = document.getElementById('btnHangup');
const phoneDialog = document.getElementById('phoneDialog');
const callerStatus = document.getElementById('callerStatus');
const simulatorResult = document.getElementById('simulatorResult');

function resetSimulator() {
    simulatorActive = false;
    dialogIndex = 0;
    btnAnswer.disabled = false;
    btnHangup.disabled = false;
    callerStatus.textContent = '📞 Входящий звонок...';
    phoneDialog.innerHTML = '<em>Нажмите "Ответить", чтобы начать разговор</em>';
    simulatorResult.classList.remove('show');
}

btnAnswer.addEventListener('click', () => {
    if (!simulatorActive) {
        simulatorActive = true;
        dialogIndex = 0;
        callerStatus.textContent = '🔴 Разговор...';
        phoneDialog.innerHTML = `<strong>${dialogSteps[0].speaker}:</strong>${dialogSteps[0].text}`;
        dialogIndex = 1;
    } else if (dialogIndex < dialogSteps.length) {
        phoneDialog.innerHTML = `<strong>${dialogSteps[dialogIndex].speaker}:</strong>${dialogSteps[dialogIndex].text}`;
        dialogIndex++;
        
        if (dialogIndex >= dialogSteps.length) {
            btnAnswer.disabled = true;
        }
    }
});

btnHangup.addEventListener('click', () => {
    if (!simulatorActive) {
        simulatorResult.className = 'simulator-result show good';
        simulatorResult.innerHTML = '✅ <strong>Отлично!</strong> Вы не стали разговаривать с мошенником. Это самое правильное решение — положить трубку сразу!<br><button class="simulator-reset" id="simReset1">🔄 Попробовать снова</button>';
    } else {
        simulatorResult.className = 'simulator-result show good';
        simulatorResult.innerHTML = '✅ <strong>Правильно!</strong> Вы положили трубку. Даже если разговор начался — вы остановились вовремя. Мошенник не получил ваших данных.<br><button class="simulator-reset" id="simReset2">🔄 Попробовать снова</button>';
        simulatorActive = false;
    }
    callerStatus.textContent = '📴 Звонок завершён';
    
    const resetHandler = () => resetSimulator();
    const resetBtn = document.getElementById('simReset1') || document.getElementById('simReset2');
    if (resetBtn) resetBtn.addEventListener('click', resetHandler);
});

// ========== ЧЕК-ЛИСТ ==========
const checklistItems = [
    'Я знаю номер своего банка наизусть (или он записан дома)',
    'Я никогда не диктую коды из СМС по телефону',
    'У меня разные пароли для разных сервисов',
    'Я подключил СМС-уведомления о всех операциях по карте',
    'Я проверяю адрес сайта перед вводом данных (https://)',
    'Я не перехожу по ссылкам из СМС и мессенджеров',
    'Я знаю, что полиция не звонит с требованиями срочной оплаты',
    'Я рассказал о правилах безопасности близким'
];

const checklistContainer = document.getElementById('checklistItems');
const checklistBar = document.getElementById('checklistBar');
const checklistStatus = document.getElementById('checklistStatus');

checklistItems.forEach((text) => {
    const item = document.createElement('div');
    item.className = 'checklist-item';
    item.innerHTML = `
        <div class="checklist-checkbox"></div>
        <div class="checklist-text">${text}</div>
    `;
    item.addEventListener('click', () => {
        item.classList.toggle('checked');
        const checkbox = item.querySelector('.checklist-checkbox');
        checkbox.textContent = item.classList.contains('checked') ? '✓' : '';
        updateChecklist();
    });
    checklistContainer.appendChild(item);
});

function updateChecklist() {
    const total = checklistItems.length;
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const percent = (checked / total) * 100;
    checklistBar.style.width = percent + '%';
    
    if (checked === total) {
        checklistStatus.textContent = '🎉 Отлично! Вы максимально защищены!';
        checklistStatus.style.color = 'var(--success)';
    } else {
        checklistStatus.textContent = `Выполнено: ${checked} из ${total}`;
        checklistStatus.style.color = 'var(--primary)';
    }
}