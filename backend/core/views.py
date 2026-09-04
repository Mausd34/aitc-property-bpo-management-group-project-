from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import *
from .serializers import *
class ClientViewSet(viewsets.ModelViewSet):
 queryset=Client.objects.all().order_by('-id'); serializer_class=ClientSerializer
 def create(self, request, *args, **kwargs):
    data=request.data
    existing=Client.objects.filter(name__iexact=str(data.get('name','')).strip(), email__iexact=str(data.get('email','')).strip(), phone=str(data.get('phone','')).strip(), address__iexact=str(data.get('address','')).strip()).first()
    if existing:
     return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)
class PropertyViewSet(viewsets.ModelViewSet): 
    queryset=Property.objects.all().order_by('-id'); 
    serializer_class=PropertySerializer;
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PropertyCreateSerializer
        return PropertySerializer
    def create(self, request, *args, **kwargs):
        client_id = request.data.get('client')
        address = str(request.data.get('address', '')).strip()
        existing = Property.objects.filter(client_id=client_id, address__iexact=address).first()
        if existing:
            return Response(PropertySerializer(existing).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)
class VendorViewSet(viewsets.ModelViewSet):
 queryset=Vendor.objects.all().order_by('-id'); serializer_class=VendorSerializer
 def create(self, request, *args, **kwargs):
    data=request.data
    existing=Vendor.objects.filter(name__iexact=str(data.get('name','')).strip(), email__iexact=str(data.get('email','')).strip(), phone=str(data.get('phone','')).strip(), service_area__iexact=str(data.get('service_area','')).strip()).first()
    if existing:
     return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)
class WorkOrderViewSet(viewsets.ModelViewSet): queryset=WorkOrder.objects.all().order_by('-id'); serializer_class=WorkOrderSerializer
class AssignmentViewSet(viewsets.ModelViewSet):
 queryset=Assignment.objects.all().order_by('-id'); serializer_class=AssignmentSerializer
 def create(self, request, *args, **kwargs):
    existing=Assignment.objects.filter(work_order_id=request.data.get('work_order'), vendor_id=request.data.get('vendor')).first()
    if existing:
     serializer=self.get_serializer(existing)
     return Response(serializer.data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)
class DocumentViewSet(viewsets.ModelViewSet): queryset=Document.objects.all().order_by('-id'); serializer_class=DocumentSerializer
class QAReviewViewSet(viewsets.ModelViewSet): queryset=QAReview.objects.all().order_by('-id'); serializer_class=QAReviewSerializer
class NotificationViewSet(viewsets.ModelViewSet): queryset=Notification.objects.all().order_by('-id'); serializer_class=NotificationSerializer
class ReportViewSet(viewsets.ModelViewSet): queryset=Report.objects.all().order_by('-id'); serializer_class=ReportSerializer
@api_view(['GET'])
def dashboard(request):
 return Response({'clients':Client.objects.count(),'properties':Property.objects.count(),'active_properties':Property.objects.filter(status='Active').count(),'vendors':Vendor.objects.count(),'work_orders':WorkOrder.objects.count(),'qa_reviews':QAReview.objects.count(),'documents':Document.objects.count(),'reports':Report.objects.count(),'unread_notifications':Notification.objects.filter(is_read=False).count(),'work_order_status':list(WorkOrder.objects.values('status').annotate(total=Count('id')))})
