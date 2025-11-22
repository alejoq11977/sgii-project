from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    """
    Configuración para que el Admin de Django muestre nuestros campos personalizados
    """
    model = User
    
    # Agregamos una sección nueva en la pantalla de edición de usuario
    fieldsets = UserAdmin.fieldsets + (
        ('Información SGII', {'fields': ('role', 'document_id', 'phone', 'boss')}),
    )
    
    # Agregamos los campos a la pantalla de "Crear Usuario"
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información SGII', {'fields': ('role', 'document_id', 'phone', 'boss')}),
    )
    
    # Columnas que se ven en la lista de usuarios
    list_display = ['username', 'email', 'role', 'document_id', 'is_staff']

# Registramos el modelo
admin.site.register(User, CustomUserAdmin)