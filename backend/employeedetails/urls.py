from django.urls import path
from .views import create_employeedetail,employeedetails, employeeeach, update_employee,delete_employee
urlpatterns = [
    path('employeedetails/', create_employeedetail, name='create-employeedetail'),
    path('employee',employeedetails,name='employee'),
    path('api/employee/<int:id>/', employeeeach, name='employee-detail'),
     path('update/<int:id>/', update_employee, name='update-employee'),
     path('delete/<int:id>/', delete_employee, name='delete_employee'),
]
