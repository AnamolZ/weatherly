from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch

class WeatherViewTests(TestCase):
    def setUp(self):
        self.url = reverse('weather')

    @patch('requests.get')
    def test_get_weather_by_city_success(self, mock_get):
        # Mocking the response for current weather
        mock_get.side_effect = [
            type('Response', (object,), {'status_code': 200, 'json': lambda: {'name': 'Kathmandu', 'main': {'temp': 20}, 'weather': [{'description': 'clear sky'}], 'sys': {'country': 'NP'}, 'wind': {'speed': 5}}}),
            type('Response', (object,), {'status_code': 200, 'json': lambda: {'list': [{'dt_txt': '2026-01-05 12:00:00', 'main': {'temp': 18}, 'weather': [{'description': 'clear sky'}], 'main': {'humidity': 50}}]}})
        ]

        response = self.client.get(self.url, {'city': 'Kathmandu'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('current', response.data)
        self.assertIn('forecast', response.data)
        self.assertEqual(response.data['current']['name'], 'Kathmandu')

    @patch('requests.get')
    def test_get_weather_by_coords_success(self, mock_get):
        mock_get.side_effect = [
            type('Response', (object,), {'status_code': 200, 'json': lambda: {'name': 'Kathmandu', 'main': {'temp': 20}, 'weather': [{'description': 'clear sky'}], 'sys': {'country': 'NP'}, 'wind': {'speed': 5}}}),
            type('Response', (object,), {'status_code': 200, 'json': lambda: {'list': []}})
        ]

        response = self.client.get(self.url, {'lat': '27.7172', 'lon': '85.3240'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current']['name'], 'Kathmandu')

    def test_get_weather_missing_params(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'City or coordinates required')

    @patch('requests.get')
    def test_get_weather_city_not_found(self, mock_get):
        mock_get.return_value = type('Response', (object,), {'status_code': 404, 'json': lambda: {'message': 'city not found'}})

        response = self.client.get(self.url, {'city': 'NonExistentCity'})
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'city not found')
