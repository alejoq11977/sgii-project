from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Modelo de usuario personalizado que soporta los roles definidos
    en el manual de procedimientos.
    """
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador del Sistema'
        RRHH = 'RRHH', 'Gestión Humana / Auxiliar'
        TREASURY = 'TREASURY', 'Tesorería / Contabilidad'
        LEADER = 'LEADER', 'Líder / Jefe Inmediato'
        EMPLOYEE = 'EMPLOYEE', 'Colaborador'

    # Campos adicionales al estándar de Django
    role = models.CharField(
        max_length=20, 
        choices=Roles.choices, 
        default=Roles.EMPLOYEE,
        verbose_name="Rol en el sistema"
    )
    document_id = models.CharField(
        max_length=20, 
        unique=True, 
        verbose_name="Cédula / Identificación"
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Relación con el jefe inmediato (para el flujo de notificaciones)
    boss = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='subordinates',
        verbose_name="Jefe Inmediato"
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.get_role_display()}"