//NOTE: api key should be a .env file in production
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

export type HistoricalDay = {
  date: string;
  timeLabel: string;
  description: string;
};


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
    return `${city}: ${temp}°C, ${description}. Humidity ${humidity}%, wind ${windSpeed} km/h.`;
}

const WMO_CODES: Record<number, string> = {
  0:  'Clear sky',
  1:  'Mainly clear',
  2:  'Partly cloudy',
  3:  'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Moderate showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  99: 'Thunderstorm with hail',
};

function wmoToDescription(code: number): string {
  return WMO_CODES[code] ?? `Weather code ${code}`;
}
 
function daysAgoLabel(daysAgo: number): string {
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo} days ago`;
}
 
export async function fetchPastWeek(
  latitude: number = -31.9505,
  longitude: number = 115.8605
): Promise<HistoricalDay[]> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode&past_days=7&forecast_days=0&timezone=auto`
  );
  if (!res.ok) throw new Error('Failed to fetch historical weather');
  const data = await res.json();
   
  const dates: string[] = data.daily.time.slice(0, -1).reverse();
  const codes: number[] = data.daily.weathercode.slice(0, -1).reverse();
 
  return dates.map((date, i) => ({
    date,
    timeLabel: daysAgoLabel(i + 1),
    description: wmoToDescription(codes[i]),
  }));
}
