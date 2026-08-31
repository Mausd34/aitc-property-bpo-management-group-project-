from rest_framework import serializers
from .models import Client,Property,Vendor,WorkOrder,Assignment,Document,QAReview,Notification,Report
class S(serializers.ModelSerializer):
 class Meta: model=None; fields='__all__'
def make(model):
 return type(model.__name__+'Serializer',(serializers.ModelSerializer,),{'Meta':type('Meta',(),{'model':model,'fields':'__all__'})})
ClientSerializer=make(Client); PropertySerializer=make(Property); VendorSerializer=make(Vendor); WorkOrderSerializer=make(WorkOrder); AssignmentSerializer=make(Assignment); DocumentSerializer=make(Document); QAReviewSerializer=make(QAReview); NotificationSerializer=make(Notification); ReportSerializer=make(Report)

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['client', 'address', 'property_type', 'details', 'status', 'image']
