from rest_framework import serializers
from .models import Employeedetails


class EmployeedetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employeedetails  
        fields = '__all__'