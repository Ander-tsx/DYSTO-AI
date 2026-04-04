from django.urls import path
from .views import ImageUploadTestView

urlpatterns = [
    path("upload-test/", ImageUploadTestView.as_view(), name="upload_test"),
]