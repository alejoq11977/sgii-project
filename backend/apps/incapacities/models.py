from django.db import models
from django.conf import settings
import os

def incapacity_file_path(instance, filename):
    """Genera una ruta única: uploads/incapacities/CEDULA_USER/FILENAME"""
    return os.path.join('uploads', 'incapacities', instance.incapacity.employee.document_id, filename)

class Incapacity(models.Model):
    """
    Entidad principal que representa la Incapacidad Médica.
    """
    class Types(models.TextChoices):
        GENERAL_DISEASE = 'EG', 'Enfermedad General'
        WORK_ACCIDENT = 'AL', 'Accidente Laboral'
        TRAFFIC_ACCIDENT = 'AT', 'Accidente de Tránsito'
        MATERNITY = 'LM', 'Licencia de Maternidad'
        PATERNITY = 'LP', 'Licencia de Paternidad'
        # Agregamos 'Luto' u otros si fuera necesario

    class Status(models.TextChoices):
        REPORTED = 'REPORTED', 'Reportada (Documentos pendientes)'
        IN_PROCESS = 'IN_PROCESS', 'En Trámite (Docs Completos)'
        TRANSCRIBED = 'TRANSCRIBED', 'Transcrita en EPS'
        AUTHORIZED = 'AUTHORIZED', 'Autorizada / Cobrada'
        REJECTED = 'REJECTED', 'Rechazada por EPS'
        PAID = 'PAID', 'Pagada'
        CLOSED = 'CLOSED', 'Cerrada / Archivada'

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='incapacities'
    )
    incapacity_type = models.CharField(max_length=2, choices=Types.choices)
    
    # Información médica
    diagnosis_code = models.CharField(max_length=10, verbose_name="Código CIE-10")
    start_date = models.DateField(verbose_name="Fecha Inicio")
    end_date = models.DateField(verbose_name="Fecha Fin")
    days = models.PositiveIntegerField(verbose_name="Días de incapacidad")
    
    # Entidad Externa (EPS/ARL)
    entity_name = models.CharField(max_length=100, verbose_name="EPS o ARL")
    
    ibc_value = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        verbose_name="IBC (Salario Mes)"
    )

    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.REPORTED
    )
    
    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_payment_responsibility(self):
        """
        Lógica del Manual 5.5.2: 
        Días 1-2: Empresa (100%)
        Días 3-90: EPS (66.67%)
        Etc.
        (Esto lo implementaremos en la lógica, pero el modelo queda listo)
        """
        pass

    def __str__(self):
        return f"INC-{self.id} | {self.employee.document_id} | {self.status}"

class IncapacityDocument(models.Model):
    """
    Documentos soporte (PDF 1 - Definiciones).
    """
    class DocTypes(models.TextChoices):
        CERTIFICATE = 'CERT', 'Certificado Incapacidad'
        EPICRISIS = 'EPI', 'Epicrisis / Historia Clínica'
        FURIPS = 'FURIPS', 'Formulario FURIPS (Accidentes)'
        CIVIL_REG = 'REG', 'Registro Civil (Paternidad)'
        ID_COPY = 'ID', 'Copia Cédula'
        OTHER = 'OTH', 'Otro'

    incapacity = models.ForeignKey(
        Incapacity, 
        on_delete=models.CASCADE, 
        related_name='documents'
    )
    document_type = models.CharField(max_length=10, choices=DocTypes.choices)
    file = models.FileField(upload_to=incapacity_file_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False, verbose_name="Aprobado por RRHH")
    rejection_reason = models.TextField(blank=True, null=True, verbose_name="Motivo de rechazo")

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.incapacity.id}"

class StatusHistory(models.Model):
    """
    Trazabilidad: Permite saber cuándo cambió de estado y quién lo hizo.
    """
    incapacity = models.ForeignKey(Incapacity, on_delete=models.CASCADE)
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    change_date = models.DateTimeField(auto_now_add=True)
    observation = models.TextField(blank=True)