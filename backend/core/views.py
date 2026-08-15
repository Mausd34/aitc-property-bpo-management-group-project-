from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
from .models import *
from .serializers import *
class ClientViewSet(viewsets.ModelViewSet): queryset=Client.objects.all().order_by('-id'); serializer_class=ClientSerializer
class PropertyViewSet(viewsets.ModelViewSet): queryset=Property.objects.all().order_by('-id'); serializer_class=PropertySerializer
class VendorViewSet(viewsets.ModelViewSet): queryset=Vendor.objects.all().order_by('-id'); serializer_class=VendorSerializer
class WorkOrderViewSet(viewsets.ModelViewSet): queryset=WorkOrder.objects.all().order_by('-id'); serializer_class=WorkOrderSerializer
class AssignmentViewSet(viewsets.ModelViewSet): queryset=Assignment.objects.all().order_by('-id'); serializer_class=AssignmentSerializer
class DocumentViewSet(viewsets.ModelViewSet): queryset=Document.objects.all().order_by('-id'); serializer_class=DocumentSerializer
class QAReviewViewSet(viewsets.ModelViewSet): queryset=QAReview.objects.all().order_by('-id'); serializer_class=QAReviewSerializer
class NotificationViewSet(viewsets.ModelViewSet): queryset=Notification.objects.all().order_by('-id'); serializer_class=NotificationSerializer
class ReportViewSet(viewsets.ModelViewSet): queryset=Report.objects.all().order_by('-id'); serializer_class=ReportSerializer
@api_view(['GET'])
def dashboard(request):
 return Response({'clients':Client.objects.count(),'properties':Property.objects.count(),'vendors':Vendor.objects.count(),'work_orders':WorkOrder.objects.count(),'qa_reviews':QAReview.objects.count(),'documents':Document.objects.count(),'unread_notifications':Notification.objects.filter(is_read=False).count(),'work_order_status':list(WorkOrder.objects.values('status').annotate(total=Count('id')))})
