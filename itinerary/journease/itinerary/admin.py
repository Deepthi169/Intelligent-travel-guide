from django.contrib import admin
from .models import Landmark

# If Landmark had a related model, you could create an Inline
# For demonstration, let's assume LandmarkDetails is related (optional)
# from .models import LandmarkDetails

# class LandmarkDetailsInline(admin.StackedInline):
#     model = LandmarkDetails
#     can_delete = False
#     verbose_name_plural = 'Landmark Details'

# Define a new Landmark admin
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')
    search_fields = ('name', 'location')
    # inlines = (LandmarkDetailsInline,)  # uncomment if you have related model

# Register Landmark
admin.site.register(Landmark, LandmarkAdmin)
