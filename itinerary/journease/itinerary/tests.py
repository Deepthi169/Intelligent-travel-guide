from django.test import TestCase
from .models import Landmark

class LandmarkTest(TestCase):
    def setUp(self):
        Landmark.objects.create(name="Baga Beach", description="Popular beach", location="North Goa")

    def test_landmark_name(self):
        landmark = Landmark.objects.get(name="Baga Beach")
        self.assertEqual(landmark.name, "Baga Beach")
