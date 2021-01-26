from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.utils import timezone

from .models import User, Recipe
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

def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'recipes/recipe_detail.html', {'recipe': recipe})


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