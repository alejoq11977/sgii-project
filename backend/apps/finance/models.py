from django.db import models
from apps.incapacities.models import Incapacity

class Payment(models.Model):
    incapacity = models.ForeignKey(
        Incapacity, 
        on_delete=models.CASCADE, 
        related_name='payments'
    )
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Valor Pagado")
    payment_date = models.DateField(verbose_name="Fecha del Pago")
    reference_number = models.CharField(max_length=50, verbose_name="Número de Referencia/Comprobante")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago ${self.amount_paid} - {self.incapacity.id}"