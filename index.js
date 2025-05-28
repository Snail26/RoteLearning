const els = {
    //if using more than once define here
    body: document.querySelector("body"),
    workarea: document.getElementById("workarea"),
    placementStartBtn: document.getElementById("placementStartBtn"),
    answer: document.getElementById("answer"),
    question: document.getElementById("question"),
    homeScreen: document.getElementById("home"),
    practice: document.getElementById("practice"),
    practiceNums: document.getElementById("practiceNums"),
    speedScoreRecord: document.getElementById("speedScoreRecord"),
    speed: document.getElementById("speed"),
};

function findModeStats(arr = []) {
    const newArr = [];
    arr = arr.sort();
    arr.forEach((num) => {
        let found = false;
        newArr.forEach((dat) => {
            if (dat.number == num) {
                ++dat.frequency;
                found = true;
            }
        });
        if (!found) {
            newArr.push({
                "number": num,
                "frequency": 1
            });
        }
    });
    console.log(newArr);
    const modes = [];
    newArr.forEach(num => {
        if (num.frequency > arr.length / 10) {
            modes.push(num.number);
        }
    });
    return modes;
}

const maintenance = localStorage.getItem("maintenance") ? localStorage.getItem("maintenance").split(",") : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const times = localStorage.getItem("times") ? localStorage.getItem("times").split(",") : [4];
let QA = localStorage.getItem("QA") | 0;
let speedScoreRecord = localStorage.getItem("speedScore") | 0;
let modeStats;
function refreshStats() {
    modeStats = findModeStats(maintenance);
    if (modeStats.length > 1) {
        let popedStats = modeStats.pop();
        els.practiceNums.innerText = modeStats.join(", ") + " and " + popedStats + " Times Tables";
    }
    else {
        els.practiceNums.innerHTML = (modeStats.length == 0 ? (QA > 100 ? "You are the <b>MASTER</b> at" : "Practicing Will Only Make You <b>Better</b> at") : modeStats[0]) + " Times Tables!";
    }
    els.speedScoreRecord.innerText = "Your Speed Score Record: " + speedScoreRecord;
}

if (maintenance.length > 11) {
    els.homeScreen.style.display = "block";
    document.getElementById("prompt").style.display = "none";
    refreshStats();
}
let type = "Test";
let QNo1 = 0;
let QNo2 = 0;
let operation = "*";
let questionsAnswered = 0;
let questionsAnsweredCorrect = 0;
let questionsAnsweredIncorrect = 0;
let time = 0;
let totalTime = 0;
let averageTime = 4;
let timeIncorrect = false;
let answeredQuestion = true;
let speedScore = 0;
function update() {
    localStorage.setItem("maintenance", maintenance);
    localStorage.setItem("QA", QA);
    timeIncorrect = false;
    if (type == "speed") {
        times.push(time);
        localStorage.setItem("times", times);
        let total = 0;
        times.forEach(time => {
            total += time;
        });
        averageTime = total / times.length;
        answeredQuestion = true;
        els.answer.setAttribute("placeholder", "Answer Here");
        QNo1 = maintenance[Math.floor(Math.random() * maintenance.length)];
        QNo2 = maintenance[Math.floor(Math.random() * maintenance.length)];
        els.question.innerText = QNo1 + " " + (operation == "*" ? "x" : operation == "/" ? "÷" : operation) + " " + QNo2 + " =";
    }
    if (questionsAnsweredCorrect < 16 || type == "test" ? (questionsAnswered < 16) : true) {
        if (type == "test") {
            times.push(time);
            localStorage.setItem("times", times);
            let total = 0;
            times.forEach(time => {
                total += time;
            });
            averageTime = total / times.length;
            answeredQuestion = true;
            els.answer.setAttribute("placeholder", "Answer Here");
            QNo1 = maintenance[Math.floor(Math.random() * maintenance.length)];
            QNo2 = maintenance[Math.floor(Math.random() * maintenance.length)];
            els.question.innerText = QNo1 + " " + (operation == "*" ? "x" : operation == "/" ? "÷" : operation) + " " + QNo2 + " =";
        }
        if (type == "practice") {
            if (answeredQuestion) {
                QNo1 = maintenance[Math.floor(Math.random() * maintenance.length)];
                QNo2 = maintenance[Math.floor(Math.random() * maintenance.length)];
                const answer = eval(QNo1 + operation + QNo2);
                els.question.innerText = QNo1 + " " + (operation == "*" ? "x" : operation == "/" ? "÷" : operation) + " " + QNo2 + " is " + answer;
                els.answer.setAttribute("placeholder", answer);
                answeredQuestion = false;
            }
            else {
                if (Math.floor(Math.random() * 3) == 1) {
                    QNo1 = maintenance[Math.floor(Math.random() * maintenance.length)];
                    QNo2 = maintenance[Math.floor(Math.random() * maintenance.length)];
                    els.question.innerText = QNo1 + " " + (operation == "*" ? "x" : operation == "/" ? "÷" : operation) + " " + QNo2 + " =";
                }
                else {
                    els.question.innerText = QNo2 + " " + (operation == "*" ? "x" : operation == "/" ? "÷" : operation) + " " + QNo1 + " =";
                }
                els.answer.setAttribute("placeholder", "Answer Here");
                answeredQuestion = true;
            }
        }

        els.answer.value = "";
        time = 0;
    }
    else {
        els.workarea.style.display = "none";
        els.homeScreen.style.display = "block";
        if (speedScore > speedScoreRecord) {
            speedScoreRecord = speedScore;
            localStorage.setItem("speedScore", speedScoreRecord);
        }
        refreshStats();
    }
}

window.setInterval(() => {
    time += 0.5;
    totalTime += 0.5;
    if (time >= averageTime && type == "test") {
        ++questionsAnsweredIncorrect;
        maintenance.push(QNo1);
        maintenance.push(QNo2);
        timeIncorrect = true;
    }
    if (type == "speed" && totalTime == 20) {
        els.workarea.style.display = "none";
        els.homeScreen.style.display = "block";
        if (speedScore > speedScoreRecord) {
            speedScoreRecord = speedScore;
            localStorage.setItem("speedScore", speedScoreRecord);
        }
        refreshStats();
    }
}, 500);

els.answer.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && els.answer.value) {
        ++QA;
        ++questionsAnswered;
        if (els.answer.value == eval(QNo1 + operation + QNo2)) {
            if (answeredQuestion || type == "test") {
                ++questionsAnsweredCorrect;
            }
            if (type == "speed") {
                ++speedScore;
            }
        }
        else {
            if (!timeIncorrect && answeredQuestion) {
                ++questionsAnsweredIncorrect;
                maintenance.push(QNo1);
                maintenance.push(QNo2);
            }
        }
        //answeredQuestion is true when a real question has been asked
        update();
    }
});

function startTest(type1 = "test") {
    type = type1;
    QNo1 = 0;
    QNo2 = 0;
    operation = "*";
    questionsAnswered = 0;
    questionsAnsweredCorrect = 0;
    questionsAnsweredIncorrect = 0;
    time = 0;
    totalTime = 0;
    timeIncorrect = false;
    answeredQuestion = true;
    speedScore = 0;
    els.workarea.style.display = "block";
    update();
}

els.placementStartBtn.addEventListener("click", () => {
    document.getElementById("prompt").style.display = "none";
    els.workarea.style.display = "block";
    startTest("test");
});

els.practice.addEventListener("click", () => {
    els.homeScreen.style.display = "none";
    startTest("practice");
});
document.getElementById("test").addEventListener("click", () => {
    els.homeScreen.style.display = "none";
    startTest("test");
});
els.speed.addEventListener("click", () => {
    els.homeScreen.style.display = "none";
    startTest("speed");
});