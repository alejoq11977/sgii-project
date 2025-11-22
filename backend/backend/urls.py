from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.users.views import MyTokenObtainPairView 
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from apps.incapacities.views import IncapacityViewSet, DocumentViewSet
from apps.finance.views import PaymentViewSet

# Router principal de la API
router = DefaultRouter()
router.register(r'incapacities', IncapacityViewSet, basename='incapacity')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'finance', PaymentViewSet, basename='finance')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas de Autenticación (Login)
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas de la API del negocio
    path('api/', include(router.urls)),
]

# Configuración para servir archivos subidos (PDFs/Imágenes) en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)