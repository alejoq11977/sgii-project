from rest_framework import serializers
from .models import Incapacity, IncapacityDocument, StatusHistory


class StatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = StatusHistory
        fields = ['id', 'previous_status', 'new_status', 'changed_by_name', 'change_date', 'observation']


class IncapacityDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncapacityDocument
        fields = ['id', 'incapacity', 'document_type', 'file', 'uploaded_at', 'is_approved']
        read_only_fields = ['uploaded_at', 'is_approved']

class IncapacitySerializer(serializers.ModelSerializer):
    # Incluimos los documentos anidados para verlos al consultar una incapacidad
    documents = IncapacityDocumentSerializer(many=True, read_only=True)
    history = StatusHistorySerializer(source='statushistory_set', many=True, read_only=True)
    employee_name = serializers.SerializerMethodField() 

    class Meta:
        model = Incapacity
        fields = [
            'id', 'employee', 'employee_name', 'incapacity_type', 
            'diagnosis_code', 'start_date', 'end_date', 'days', 
            'entity_name', 'status', 'documents', 'history', 'created_at', 'ibc_value'
        ]
        read_only_fields = ['status', 'created_at', 'employee']

    def get_employee_name(self, obj):
        # 1. Intentar obtener nombre completo
        full_name = obj.employee.get_full_name()
        # 2. Si tiene nombre, retornarlo
        if full_name and full_name.strip():
            return full_name
        # 3. Si no, retornar el usuario (ej: "admin")
        return obj.employee.username
    
    def validate(self, data):
        """Validación de negocio: Fecha fin no puede ser menor a fecha inicio"""
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("La fecha final no puede ser anterior a la inicial.")
        return data
    
