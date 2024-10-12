const hoursSelect = document.getElementById('hours');
const minutesSelect = document.getElementById('minutes');
const secondsSelect = document.getElementById('seconds');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const alarm = document.getElementById('alarm');

let timer;
let totalSeconds = 0;
let initialSeconds = 0;

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

function startTimer() {
    if (totalSeconds > 0) {
        timer = setInterval(() => {
            totalSeconds--;
            updateDisplay();
            if (totalSeconds === 0) {
                clearInterval(timer);
                alarm.play();
            }
        }, 1000);
        startButton.disabled = true;
        stopButton.disabled = false;
    }
}

function stopTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    stopButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    totalSeconds = initialSeconds;
    updateDisplay();
    startButton.disabled = false;
    stopButton.disabled = true;
    alarm.pause();
    alarm.currentTime = 0;
}

function updateTotalSeconds() {
    totalSeconds = hoursSelect.value * 3600 + minutesSelect.value * 60 + parseInt(secondsSelect.value);
    initialSeconds = totalSeconds; // 追加: 初期設定時間を保存
    updateDisplay();
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

hoursSelect.addEventListener('change', updateTotalSeconds);
minutesSelect.addEventListener('change', updateTotalSeconds);
secondsSelect.addEventListener('change', updateTotalSeconds);

updateTotalSeconds();
updateDisplay();