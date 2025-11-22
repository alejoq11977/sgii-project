import api from './axios';

export const getIncapacities = async () => {
    const response = await api.get('incapacities/');
    return response.data;
};

export const createIncapacity = async (data) => {
    // Paso 1: Crear la incapacidad (Datos texto)
    const response = await api.post('incapacities/', data);
    return response.data;
};

export const uploadDocument = async (incapacityId, file, type) => {
    // Paso 2: Subir archivos (Multipart)
    const formData = new FormData();
    formData.append('incapacity', incapacityId);
    formData.append('file', file);
    formData.append('document_type', type); // Ej: 'CERT', 'EPI'

    const response = await api.post('documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};


export const getIncapacityById = async (id) => {
    const response = await api.get(`incapacities/${id}/`);
    return response.data;
};

export const updateIncapacityStatus = async (id, status, observation) => {
    const response = await api.post(`incapacities/${id}/change_status/`, {
        status,
        observation
    });
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get('incapacities/dashboard_stats/');
    return response.data;
};