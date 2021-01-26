from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    path('recipe/<int:pk>/', views.recipe_detail, name='recipe_detail'),
    path("recipe/new/", views.new_recipe, name='new_recipe'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)