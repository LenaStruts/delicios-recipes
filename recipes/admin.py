from django.contrib import admin
from .models import User, Recipe, Instructions, Ingredients, RecipeBook, ShoppingList

# Register your models here.
admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(Ingredients)
admin.site.register(Instructions)
admin.site.register(RecipeBook)
admin.site.register(ShoppingList)
