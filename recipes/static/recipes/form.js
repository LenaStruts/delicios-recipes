document.addEventListener('DOMContentLoaded', function() {
    let ingredientForm = document.querySelectorAll(".ingredient-form");
    let containerIngredient = document.getElementById("container-ingredient-formset");
    let addIngredient = document.getElementById("add-ingredient-form");
    let removeIngredient = document.getElementById("remove-ingredient-form");
    let totalIngredientForms = document.getElementById("id_recipe_ingredients-TOTAL_FORMS");

    let instructionForm = document.querySelectorAll(".instruction-form");
    let containerInstruction = document.getElementById("container-instruction-formset");
    let addInstruction = document.getElementById("add-instruction-form");
    let removeInstruction = document.getElementById("remove-instruction-form");
    let totalInstructionForms = document.getElementById("id_recipe_instructions-TOTAL_FORMS");

    let formIngredientNum = ingredientForm.length - 1;
    let formInstructionNum = instructionForm.length - 1;
    removeIngredient.addEventListener('click', removeIngredientForm);
    addIngredient.addEventListener('click', addIngredientForm);
    removeInstruction.addEventListener('click', removeInstructionForm);
    addInstruction.addEventListener('click', addInstructionForm);

    function addIngredientForm(e) {
        e.preventDefault();

        let newForm = ingredientForm[0].cloneNode(true);
        let formRegex = RegExp(`recipe_ingredients-(\\d){1}-`, 'g');

        formIngredientNum++;
        newForm.innerHTML = newForm.innerHTML.replace(formRegex, `recipe_ingredients-${formIngredientNum}-`);
        containerIngredient.insertBefore(newForm, null);

        totalIngredientForms.setAttribute('value', `${formIngredientNum+1}`);
    }

    function removeIngredientForm(e) {
        e.preventDefault();
        containerIngredient.removeChild(containerIngredient.lastChild);
    }

    function addInstructionForm(e) {
        e.preventDefault();

        let newForm = instructionForm[0].cloneNode(true);
        let formRegex = RegExp(`recipe_instructions-(\\d){1}-`, 'g');

        formInstructionNum++;
        newForm.innerHTML = newForm.innerHTML.replace(formRegex, `recipe_instructions-${formInstructionNum}-`);
        containerInstruction.insertBefore(newForm, null);

        totalInstructionForms.setAttribute('value', `${formInstructionNum+1}`);
    }

    function removeInstructionForm(e) {
        e.preventDefault();
        containerInstruction.removeChild(containerInstruction.lastChild);
    }
});