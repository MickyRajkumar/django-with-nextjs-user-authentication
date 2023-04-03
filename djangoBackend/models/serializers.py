from rest_framework import serializers
from .models import UserDetail, User

class UserDetailsSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserDetail
    fields = ('gender', 'date_of_birth')

class UserSerializer(serializers.ModelSerializer):
  details = UserDetailsSerializer()

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'first_name', 'last_name', 'details')