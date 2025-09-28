from django.urls import path
from . import views

urlpatterns = [
    path('goa/', views.goa_tour, name='goa_tour'),
]
