from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserDetail, User
from .serializers import UserSerializer

class UsersView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user_details = UserDetail.objects.filter(user=request.user.pk).first()
        request.user.details = user_details
        content = {
            'user': str(request.user),  # `django.contrib.auth.User` instance.
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'auth': str(request.auth),  # None
        }
        data = UserSerializer(request.user)
        return Response(data.data)


class RegisterUser(APIView):
  def post(self, request, format=None):
    user = User.objects.create_user(
      username=request.data['username'],
      password=request.data['password'],
      first_name=request.data['first_name'],
      last_name=request.data['last_name'],
    )
    user.save()
    user_details = UserDetail.objects.create(
      user=user,
      gender=request.data['gender'],
      date_of_birth=request.data['date_of_birth'],
    )
    user_details.save()

    return Response(status=201)