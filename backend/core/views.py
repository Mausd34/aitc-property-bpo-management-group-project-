from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.deletion import ProtectedError
from django.utils import timezone
from .models import *
from .serializers import *
from .auth_serializers import RegisterSerializer, UserProfileSerializer


class ProtectedDeleteViewSet(viewsets.ModelViewSet):
 def destroy(self, request, *args, **kwargs):
  instance = self.get_object()
  try:
   self.perform_destroy(instance)
  except ProtectedError:
   return Response({'detail': 'This record is still linked to other records and cannot be deleted.'}, status=status.HTTP_409_CONFLICT)
  return Response(status=status.HTTP_204_NO_CONTENT)

class ClientViewSet(ProtectedDeleteViewSet):
 queryset=Client.objects.all().order_by('-id'); serializer_class=ClientSerializer
 def create(self, request, *args, **kwargs):
    data=request.data
    existing=Client.objects.filter(name__iexact=str(data.get('name','')).strip(), email__iexact=str(data.get('email','')).strip(), phone=str(data.get('phone','')).strip(), address__iexact=str(data.get('address','')).strip()).first()
    if existing: return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)

class PropertyViewSet(ProtectedDeleteViewSet):
    queryset=Property.objects.all().order_by('-id'); serializer_class=PropertySerializer
    def get_serializer_class(self):
        return PropertyCreateSerializer if self.action in ['create', 'update', 'partial_update'] else PropertySerializer
    def create(self, request, *args, **kwargs):
        client_id=request.data.get('client'); address=str(request.data.get('address','')).strip()
        existing=Property.objects.filter(client_id=client_id, address__iexact=address).first()
        if existing: return Response(PropertySerializer(existing).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)

class VendorViewSet(ProtectedDeleteViewSet):
 queryset=Vendor.objects.all().order_by('-id'); serializer_class=VendorSerializer
 def create(self, request, *args, **kwargs):
    data=request.data
    existing=Vendor.objects.filter(name__iexact=str(data.get('name','')).strip(), email__iexact=str(data.get('email','')).strip(), phone=str(data.get('phone','')).strip(), service_area__iexact=str(data.get('service_area','')).strip()).first()
    if existing: return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)

class WorkOrderViewSet(viewsets.ModelViewSet): queryset=WorkOrder.objects.all().order_by('-id'); serializer_class=WorkOrderSerializer
class AssignmentViewSet(viewsets.ModelViewSet):
 queryset=Assignment.objects.all().order_by('-id'); serializer_class=AssignmentSerializer
 def create(self, request, *args, **kwargs):
    existing=Assignment.objects.filter(work_order_id=request.data.get('work_order'), vendor_id=request.data.get('vendor')).first()
    if existing: return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
    return super().create(request, *args, **kwargs)
class DocumentViewSet(viewsets.ModelViewSet): queryset=Document.objects.all().order_by('-id'); serializer_class=DocumentSerializer
class QAReviewViewSet(viewsets.ModelViewSet): queryset=QAReview.objects.all().order_by('-id'); serializer_class=QAReviewSerializer
class NotificationViewSet(viewsets.ModelViewSet): queryset=Notification.objects.all().order_by('-id'); serializer_class=NotificationSerializer
class ReportViewSet(viewsets.ModelViewSet): queryset=Report.objects.all().order_by('-id'); serializer_class=ReportSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer=RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user=serializer.save()
    return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserProfileSerializer(request.user).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users(request):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'detail':'Manager or Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
    return Response(UserProfileSerializer(User.objects.all().order_by('username'), many=True).data)

@api_view(['GET'])
def dashboard(request):
 total_orders=WorkOrder.objects.count()
 completed_orders=WorkOrder.objects.filter(status__in=['Completed','Approved','Closed']).count()
 completion_rate=round((completed_orders / total_orders) * 100) if total_orders else 0
 overdue_orders=WorkOrder.objects.filter(due_date__lt=timezone.localdate()).exclude(status__in=['Completed','Approved','Closed']).count()
 return Response({'clients':Client.objects.count(),'properties':Property.objects.count(),'active_properties':Property.objects.filter(status='Active').count(),'vendors':Vendor.objects.count(),'work_orders':total_orders,'completed_work_orders':completed_orders,'completion_rate':completion_rate,'overdue_work_orders':overdue_orders,'qa_reviews':QAReview.objects.count(),'pending_qa_reviews':QAReview.objects.filter(status='Pending').count(),'documents':Document.objects.count(),'reports':Report.objects.count(),'unread_notifications':Notification.objects.filter(is_read=False).count(),'work_order_status':list(WorkOrder.objects.values('status').annotate(total=Count('id'))),'top_clients':list(Client.objects.annotate(order_count=Count('work_orders')).order_by('-order_count','name').values('id','name','order_count')[:3]),'top_vendors':list(Vendor.objects.annotate(assignment_count=Count('assignments')).order_by('-assignment_count','name').values('id','name','assignment_count')[:3])})
