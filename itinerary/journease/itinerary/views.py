from django.shortcuts import render
from .forms import ItineraryForm
from .utils import generate_itinerary_advanced, save_itinerary

def generate_itinerary_view(request):
    if request.method == 'POST':
        form = ItineraryForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            itinerary_text = generate_itinerary_advanced(
                destination=data['destination'],
                days=data['days'],
                travel_types=data['travel_types'],
                group_size=data['group_size'],
                dietary_preference=data['dietary_preference'],
                budget_preference=data['budget'],
                preferred_places=data.get('preferred_places'),
                accommodation=data.get('accommodation'),
                transport=data.get('transport'),
                experience_level=data.get('experience_level'),
                include_festivals=data.get('include_festivals'),
                weather_pref=data.get('weather_pref'),
                photography_spots=data.get('photography_spots'),
                local_cuisine=data.get('local_cuisine'),
                night_activities=data.get('night_activities'),
                eco_friendly=data.get('eco_friendly')
            )
            
            filename = save_itinerary(data['destination'], itinerary_text)
            
            return render(request, 'itinerary/result.html', {
                'itinerary': itinerary_text,
                'filename': filename
            })
    else:
        form = ItineraryForm()
    return render(request, 'itinerary/form.html', {'form': form})
