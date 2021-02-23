from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path("recipe/new/", views.new_recipe, name='new_recipe'),
    path("recipe_book", views.recipe_book, name="recipe_book"),
    path("shopping_list", views.shopping_list, name="shopping_list"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # API Routes
    path('recipe/<int:pk>', views.recipe_detail, name='recipe_detail'),
    path('ingredients/<int:pk>', views.ingredients, name='ingredients'),
    path('ingredient/<int:pk>', views.ingredient, name='ingredient'),
    path('instructions/<int:pk>', views.instructions, name='instructions'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)