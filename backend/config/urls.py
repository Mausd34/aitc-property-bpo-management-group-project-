from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

@api_view(['GET'])
def root_view(request):
    return Response({'message':'AITC Property Preservation & BPO Management System','version':'1.1.0','endpoints':{'admin':'/admin/','api':'/api/','login':'/api/auth/login/','refresh':'/api/auth/refresh/','register':'/api/auth/register/','me':'/api/auth/me/','users':'/api/auth/users/','dashboard':'/api/dashboard/','clients':'/api/clients/','properties':'/api/properties/','vendors':'/api/vendors/','work_orders':'/api/work-orders/','assignments':'/api/assignments/','documents':'/api/documents/','qa_reviews':'/api/qa-reviews/','notifications':'/api/notifications/','reports':'/api/reports/'}})

urlpatterns=[path('',root_view),path('admin/',admin.site.urls),path('api/',include('core.urls')),path('api/auth/login/',TokenObtainPairView.as_view(),name='token_obtain_pair'),path('api/auth/refresh/',TokenRefreshView.as_view(),name='token_refresh')]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
