from rest_framework import serializers
from .models import Payment
from apps.incapacities.models import Incapacity

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

    def validate(self, data):
        """
        Validaciones de negocio para pagos.
        """
        incapacity = data['incapacity']
        
        # 1. Bloquear si está Rechazada
        if incapacity.status == Incapacity.Status.REJECTED:
            raise serializers.ValidationError(
                "Operación bloqueada: No se pueden registrar pagos a una incapacidad en estado RECHAZADA."
            )

        # 2. Bloquear si está recién Reportada 
        if incapacity.status == Incapacity.Status.REPORTED:
            raise serializers.ValidationError(
                "Operación bloqueada: La incapacidad sigue en estado REPORTADA. Debe ser Transcrita o Autorizada por RRHH antes de registrar pagos."
            )

        return data