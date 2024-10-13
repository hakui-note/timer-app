const hoursSelect = document.getElementById('hours');
const minutesSelect = document.getElementById('minutes');
const secondsSelect = document.getElementById('seconds');
const timeDisplay = document.getElementById('time');
const timerButton = document.getElementById('timer-button');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const pauseButton = document.getElementById('pause'); 
const alarm = document.getElementById('alarm');
const modeToggle = document.getElementById('mode-toggle');
const timerMode = document.getElementById('timer-mode');
const pomodoroButton = document.getElementById('pomodoro');
const pomodoroMode = document.getElementById('pomodoro-mode');
const pomodoroStatus = document.getElementById('pomodoro-status');

let timer;
let totalSeconds = 0;
let initialSeconds = 0;
let isPomodoro = false; // ポモドーロの状態
let pomodoroPhase = 'work';
let pomodoroCount = 0; // ポモドーロ回数のカウント
let isPaused = false; // 中断状態を追跡する新しい変数

// プルダウンの選択肢を生成
for (let i = 0; i <= 3; i++) {
    hoursSelect.options.add(new Option(i.toString().padStart(2, '0'), i));
}
for (let i = 0; i <= 59; i++) {
    minutesSelect.options.add(new Option(i.toString().padStart(2, '0'), i));
    secondsSelect.options.add(new Option(i.toString().padStart(2, '0'), i));
}

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleMode(){
    isPomodoro = !isPomodoro;
    // ポモドーロ
    if (isPomodoro) {
        timerMode.classList.add('hidden');
        pomodoroMode.classList.remove('hidden');
        modeToggle.textContent = 'タイマーモードに切替';
        timerButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
        setPomodoroDuration();
    // タイマー
    } else {
        timerMode.classList.remove('hidden');
        pomodoroMode.classList.add('hidden');
        modeToggle.textContent = 'ポモドーロモードに切替';
        timerButton.classList.remove('hidden');
        pauseButton.classList.add('hidden');
        updateTotalSeconds();
    }
    resetTimer();
    updatePomodoroStatus();
}

modeToggle.addEventListener('click', toggleMode)

function startTimer() {
    if (totalSeconds > 0 && !isPaused) {
        timer = setInterval(() => {
            totalSeconds--;
            updateDisplay();
            if (totalSeconds === 0) {
                clearInterval(timer);
                alarm.play();
                if (isPomodoro) {
                    handlePomodoroPhaseEnd();
                }
            }
        }, 1000);
        startButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.textContent = '中断';
    }
}

function stopTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    stopButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    if (isPomodoro) {
        setPomodoroDuration();
    } else {
        updateTotalSeconds();
    }
    totalSeconds = initialSeconds;
    updateDisplay();
    startButton.disabled = false;
    stopButton.disabled = true;
    alarm.pause();
    alarm.currentTime = 0;
    pomodoroPhase = 'work';
    pomodoroCount = 0;
    isPaused = false;
    pomodoroStatus.textContent = '';
    pomodoroButton.textContent = 'ポモドーロ開始';
    pauseButton.disabled = true;
}

function updateTotalSeconds() {
    totalSeconds = hoursSelect.value * 3600 + minutesSelect.value * 60 + parseInt(secondsSelect.value);
    initialSeconds = totalSeconds;
    updateDisplay();
}

function startPomodoro() {
    isPomodoro = true;
    pomodoroPhase = 'work';
    pomodoroCount = 0;
    isPaused = false;
    setPomodoroDuration();
    startTimer();
    updatePomodoroStatus();
    pomodoroButton.textContent = 'ポモドーロ停止';
    pauseButton.disabled = false;
}

function stopPomodoro() {
    isPomodoro = false;
    stopTimer();
    resetTimer();
    pomodoroButton.textContent = 'ポモドーロ開始';
    pomodoroStatus.textContent = '';
    pauseButton.disabled = true;
}

function pausePomodoro() {
    if (isPaused) {
        isPaused = false;
        startTimer();
        pauseButton.textContent = '中断';
        updatePomodoroStatus();
    } else {
        isPaused = true;
        clearInterval(timer);
        pauseButton.textContent = '再開';
        pomodoroStatus.textContent += ' (中断中)';
    }
}

function setPomodoroDuration() {
    if (pomodoroPhase === 'work') {
        totalSeconds = 25 * 60; // 25分
    } else if (pomodoroPhase === 'shortBreak') {
        totalSeconds = 5 * 60; // 5分
    } else if (pomodoroPhase === 'longBreak') {
        totalSeconds = 15 * 60; // 15分
    }
    updateDisplay();
}

function handlePomodoroPhaseEnd() {
    if (pomodoroPhase === 'work') {
        pomodoroCount++;
        if (pomodoroCount % 4 === 0) {
            pomodoroPhase = 'longBreak';
        } else {
            pomodoroPhase = 'shortBreak';
        }
    } else {
        pomodoroPhase = 'work';
    }
    setPomodoroDuration();
    updatePomodoroStatus();
    startTimer();
}

function updatePomodoroStatus() {
    let status = `ポモドーロ ${pomodoroCount + 1}: `;
    if (pomodoroPhase === 'work') {
        status += '作業中';
    } else if (pomodoroPhase === 'shortBreak') {
        status += '短休憩中';
    } else if (pomodoroPhase === 'longBreak') {
        status += '長休憩中';
    }
    if (isPaused) {
        status += ' (中断中)';
    }
    pomodoroStatus.textContent = status;
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
pomodoroButton.addEventListener('click', () => {
    if (isPomodoro) {
        stopPomodoro();
    } else {
        startPomodoro();
    }
});

pauseButton.addEventListener('click', pausePomodoro);

hoursSelect.addEventListener('change', updateTotalSeconds);
minutesSelect.addEventListener('change', updateTotalSeconds);
secondsSelect.addEventListener('change', updateTotalSeconds);

updateTotalSeconds();
updateDisplay();
pauseButton.disabled = true; // 初期状態では中断ボタンを無効化