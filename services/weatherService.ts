const API_KEY = 'df54082dcf3c023abcd270620aab275d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type WeatherData = {
    city: string;
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
}

export async function fetchWeather(city: String = 'Perth'): Promise<WeatherData> {
    const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
    if(!response.ok) throw new Error('Failed to fetch weather');
    const data = await response.json();
    return {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
    };
}

export function buildWeatherMessage(weather: WeatherData): string {
    const {city, temp, description, humidity, windSpeed} = weather;
    return '${city}: ${temp}°C, ${description}. Humidity ${humidity}%, wind ${windSpeed} km/h.';
}