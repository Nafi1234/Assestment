from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import EmployeedetailsSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Employeedetails


@api_view(['POST']) 
def create_employeedetail(request):
    parser_classes = [MultiPartParser]
    print("hello")
    print(f"Request Data: {request.data}, Type: {type(request.data)}")

    print(f"Request Data: {request.data}, Type: {type(request.data)}")

    serializer = EmployeedetailsSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print("seee",serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def employeedetails(request):
    employee=Employeedetails.objects.all()
    serializer=EmployeedetailsSerializer(employee,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def employeeeach(request, id):
    try:
        employee = Employeedetails.objects.get(id=id)
    except Employeedetails.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    serializer = EmployeedetailsSerializer(employee)
    return Response(serializer.data)

@api_view(['PUT'])
def update_employee(request, id):
    try:
        print(request.data)
        employee = Employeedetails.objects.get(id=id)  
    except Employeedetails.DoesNotExist:
        return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = EmployeedetailsSerializer(employee, data=request.data, partial=True)  

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_employee(request, id):
    try:
    
        employee = Employeedetails.objects.get(id=id)
        employee.delete()
        return Response({'message': 'Employee deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except Employeedetails.DoesNotExist:
        return Response({'error': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)