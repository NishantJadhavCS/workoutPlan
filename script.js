const WEEKDAYS = [
    { key: "sun", label: "Sun", jsDay: 0, dayKey: null },
    { key: "mon", label: "Mon", jsDay: 1, dayKey: "day1" },
    { key: "tue", label: "Tue", jsDay: 2, dayKey: "day2" },
    { key: "wed", label: "Wed", jsDay: 3, dayKey: "day3" },
    { key: "thu", label: "Thu", jsDay: 4, dayKey: "day4" },
    { key: "fri", label: "Fri", jsDay: 5, dayKey: "day5" },
    { key: "sat", label: "Sat", jsDay: 6, dayKey: null },
];

let workoutData = null;
let activeKey = null;

const nav = document.getElementById("day-nav");
const pill = document.getElementById("day-nav-pill");
const dayTitle = document.getElementById("day-title");
const dayFocus = document.getElementById("day-focus");
const exerciseCount = document.getElementById("exercise-count");
const exerciseTable = document.getElementById("exercise-table");
const exerciseList = document.getElementById("exercise-list");
const restMessage = document.getElementById("rest-message");

function buildNav(todayJsDay) {
    WEEKDAYS.forEach(day => {
        const btn = document.createElement("button");
        btn.className = "day-btn";
        btn.dataset.key = day.key;
        if (day.jsDay === todayJsDay) btn.classList.add("today");
        if (!day.dayKey) btn.classList.add("rest-day");

        const label = document.createElement("span");
        label.textContent = day.label;
        const small = document.createElement("small");
        small.textContent = day.dayKey ? day.dayKey.replace("day", "Day ") : "Rest";

        btn.appendChild(label);
        btn.appendChild(small);
        btn.addEventListener("click", () => selectDay(day.key));

        nav.appendChild(btn);
    });
}

function movePillTo(btn) {
    if (!btn) return;
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 8}px)`;
}

function selectDay(key) {
    activeKey = key;
    const day = WEEKDAYS.find(d => d.key === key);

    nav.querySelectorAll(".day-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.key === key);
    });
    movePillTo(nav.querySelector(`.day-btn[data-key="${key}"]`));
    pill.classList.toggle("rest", !day.dayKey);

    if (!day.dayKey) {
        showRestDay();
        return;
    }

    renderWorkout(workoutData[day.dayKey]);
}

function showRestDay() {
    exerciseList.innerHTML = "";
    exerciseTable.style.display = "none";
    restMessage.style.display = "block";
    dayTitle.textContent = "Rest Day";
    dayFocus.textContent = "";
    exerciseCount.textContent = "";
    exerciseCount.style.display = "none";
}

function renderWorkout(workout) {
    restMessage.style.display = "none";
    exerciseTable.style.display = "grid";
    exerciseCount.style.display = "inline-block";

    const [, focus] = workout.title.split("–");
    dayTitle.textContent = workout.title.split("–")[0].trim();
    dayFocus.textContent = focus ? focus.trim() : "";
    exerciseCount.textContent = `${workout.exercises.length} exercises`;

    exerciseList.innerHTML = "";

    workout.exercises.forEach((ex, i) => {
        const row = document.createElement("div");
        row.classList.add("exercise-row");
        row.style.animationDelay = `${i * 60}ms`;

        const exName = document.createElement("span");
        const indexBadge = document.createElement("span");
        indexBadge.className = "ex-index";
        indexBadge.textContent = i + 1;
        exName.appendChild(indexBadge);
        exName.appendChild(document.createTextNode(ex.name));

        const exMuscles = document.createElement("span");
        ex.muscles.forEach(m => {
            const tag = document.createElement("span");
            tag.className = "muscle-tag";
            tag.textContent = m;
            exMuscles.appendChild(tag);
        });

        row.appendChild(exName);
        row.appendChild(exMuscles);
        exerciseList.appendChild(row);
    });
}

async function init() {
    const res = await fetch("workouts.json");
    workoutData = await res.json();

    const todayJsDay = new Date().getDay();
    buildNav(todayJsDay);

    const todayEntry = WEEKDAYS.find(d => d.jsDay === todayJsDay);
    const initialKey = todayEntry ? todayEntry.key : "mon";
    selectDay(initialKey);

    window.addEventListener("resize", () => {
        movePillTo(nav.querySelector(`.day-btn[data-key="${activeKey}"]`));
    });
}

init();
