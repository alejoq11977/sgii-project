import api from './axios';

// Obtener el resumen (Esperado vs Pagado)
export const getReconciliation = async (incapacityId) => {
    const response = await api.get(`finance/reconciliation/${incapacityId}/`);
    return response.data;
};

// Registrar un nuevo pago
export const registerPayment = async (paymentData) => {
    const response = await api.post('finance/', paymentData);
    return response.data;
};