/*
    I wrote the first function before I got to know that we can add classes that enable us to choose
    to display an element as we click on a button, so I dynamically created the form element.
    I used the css class method later to remove the images in the introduction page
*/

document.querySelector(".btn-start").addEventListener("click", function(event) {
    event.preventDefault(); 
    document.querySelector(".title-image").classList.add("active");
    document.querySelector(".img-container").classList.add("img-container-active");
    document.querySelector(".subtitle-image").remove();
    document.querySelector(".btn-start").remove();
    
    //I created delay so that it waits for the title to move up
    setTimeout(function(){
        document.querySelector(".streak-container").classList.remove("inactive")
        document.querySelector(".habit-list-container").classList.remove("inactive")
        document.querySelector(".main-container").classList.remove("inactive")
        
        if(!document.getElementById("habitForm")){
        const habitForm = document.createElement("div");
        habitForm.id = "habitForm";
        habitForm.classList.add("habitForm");
        habitForm.classList.add("fade-in");

        const input = document.createElement("input");
        input.type = "text";
        input.id = "habitName";
        input.placeholder = "Enter Habit";
        input.classList.add("habitName");

        const button = document.createElement("button");
        button.id = "addHabitButton";
        button.textContent = "Add";
        button.classList.add("button-class");

        habitForm.appendChild(input);
        habitForm.appendChild(button);
        const mainContainer = document.querySelector(".main-container");
        mainContainer.appendChild(habitForm);
        }

        const button = document.getElementById("addHabitButton");
        button.addEventListener("click", addHabit);

    }, 200);
});

//displays events as soon as the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    displayHabits();
});

//function for adding habits
const addHabit = () => {
    const habitNameInput = document.getElementById("habitName");
    const habitList = document.getElementById("habitListItems");
    if (!habitList) {
        console.error("habitListItems element not found!");
        return;
    }

    const habitName = habitNameInput.value.trim();

    if (habitName) {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        habits.push({
            name: habitName,
            streak: 0,
            lastCompletedDate: null
        });
        localStorage.setItem("habits", JSON.stringify(habits));
        habitNameInput.value = "";
        displayHabits();
    }
};

//function for checking after we completed doing the daily task
const markCompleted = (index) => {
    const today = new Date().toDateString();
    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    if (habits[index].lastCompletedDate !== today) {
        habits[index].streak = habits[index].lastCompletedDate ? habits[index].streak + 1 : 1;
        habits[index].lastCompletedDate = today;
        localStorage.setItem("habits", JSON.stringify(habits));
        displayHabits();
    }
};

//code for deleting a habit
const deleteHabit = (index) => {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.splice(index, 1); // Removes the habit at the given index
    localStorage.setItem("habits", JSON.stringify(habits));
    displayHabits();
};

//code for displaying habits
const displayHabits = () => {
    const habitList = document.getElementById("habitListItems");
    const streakDisplay = document.getElementById("streakDisplay");

    if (!habitList || !streakDisplay) return;

    habitList.innerHTML = "";
    streakDisplay.innerHTML = "";

    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    habits.forEach((habit, index) => {
        const habitItem = document.createElement("li");
        habitItem.classList.add("habit-item");
        habitItem.innerHTML = `
            <span class="list-bar">
                <span>${habit.name}</span>
                <span class="streak-right">
                <span class="streak-count ">Streak: ${habit.streak}</span>
                <button class="delete-item" data-index="${index}">
                    <img src="assets/delete.png"/ class="delete-img">
                </button>
                </span>
            </span>
            <button class="mark-btn" data-index="${index}" ${habit.lastCompletedDate === new Date().toDateString() ? "disabled" : ""}>
                ${habit.lastCompletedDate === new Date().toDateString() ? "Checked" : "Check"}
            </button>
            
        `;

        habitList.appendChild(habitItem);
    });

    document.querySelectorAll(".mark-btn").forEach(btn => {
        btn.addEventListener("click", (event) => {
            markCompleted(event.target.dataset.index);
        });
    });

    // Delete button functionality
    document.querySelectorAll(".delete-item").forEach(btn => {
        btn.addEventListener("click", (event) => {
            deleteHabit(event.target.dataset.index);
        });
    });
};

document.addEventListener("DOMContentLoaded", displayHabits);
