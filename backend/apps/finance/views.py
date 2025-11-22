from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Payment
from .serializers import PaymentSerializer
from .logic import calculate_expected_payment
from apps.incapacities.models import Incapacity, StatusHistory # <--- Importamos para historial

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        if request.user.role == 'EMPLOYEE':
            raise PermissionDenied("No tiene permisos para registrar pagos financieros.")
        
        """
        Sobreescribimos el método de crear pago para agregar la lógica automática.
        """
        # 1. Crear el pago normalmente
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # 2. Obtener la instancia del pago recién creado
        payment_instance = serializer.instance
        incapacity = payment_instance.incapacity
        
        # 3. Calcular si ya se pagó todo
        expected = calculate_expected_payment(incapacity)
        total_paid = sum(p.amount_paid for p in incapacity.payments.all())
        
        # 4. Lógica de Cambio Automático
        # Si lo pagado es mayor o igual a lo esperado (y no estaba ya cerrada)
        if total_paid >= expected and incapacity.status != Incapacity.Status.PAID:
            
            previous_status = incapacity.status
            
            # Actualizar estado
            incapacity.status = Incapacity.Status.PAID
            incapacity.save()
            
            # Dejar rastro en el historial (Trazabilidad automática)
            StatusHistory.objects.create(
                incapacity=incapacity,
                previous_status=previous_status,
                new_status=Incapacity.Status.PAID,
                changed_by=request.user, # El usuario de tesorería que hizo el pago
                observation=f"Cierre automático: Saldo cubierto (${total_paid} de ${expected})"
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'], url_path='reconciliation/(?P<incapacity_id>[^/.]+)')
    def get_reconciliation(self, request, incapacity_id=None):
        # ... (Este método déjalo igual que antes) ...
        try:
            incapacity = Incapacity.objects.get(id=incapacity_id)
            expected = calculate_expected_payment(incapacity)
            total_paid = sum(p.amount_paid for p in incapacity.payments.all())
            balance = expected - total_paid
            
            return Response({
                'expected_amount': expected,
                'paid_amount': total_paid,
                'balance': balance,
                'status': 'PAID_OFF' if balance <= 0 else 'PENDING'
            })
        except Incapacity.DoesNotExist:
            return Response({'error': 'Incapacidad no encontrada'}, status=404)