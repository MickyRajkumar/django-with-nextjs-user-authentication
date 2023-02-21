from django.db import models
from django.contrib.auth.models import User


class UserDetail (models.Model):
    gender= models.CharField(max_length=30)
    date_of_birth = models.DateField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.user.get_username()