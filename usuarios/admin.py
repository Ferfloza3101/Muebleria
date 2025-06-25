from django.contrib import admin
from .models import Perfil

# Register your models here.

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'fecha_nacimiento', 'genero', 'direccion', 'telefono')
    fields = ('user', 'fecha_nacimiento', 'genero', 'direccion', 'telefono')
