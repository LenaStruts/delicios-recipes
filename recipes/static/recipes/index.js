document.addEventListener('DOMContentLoaded', function() {
    let link = document.querySelectorAll(".recipe-detail");
    link.forEach((element) => {
        element.addEventListener("click", () => {
            id = element.id;
            load_recipe(id);
        });
    });

    // let button = document.querySelector(".add");
    // id = button.id;
    // button.addEventListener('click', () => addBook(id));
})

function addBook(x, id) {
    const added = !x.classList.contains('fas');
    fetch(`/recipe/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                added
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                console.log(error);
            } else {
                x.classList.toggle("far");
                x.classList.toggle("fas");
            }
        })
}

function addList(x, id, all = false) {
    const in_list = !x.classList.contains('fa-plus');
    fetch(`/ingredient${all ? 's' : ''}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                in_list
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                console.log(error);
            } else {
                x.classList.toggle("fa-minus");
                x.classList.toggle("fa-plus");
                if (all) {
                    document.querySelectorAll(".ingredient").forEach((el) => {
                        el.classList.remove("fa-minus");
                        el.classList.remove("fa-plus");
                        el.classList.add(in_list ? "fa-plus" : "fa-minus");
                    });
                } else {
                    const areAllMinus = Array.from(document.querySelectorAll(".ingredient")).every((el) => {
                        return el.classList.contains("fa-minus");
                    });
                    const el = document.querySelector("#allIngredientButton");
                    el.classList.remove("fa-plus");
                    el.classList.remove("fa-minus");
                    if (areAllMinus) {
                        el.classList.add("fa-minus");
                    } else {
                        el.classList.add("fa-plus");
                    }
                }
            }
        })
}

function load_recipe(id) {
    document.querySelector('#recipe').style.display = 'block';
    document.querySelector('#recipes').style.display = 'none';
    fetch(`/ingredients/${id}`)
        .then(response => response.json())
        .then(ingredients => {
            ingredients.forEach(ingredient => {
                let box = document.getElementById('ingredients');
                const el = document.createElement('ul');
                el.innerHTML = `
                        <li><i onclick="addList(this, ${ingredient.id})" class="ingredient float-right ${ingredient.in_list ? 'fas fa-minus' : 'fas fa-plus'}"></i>${ingredient.amount} ${ingredient.measurement}${ingredient.measurement === " " ? "" : " of" } ${ingredient.ingredient}</li>
                    `;


                // const icon = document.createElement('i'); =
                // ingredient.className = "float-right ${recipe.added ? 'fas fa-minus' : 'fas fa-plus'}"
                box.append(el);
            });
            fetch(`/recipe/${id}`)
                .then(response => response.json())
                .then(recipe => {
                    const element = document.createElement('div');
                    element.innerHTML = `
                    <div class="header">
                        <div class="row">
                        <div class="col-lg-7 col-sm-11">
                        <h3>${recipe.title}</h3>
                        <i onclick="addBook(this, ${recipe.id})" class="float-right ${recipe.added ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
                        </div>
                        </div>
                        <h5>${recipe.category}</h5>
                        <p>Cooking time: ${durationFormat(recipe.time)}</p>
                    </div>
                `;
                    document.querySelector('#recipe').prepend(element);
                    const image = document.createElement('img');
                    image.setAttribute('src', `${recipe.photo}`);
                    image.setAttribute('width', '100%');
                    document.querySelector('#image').append(image);
                    const ingredients_header = document.createElement('div');
                    const is_in_list = ingredients.findIndex((ingredient) => ingredient.in_list === false) < 0;
                    ingredients_header.innerHTML = `
                    <div>
                    <i onclick="addList(this, ${recipe.id}, all = true)" id="allIngredientButton" class="float-right ${is_in_list ? 'fas fa-minus' : 'fas fa-plus'}"></i>
                        <h5>Ingredients:</h5>
                        <br>
                    </div>
                    `;
                    document.getElementById('ingredients').prepend(ingredients_header);

                    const instructions_header = document.createElement('div');
                    instructions_header.innerHTML = `
                    <div>
                        <h5>Instructions:</h5>
                    </div>
                    `;
                    document.getElementById('instructions').prepend(instructions_header);
                });
        })
    fetch(`/instructions/${id}`)
        .then(response => response.json())
        .then(instructions => {
            instructions.forEach(instruction => {
                const div = document.createElement('ul');
                div.innerHTML = `
                    <li>${instruction.step} <span id="time-${instruction.id}">${durationFormat(instruction.time)} </span><i id="watch-${instruction.id}" onclick="startTimer('${instruction.time}', ${instruction.id})" class="fas fa-stopwatch"></i><i id="alarm-${instruction.id}" class=""></i></li>      
                `
                document.querySelector('#instructions').append(div);
            })
        })
}

const timers = {};
let audio = new Audio('./static/recipes/Information_Block.ogg');

function startTimer(duration, id) {
    if (timers[id]) {
        return;
    }
    timers[id] = {};
    document.getElementById(`time-${id}`).style.display = 'none';
    document.getElementById(`watch-${id}`).classList.remove("fa-stopwatch");
    timers[id].clock = document.getElementById(`alarm-${id}`);
    timers[id].duration = moment.duration(duration).asSeconds();
    timers[id].durationLeft = moment.duration(duration).asSeconds();
    playTimer(id);
}

function pauseTimer(id, durationLeft) {
    timers[id].durationLeft = durationLeft;
    clearInterval(timers[id].timeinterval);
    const t = timers[id].t;
    timers[id].clock.innerHTML = `${t.minutes} minutes ${t.seconds} seconds <i onclick="playTimer('${id}')" class="fas fa-play"></i>`;
}

function playTimer(id) {
    const currentTime = Date.parse(new Date());
    let durationLeft = timers[id].durationLeft;
    const deadline = new Date(currentTime + durationLeft * 1000);

    function updateClock() {
        durationLeft = durationLeft - 1;
        const t = time_remaining(deadline);
        timers[id].clock.innerHTML = `${t.minutes} minutes ${t.seconds} seconds <i onclick="pauseTimer('${id}', ${durationLeft})" class="fas fa-pause"></i>`;
        if (t.total <= 0) {
            clearInterval(timers[id].timeinterval);
            timers[id].clock.innerHTML = `Done <i onclick="stopTimer(${id})" class="fas fa-stop"></i>`;
            audio.loop = true;
            audio.play();
        }
        timers[id].t = t;
    }
    updateClock();
    timers[id].timeinterval = setInterval(updateClock, 1000);
}

function stopTimer(id) {
    audio.pause();
    document.getElementById(`time-${id}`).style.display = 'inline';
    document.getElementById(`watch-${id}`).classList.add("fa-stopwatch");
    timers[id].clock.innerHTML = '';
    timers[id] = undefined;
}

function runTimer(duration, id) {
    document.getElementById(`time-${id}`).style.display = 'none';
    document.getElementById(`alarm-${id}`).className = "";
    durationAsS = moment.duration(duration).asSeconds();
    let current_time = Date.parse(new Date());
    let deadline = new Date(current_time + durationAsS * 1000);
    let timeinterval;
    let clock = document.getElementById(`alarm-${id}`);

    function update_clock() {
        let t = time_remaining(deadline);
        clock.innerHTML = `${t.minutes} minutes ${t.seconds}seconds <i onclick="pause_clock(timeinterval, t, id)" class="fas fa-pause"></i>`;
        if (t.total <= 0) { clearInterval(timeinterval); }
    }
    update_clock(); // run function once at first to avoid delay
    timeinterval = setInterval(update_clock, 1000);
}

function time_remaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    let days = Math.floor(t / (1000 * 60 * 60 * 24));
    return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
}


// function startTimer(duration, id) {
//     let timerInterval = null;
//     let timePassed = 0;
//     document.getElementById(`time-${id}`).style.display = 'none';
//     document.getElementById(`alarm-${id}`).className = "";
//     time = moment.duration(duration).asSeconds();
//     const TIME_LIMIT = time;
//     let timeLeft = TIME_LIMIT;
//     timerInterval = setInterval(() => {
//         // The amount of time passed increments by one
//         timePassed = timePassed += 1;
//         timeLeft = TIME_LIMIT - timePassed;

//         // The time left label is updated
//         document.getElementById(`alarm-${id}`).innerHTML = `${formatTime(timeLeft)} <i onclick="clearInterval(${timerInterval})" class="fas fa-pause"></i>`;
//         if (timeLeft < 0) {
//             clearInterval(timerInterval);
//             document.getElementById(`alarm-${id}`).innerHTML = "EXPIRED";
//         }
//     }, 1000);

// }

// function formatTime(time) {
//     // The largest round integer less than or equal to the result of time divided being by 60.
//     let minutes = Math.floor(time / 60);
//     if (minutes === 1) {
//         minutes = `${minutes} minute`;
//     } else if (minutes < 1) {
//         minutes = '';
//     } else {
//         minutes = `${minutes} minutes`;
//     }
//     // Seconds are the remainder of the time divided by 60 (modulus operator)
//     let seconds = time % 60;

//     // If the value of seconds is less than 10, then display seconds with a leading zero
//     if (seconds === 1) {
//         seconds = `0${seconds} second`;
//     } else if (seconds < 10) {
//         seconds = `0${seconds} seconds`;
//     } else {
//         seconds = `${seconds} seconds`;
//     }

//     // The output in MM:SS format
//     return `${minutes} ${seconds}`;
// }

function durationFormat(duration) {
    durationStr = moment.utc(moment.duration(duration).asMilliseconds()).format("HH:mm:ss");
    const substr = durationStr.split(':');
    let hours = `${substr[0]}`;
    if (hours == 0) {
        hours = '';
    } else {
        hours += "hours";
    }
    let minutes = `${substr[1]}`;
    if (minutes == 0) {
        minutes = '';
    } else if (`${minutes[0]}` == 0) {
        if (`${minutes[1]}` == 1) {
            minutes = `${minutes[1]}minute`;
        } else {
            minutes = `${minutes[1]}minutes`;
        }
    } else {
        minutes += " minutes";
    }
    let seconds = `${substr[2]}`;
    if (seconds == 0) {
        seconds = '';
    } else {
        seconds += " seconds";
    }
    return `${hours} ${minutes} ${seconds}`;
}