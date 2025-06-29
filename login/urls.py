from django.urls import path
from . import views

app_name = 'login'

urlpatterns = [
    path('', views.user_login, name='login'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('registro/', views.registro, name='registro'),
]