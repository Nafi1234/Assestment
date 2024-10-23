from django.db import models


class Employeedetails(models.Model):
    fullName=models.CharField(max_length=20)
    email=models.EmailField()
    contactNumber=models.CharField(max_length=10)
    department=models.CharField(max_length=10)
    designation=models.CharField(max_length=10)
    dob= models.DateField()
    profilePicture = models.ImageField(upload_to='profile_pictures/') 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.fullname 