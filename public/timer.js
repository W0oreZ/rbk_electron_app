const { Timer } = require('timer-node');

const timer1 = new Timer({label: "uptime"});

function startTimer() {
    timer1.start();
}

function pauseTimer() {
    timer1.pause();
}

function resumeTimer() {
    timer1.resume();
}

function resetTimer() {
    timer1.stop();

    startTimer();
}

function getTimer() {
    return Math.floor(timer1.ms()/1000.00);
}



module.exports = {
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getTimer
};