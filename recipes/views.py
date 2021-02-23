import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Recipe, RecipeBook, ShoppingList, Ingredients, Instructions
from .forms import RecipeForm, IngredientFormSet, InstructionFormSet

# Create your views here.
def index(request):
    recipes = Recipe.objects.all()
    return render(request, "recipes/index.html", {'recipes': recipes})

def new_recipe(request):
    if request.method == "POST":
        recipe_form = RecipeForm(request.POST, request.FILES)
        ingredient_form = IngredientFormSet(request.POST)
        instruction_form = InstructionFormSet(request.POST)
        print(recipe_form)
        recipe_valid = recipe_form.is_valid()
        print(recipe_valid)
        ingredient_valid = ingredient_form.is_valid()
        instruction_valid = instruction_form.is_valid()
        if recipe_valid and ingredient_valid and instruction_valid:
            recipe = recipe_form.save(commit=False)
            recipe.author = request.user
            recipe.published_date = timezone.now()
            recipe = recipe_form.save()
            ingredient_form.instance = recipe
            ingredient_form.save()
            instruction_form.instance = recipe
            instruction_form.save()
            return redirect('index') 
    else:
        recipe_form = RecipeForm()
        ingredient_form = IngredientFormSet()
        instruction_form = InstructionFormSet()
        return render(request, "recipes/edit.html", {'recipe_form': recipe_form, 'ingredient_form': ingredient_form, 'instruction_form': instruction_form})

@csrf_exempt
def recipe_detail(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe not found."}, status=404)

    # Return post content
    if request.method == "GET":
        return JsonResponse(recipe.serialize(request.user))
    elif request.method == "PUT":
        if not request.user.is_anonymous:
            data = json.loads(request.body)
            if data.get("added") is False:
                RecipeBook.objects.filter(owner=request.user, recipe=recipe).delete()
            else:
                book, created = RecipeBook.objects.get_or_create(owner=request.user, recipe=recipe)
                book.save()
            return JsonResponse({"success": "True"}, status=200)
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def ingredients(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
        ingredients = Ingredients.objects.filter(recipe=recipe)
    except Ingredients.DoesNotExist:
        return JsonResponse({"error": "Ingredients not found."}, status=404)
    # Return post content
    if request.method == "GET": 
        return JsonResponse([ingredient.serialize(request.user) for ingredient in ingredients], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)


@csrf_exempt
def ingredient(request, pk):
    try:
        ingredient = Ingredients.objects.get(pk=pk)
    except Ingredients.DoesNotExist:
        return JsonResponse({"error": "Ingredients not found."}, status=404)
    # Return post content
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("in_list") is True:
            ShoppingList.objects.filter(shopper=request.user, ingredient=ingredient).delete()
        else:
            list, created = ShoppingList.objects.get_or_create(shopper=request.user, ingredient=ingredient)
            list.save()
        return JsonResponse({"success": "True"}, status=200)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)



def instructions(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)
        instructions = Instructions.objects.filter(recipe=recipe)
    except Instructions.DoesNotExist:
        return JsonResponse({"error": "Instructions not found."}, status=404)
    # Return post content
    if request.method == "GET":
        return JsonResponse([instruction.serialize() for instruction in instructions], safe=False)
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


@csrf_exempt
def add_recipe_book(request, pk):
    if request.method == "PUT":
        data = json.loads(request.body)
        recipe_to_add = get_object_or_404(Recipe, pk=pk)
        if data.get("added") is True:
            RecipeBook.objects.filter(owner=request.user, recipe=recipe_to_add).delete()
        else:
            user, created = RecipeBook.objects.get_or_create(owner=request.user, recipe=recipe)
            user.save()
        return JsonResponse({"success": "True"}, status=200)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)


def recipe_book(request):
    recipe_book = RecipeBook.objects.filter(owner=request.user)
    return render(request, "recipes/recipe_book.html", {"recipe_book": recipe_book})

def shopping_list(request):
    list = ShoppingList.objects.filter(shopper=request.user)[::1]
    for id1, item1 in enumerate(list):
        for id2, item2 in enumerate(list):
            if (item1.ingredient.ingredient == item2.ingredient.ingredient and
                item1.ingredient.measurement == item2.ingredient.measurement and
                id1 != id2):
               item1.ingredient.amount += item2.ingredient.amount
               list.remove(item2)
    return render(request, "recipes/shopping_list.html", {"list": list})

def add_shopping_list(request, pk):
    if request.method == "PUT":
        data = json.loads(request.body)
        recipe = get_object_or_404(Recipe, pk=pk)
        ingredients_to_add = get_object_or_404(Ingredients, recipe=recipe)
        if data.get("added") is True:
            ShoppingList.objects.filter(shopper=request.user, ingredients=ingredients_to_add).delete()
        else:
            shopper, created = ShoppingList.objects.get_or_create(shopper=request.user, ingredients=ingredients_to_add)
            shopper.save()
        return JsonResponse({"success": "True"}, status=200)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "recipes/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "recipes/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "recipes/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "recipes/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "recipes/register.html")