from django import forms

TRAVEL_TYPES = ["Adventure", "Cultural", "Nature", "Religious", "Shopping", "Wellness", "Wildlife"]

class ItineraryForm(forms.Form):
    destination = forms.CharField(max_length=100)
    days = forms.IntegerField(min_value=1)
    travel_types = forms.MultipleChoiceField(
        choices=[(t, t) for t in TRAVEL_TYPES],
        widget=forms.CheckboxSelectMultiple
    )
    budget = forms.ChoiceField(choices=[("Low","Low"),("Medium","Medium"),("High","High"),("Luxury","Luxury")])
    dietary_preference = forms.ChoiceField(choices=[("Vegetarian","Vegetarian"),("Non-Vegetarian","Non-Vegetarian"),("Both","Both")])
    group_size = forms.IntegerField(min_value=1)
    preferred_places = forms.CharField(required=False)
    
    # New creative options
    accommodation = forms.ChoiceField(
        choices=[("Hotel","Hotel"),("Hostel","Hostel"),("Homestay","Homestay"),("Resort","Resort")],
        required=False
    )
    transport = forms.MultipleChoiceField(
        choices=[("Car","Car"),("Bus","Bus"),("Train","Train"),("Flight","Flight")],
        required=False, widget=forms.CheckboxSelectMultiple
    )
    experience_level = forms.ChoiceField(
        choices=[("Mild","Mild"),("Moderate","Moderate"),("Extreme","Extreme")],
        required=False
    )
    include_festivals = forms.BooleanField(required=False)
    weather_pref = forms.CharField(required=False)
    photography_spots = forms.BooleanField(required=False)
    local_cuisine = forms.BooleanField(required=False)
    night_activities = forms.BooleanField(required=False)
    eco_friendly = forms.BooleanField(required=False)
