from rest_framework import serializers
from .models import Client,Property,Vendor,WorkOrder,Assignment,Document,QAReview,Notification,Report
class S(serializers.ModelSerializer):
 class Meta: model=None; fields='__all__'
def make(model):
 return type(model.__name__+'Serializer',(serializers.ModelSerializer,),{'Meta':type('Meta',(),{'model':model,'fields':'__all__'})})
ClientSerializer=make(Client); PropertySerializer=make(Property); VendorSerializer=make(Vendor); WorkOrderSerializer=make(WorkOrder); AssignmentSerializer=make(Assignment); DocumentSerializer=make(Document); QAReviewSerializer=make(QAReview); NotificationSerializer=make(Notification); ReportSerializer=make(Report)

class WorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = '__all__'

    def validate(self, attrs):
        client = attrs.get('client', getattr(self.instance, 'client', None))
        property_record = attrs.get('property', getattr(self.instance, 'property', None))
        if client and property_record and property_record.client_id != client.id:
            raise serializers.ValidationError({'property': 'The selected property belongs to a different client.'})
        return attrs

class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = ['client', 'address', 'property_type', 'details', 'status', 'image']
