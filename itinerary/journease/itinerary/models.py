from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)

class ItineraryRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.CharField(max_length=100)
    days = models.IntegerField()
    travel_types = models.JSONField()
    budget = models.CharField(max_length=10)
    dietary_preference = models.CharField(max_length=20)
    group_size = models.IntegerField()
    preferred_places = models.JSONField(blank=True, null=True)
    itinerary_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
