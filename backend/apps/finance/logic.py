from decimal import Decimal

def calculate_expected_payment(incapacity):
    """
    Calcula cuánto DEBERÍA pagar la EPS según los días y el IBC.
    Regla: 
    - Días 1-2: EPS paga 0.
    - Días 3-90: EPS paga 66.67%.
    - Días 91-180: EPS paga 50%.
    """
    ibc_day = incapacity.ibc_value / 30 # Valor día
    total_days = incapacity.days
    expected_total = Decimal(0)

    # Si la incapacidad es de origen laboral (ARL), pagan el 100% desde el día 1
    if incapacity.incapacity_type == 'AL': 
        return ibc_day * total_days

    # Lógica para Enfermedad General (EPS)
    for day in range(1, total_days + 1):
        if day <= 2:
            # Asume la empresa
            pass 
        elif day <= 90:
            # Paga el 66.67%
            expected_total += ibc_day * Decimal('0.6667')
        elif day <= 180:
            # Paga el 50%
            expected_total += ibc_day * Decimal('0.5')
        # Más de 180 días entra a fondo de pensiones (otra lógica)
            
    return round(expected_total, 2)