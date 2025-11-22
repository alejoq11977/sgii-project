from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Incapacity, IncapacityDocument, StatusHistory
from .serializers import IncapacitySerializer, IncapacityDocumentSerializer
from django.db.models import Count
from django.db import models

class IncapacityViewSet(viewsets.ModelViewSet):
    queryset = Incapacity.objects.all().order_by('-created_at')
    serializer_class = IncapacitySerializer

    def get_queryset(self):
        """
        Filtro de seguridad:
        - Si es RRHH o Jefe: Ve todas (o las de su equipo).
        - Si es Empleado: Solo ve las suyas.
        """
        user = self.request.user
        if user.role in ['RRHH', 'ADMIN', 'TREASURY']:
            return Incapacity.objects.all()
        return Incapacity.objects.filter(employee=user)

    def perform_create(self, serializer):
        # Asignar automáticamente el usuario logueado como empleado si no se especifica
        # (O validarlo si lo crea un jefe)
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """
        Endpoint para cambiar estado y guardar historial.
        POST /api/incapacities/{id}/change_status/
        Body: { "status": "TRANSCRIBED", "observation": "Radicado con número 123" }
        """
        incapacity = self.get_object()
        new_status = request.data.get('status')
        observation = request.data.get('observation', '')

        if new_status not in Incapacity.Status.values:
            return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Guardar Historial
        StatusHistory.objects.create(
            incapacity=incapacity,
            previous_status=incapacity.status,
            new_status=new_status,
            changed_by=request.user,
            observation=observation
        )

        # 2. Actualizar Incapacidad
        incapacity.status = new_status
        incapacity.save()

        return Response({'status': 'Estado actualizado', 'new_status': new_status})
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Retorna contadores para el Dashboard.
        GET /api/incapacities/dashboard_stats/
        """
        user = request.user
        queryset = self.get_queryset() # Usa el filtro de rol que ya definimos

        # 1. Contadores por estado
        stats = queryset.aggregate(
            total=Count('id'),
            pending=Count('id', filter=models.Q(status='REPORTED')),
            in_process=Count('id', filter=models.Q(status__in=['TRANSCRIBED', 'IN_PROCESS'])),
            paid=Count('id', filter=models.Q(status='PAID')),
            rejected=Count('id', filter=models.Q(status='REJECTED'))
        )

        # 2. Alertas de tiempo (Ejemplo: Llevan más de 2 días sin gestión)
        # (Esto lo podemos refinar luego)
        
        return Response(stats)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = IncapacityDocument.objects.all()
    serializer_class = IncapacityDocumentSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Lógica personalizada para subir archivos.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)