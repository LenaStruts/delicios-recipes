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

function addList(x, id) {
    const in_list = !x.classList.contains('fa-plus');
    fetch(`/ingredient/${id}`, {
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
            }
        })
}

function load_recipe(id) {
    document.querySelector('#recipe').style.display = 'block';
    document.querySelector('#recipes').style.display = 'none';
    fetch(`/recipe/${id}`)
        .then(response => response.json())
        .then(recipe => {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="header">
                    <h3>${recipe.title}</h3>
                    <i onclick="addBook(this, ${recipe.id})" class="float-right ${recipe.added ? 'fas fa-bookmark' : 'far fa-bookmark'}"></i>
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
            ingredients_header.innerHTML = `
                <div>
                    <h5>Ingredients:</h5>
                </div>
                `;
            document.getElementById('ingredients').prepend(ingredients_header);
        })
    fetch(`/ingredients/${id}`)
        .then(response => response.json())
        .then(ingredients => {
            ingredients.forEach(ingredient => {
                let box = document.getElementById('ingredients');
                const el = document.createElement('ul');
                el.innerHTML = `
                        <li><i onclick="addList(this, ${ingredient.id})" class="float-right ${ingredient.in_list ? 'fas fa-minus' : 'fas fa-plus'}"></i>${ingredient.amount} ${ingredient.measurement}${ingredient.measurement === " " ? "" : " of" } ${ingredient.ingredient}</li>
                    `;


                // const icon = document.createElement('i'); =
                // ingredient.className = "float-right ${recipe.added ? 'fas fa-minus' : 'fas fa-plus'}"
                box.append(el);
            })
        })
    fetch(`/instructions/${id}`)
        .then(response => response.json())
        .then(instructions => {
            instructions.forEach(instruction => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <p>${instruction.step} ${durationFormat(instruction.time)}</p>      
                `
                document.querySelector('#recipe').append(div);
            })
        })
}

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
        minutes += "minutes";
    }
    let seconds = `${substr[2]}`;
    if (seconds == 0) {
        seconds = '';
    } else {
        seconds += "seconds";
    }
    return `${hours} ${minutes} ${seconds}`;
}