from . import views

from django.urls import path

urlpatterns = [
    path('api/users', views.UsersView.as_view()),
    path('api/signup/', views.RegisterUser.as_view())
]