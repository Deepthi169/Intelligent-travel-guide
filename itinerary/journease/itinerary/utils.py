import os
import random
import webbrowser
from datetime import datetime

# ------------------ Constants ------------------
BUDGET_PREFERENCES = ["Low", "Medium", "High", "Luxury"]
DIETARY_PREFERENCES = ["Vegetarian", "Non-Vegetarian", "Both"]
TRAVEL_TYPES = [
    "Adventure", "Cultural", "Nature", "Religious", "Shopping", "Heritage",
    "Relaxation", "Wildlife", "Photography", "Food & Culinary", "Architecture",
    "Historical", "Beach", "Mountain", "Wellness", "Educational", "Festivals",
    "Nightlife", "Sports", "Local Experience"
]
VEHICLES = ["Car", "Bike", "Bus", "Train", "Flight", "Walking", "Boat", "Metro"]

# State -> Cities -> Places
STATE_CITY_PLACES = {
    "Karnataka": {
        "Bangalore": [
            {"name": "Lalbagh Botanical Garden", "image": "https://upload.wikimedia.org/wikipedia/commons/2/25/Lalbagh_Botanical_Garden.jpg"},
            {"name": "Cubbon Park", "image": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Cubbon_Park_Bangalore.jpg"},
            {"name": "Commercial Street", "image": "https://upload.wikimedia.org/wikipedia/commons/9/92/Commercial_Street_Bangalore.jpg"}
        ],
        "Mysore": [
            {"name": "Mysore Palace", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Mysore_Palace.jpg"},
            {"name": "Brindavan Gardens", "image": "https://upload.wikimedia.org/wikipedia/commons/2/22/Brindavan_Gardens.jpg"},
            {"name": "Devaraja Market", "image": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Devaraja_Market_Mysore.jpg"}
        ],
        "Coorg": [
            {"name": "Abbey Falls", "image": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Abbey_Falls_Coorg.jpg"},
            {"name": "Raja's Seat", "image": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Rajas_Seat_Coorg.jpg"},
            {"name": "Madikeri Fort", "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Madikeri_Fort.jpg"}
        ]
    },
    "Tamil Nadu": {
        "Ooty": [
            {"name": "Ooty Lake", "image": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Ooty_Lake.jpg"},
            {"name": "Botanical Gardens", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Ooty_Botanical_Gardens.jpg"},
            {"name": "Rose Garden", "image": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Ooty_Rose_Garden.jpg"}
        ],
        "Chennai": [
            {"name": "Marina Beach", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Marina_Beach_Chennai.jpg"},
            {"name": "Fort St. George", "image": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Fort_St_George_Chennai.jpg"},
            {"name": "Express Avenue Mall", "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Express_Avenue_Mall_Chennai.jpg"}
        ]
    },
    "Goa": {
        "North Goa": [
            {"name": "Baga Beach", "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/Baga_Beach.jpg"},
            {"name": "Fort Aguada", "image": "https://upload.wikimedia.org/wikipedia/commons/6/61/Fort_Aguada.jpg"},
            {"name": "Calangute Market", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Calangute_Market.jpg"}
        ]
    }
}

# Souvenirs with popular buying spots
SOUVENIRS = {
    "Bangalore": {"Local Handicraft": "Chickpet Market", "Keychain": "Commercial Street"},
    "Mysore": {"Silk Saree": "Devaraja Market", "Postcard": "Mysore Palace Gift Shop"},
    "Coorg": {"Coffee": "Madikeri Market", "Handicraft": "Abbey Falls souvenir shops"},
    "Ooty": {"Tea": "Ooty Market", "Chocolate": "Charing Cross Shops"},
    "Chennai": {"Spices": "T. Nagar Market", "Sweets": "Express Avenue Mall"}
}

DIETARY_MEALS = {
    "Vegetarian": ["Vegetable Curry", "Salad Bowl", "Paneer Dish", "Vegetable Sandwich", "Dosa", "Idli"],
    "Non-Vegetarian": ["Chicken Curry", "Fish Fry", "Egg Sandwich", "Mutton Stew", "Grilled Fish", "Chicken Biryani"],
    "Both": ["Mixed Platter", "Chicken & Veg Curry", "Paneer & Fish Dish"]
}

SAFETY_TIPS = {
    "Bangalore": ["Carry water during garden visits", "Avoid crowded streets at night", "Use safe transport options like cabs"],
    "Mysore": ["Watch your belongings in markets", "Wear comfortable shoes for palace tours", "Carry sunscreen for outdoor activities"],
    "Coorg": ["Carry raincoat during waterfalls visit", "Avoid venturing into dense forests alone", "Hire local guides for trekking"],
    "Ooty": ["Dress warmly in the morning", "Be careful on hilly roads", "Keep children close near lakes"],
    "Chennai": ["Avoid walking alone at night", "Use cabs for long distances", "Carry water during beach visits"],
    "North Goa": ["Avoid swimming in rough sea", "Keep valuables safe on beaches", "Follow local beach guidelines"]
}

# ------------------ Helper Functions ------------------
def save_itinerary(destination, itinerary_text):
    os.makedirs('itineraries', exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"itineraries/{destination.replace(' ','_')}_{timestamp}.txt"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(itinerary_text)
    return filename

def display_place_images(city):
    if not city in [c for state in STATE_CITY_PLACES.values() for c in state.keys()]:
        return
    print(f"\nDisplaying images of popular places in {city}...")
    for state_cities in STATE_CITY_PLACES.values():
        if city in state_cities:
            for place in state_cities[city]:
                print(f"- {place['name']}: {place['image']}")
                webbrowser.open(place['image'])

def choose_preferred_places(city):
    """Ask user to select preferred places after displaying images"""
    display_place_images(city)
    for state_cities in STATE_CITY_PLACES.values():
        if city in state_cities:
            places_list = state_cities[city]
            print("\nSelect preferred places to visit (comma-separated numbers):")
            for i, place in enumerate(places_list, 1):
                print(f"{i}. {place['name']}")
            selection = input("Enter your choices: ")
            preferred = []
            try:
                for i in selection.split(","):
                    idx = int(i.strip()) - 1
                    if 0 <= idx < len(places_list):
                        preferred.append(places_list[idx]["name"])
            except:
                pass
            return preferred
    return []

def suggest_souvenirs(city):
    if city in SOUVENIRS:
        print("\nSuggested souvenirs and popular buying spots:")
        for item, spot in SOUVENIRS[city].items():
            print(f"- {item} (Popular spot: {spot})")

def generate_daily_activities(day, travel_types, vehicles, preferred_places, dietary_preference, city):
    morning_activity = random.choice(travel_types + (preferred_places if preferred_places else []))
    afternoon_activity = random.choice(travel_types + (preferred_places if preferred_places else []))
    evening_activity = random.choice(travel_types + (preferred_places if preferred_places else []))
    location = random.choice(preferred_places) if preferred_places else "city center"
    vehicle = random.choice(vehicles) if vehicles else "local transport"
    breakfast = random.choice(DIETARY_MEALS[dietary_preference])
    lunch = random.choice(DIETARY_MEALS[dietary_preference])
    dinner = random.choice(DIETARY_MEALS[dietary_preference])
    souvenir = random.choice(list(SOUVENIRS.get(city, {"Souvenir": "Market"}).keys()))
    safety_tip = random.choice(SAFETY_TIPS.get(city, ["Follow general safety tips."]))

    day_text = f"""Day {day}:
- Breakfast: {breakfast} at hotel or local cafe
- Morning: {morning_activity} around {location} using {vehicle}
- Lunch: {lunch} at local restaurant
- Afternoon: {afternoon_activity} and explore local attractions
- Evening: {evening_activity}, free time for shopping or photography
- Dinner: {dinner} at recommended local cuisine
- Memory Suggestion: You may consider buying a '{souvenir}' (popular spot available in the city)
- Safety Tip: {safety_tip}
"""
    return day_text

def generate_itinerary_stub(city, days, travel_types, group_size, dietary_preference, budget_preference, preferred_places=None, vehicles=None):
    travel_types_str = ", ".join(travel_types)
    preferred_section = "Preferred Places: " + ", ".join(preferred_places) if preferred_places else ""
    vehicles_section = "Preferred Vehicles: " + ", ".join(vehicles) if vehicles else ""
    itinerary_text = f"""
==================== TRAVEL ITINERARY ====================
Destination: {city}
Duration: {days} days
Group Size: {group_size} persons
Travel Interests: {travel_types_str}
Dietary Preference: {dietary_preference}
Budget Level: {budget_preference}
{preferred_section}
{vehicles_section}
===========================================================

"""
    for day in range(1, days + 1):
        itinerary_text += generate_daily_activities(day, travel_types, vehicles, preferred_places, dietary_preference, city)
        itinerary_text += "----------------------------------------------------\n"
    itinerary_text += "==================== END OF ITINERARY ====================\n"
    return itinerary_text

def choose_option(prompt_text, options):
    print(f"\n{prompt_text}")
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")
    selection = input("Enter numbers separated by commas (e.g., 1,3): ")
    selected_options = []
    try:
        for i in selection.split(","):
            idx = int(i.strip()) - 1
            if 0 <= idx < len(options):
                selected_options.append(options[idx])
    except:
        pass
    return selected_options

# ------------------ Main Function ------------------
def main():
    print("=== AI Travel Planner ===")
    
    # Select state first
    states = list(STATE_CITY_PLACES.keys())
    state_choice = choose_option("Select your state:", states)
    state = state_choice[0] if state_choice else states[0]

    # Select city within state
    cities = list(STATE_CITY_PLACES[state].keys())
    city_choice = choose_option(f"Select your city in {state}:", cities)
    city = city_choice[0] if city_choice else cities[0]

    days = int(input("Enter number of days for the trip: "))
    group_size = int(input("Enter group size: "))

    travel_types = choose_option("Select travel types you are interested in:", TRAVEL_TYPES)
    dietary_preference = choose_option("Select dietary preference:", DIETARY_PREFERENCES)
    dietary_preference = dietary_preference[0] if dietary_preference else "Both"
    budget_preference = choose_option("Select budget level:", BUDGET_PREFERENCES)
    budget_preference = budget_preference[0] if budget_preference else "Medium"
    vehicles = choose_option("Select preferred vehicles/modes of travel:", VEHICLES)

    preferred_places = choose_preferred_places(city)
    suggest_souvenirs(city)

    itinerary_text = generate_itinerary_stub(city, days, travel_types, group_size,
                                             dietary_preference, budget_preference, preferred_places, vehicles)
    print("\n=== Generated Itinerary ===\n")
    print(itinerary_text)

    saved_file = save_itinerary(city, itinerary_text)
    print(f"\nItinerary saved to: {saved_file}")

if __name__ == "__main__":
    main()
