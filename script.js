async function loadWorkout() {
    const res = await fetch('workouts.json');
    const data = await res.json();

    const today = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
    let dayKey;
    if (today >= 1 && today <= 5) {
        dayKey = "day" + today; // Mon=day1 ... Fri=day5
    } else {
        document.getElementById("day-title").innerText = "Rest Day 💤";
        return;
    }

    const workout = data[dayKey];
    document.getElementById("day-title").innerText = workout.title;

    const list = document.getElementById("exercise-list");
    list.innerHTML = "";

    workout.exercises.forEach(ex => {
        const row = document.createElement("div");
        row.classList.add("exercise-row");

        const exName = document.createElement("span");
        exName.textContent = ex.name;

        const exMuscles = document.createElement("span");
        exMuscles.textContent = ex.muscles.join(", ");

        row.appendChild(exName);
        row.appendChild(exMuscles);

        list.appendChild(row);
    });
}

loadWorkout();
