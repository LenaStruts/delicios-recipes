from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db.models import DurationField

from django.utils.translation import gettext_lazy as _

# Create your models here.
class User(AbstractUser):
    pass


class Recipe(models.Model):

    class Categories(models.TextChoices):
        BREAKFASTS = 'Breakfasts', _('Breakfasts')
        APPETIZERS = 'Appetizers', _('Appetizers')
        SOUPS = 'Soups', _('Soups')
        MAIN_DISHES = 'Main_Dishes', _('Main Dishes')
        SALADS = 'Salads', _('Salads')
        DESSERTS_AND_PASTRY = 'Desserts_and_PASTRY', _('Desserts & Pastry')
        SAUCES = 'Sauces', _('Sauces')
        DRINKS = 'Drinks', _('Drinks')

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipe_author')
    title = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='images')
    category = models.CharField(max_length=64, blank=True, choices=Categories.choices)
    time = DurationField()
    published_date = models.DateTimeField(auto_now_add=True)
    

class Instructions(models.Model):
    step = models.TextField()
    time = DurationField()
    recipe = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE, related_name='recipe_instructions')


class Ingredients(models.Model):

    class Measurements(models.TextChoices):
        grams = 'grams', _('g')
        milliliters = 'milliliters', _('ml')
        teaspoon = 'teaspoon', _('tsp')
        tablespoon = 'tablespoon', _('tbsp')
        cups = 'cups', _('cups')
        pieces = ' ', _(' ')

    ingredient = models.CharField(max_length=200)
    amount = models.IntegerField()
    measurement = models.CharField(max_length=64, choices=Measurements.choices)
    recipe = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE, related_name='recipe_ingredients')


class RecipeBook(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='book_owner')
    recipe = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE, related_name='recipes') 


class ShoppingList(models.Model):
    shopper = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='list_owner')
    ingredients = models.ForeignKey('recipes.Ingredients', on_delete=models.CASCADE, related_name='total_ingredients') 
