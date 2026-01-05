import requests
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class WeatherView(APIView):
    def get(self, request):
        city = request.query_params.get('city')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        api_key = os.getenv('OPENWEATHER_API_KEY')

        
        if city:
            current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={api_key}"
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={api_key}"
        elif lat and lon:
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={api_key}"
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={api_key}"
        else:
            return Response({"error": "City or coordinates required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            current_res = requests.get(current_url)
            forecast_res = requests.get(forecast_url)
            
            if current_res.status_code != 200:
                return Response({"error": current_res.json().get('message', 'City not found')}, status=current_res.status_code)
            
            return Response({
                "current": current_res.json(),
                "forecast": forecast_res.json()
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)