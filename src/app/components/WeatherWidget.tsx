interface WeatherResponse {
  current?: {
    time?: string;
    temperature_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    weather_code?: number;
  };
  current_units?: {
    temperature_2m?: string;
    wind_speed_10m?: string;
    wind_direction_10m?: string;
  };
}

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const formatWindDirection = (degrees?: number, unit?: string) => {
  if (degrees === undefined) return "--";

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
  const suffix = unit ?? "°";
  return `${directions[index]} (${Math.round(degrees)}${suffix})`;
};

const fetchCurrentWeather = async (): Promise<{
  current?: WeatherResponse["current"];
  units?: WeatherResponse["current_units"];
}> => {
  const latitude = 40.7128; // New York City
  const longitude = -74.006;
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m";

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = (await response.json()) as WeatherResponse;
  return {
    current: data.current,
    units: data.current_units,
  };
};

export default async function WeatherWidget() {
  try {
    const weather = await fetchCurrentWeather();
    const { current, units } = weather;

    if (!current) {
      throw new Error("Weather data unavailable");
    }

    const temperatureUnit = units?.temperature_2m ?? "°C";
    const windSpeedUnit = units?.wind_speed_10m ?? "km/h";
    const windDirectionUnit = units?.wind_direction_10m ?? "°";

    const description =
      WEATHER_CODE_DESCRIPTIONS[current.weather_code ?? -1] ?? "Unknown conditions";

    return (
      <section className="rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/70">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Current weather</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">New York City</h2>
          </div>
          <span className="text-4xl font-semibold text-sky-500">
            {Math.round(current.temperature_2m ?? 0)}
            {temperatureUnit.replace("\u00b0", "°")}
          </span>
        </header>
        <dl className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-3">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400">
              Conditions
            </dt>
            <dd className="text-base font-medium">{description}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400">
              Wind speed
            </dt>
            <dd>
              {Math.round(current.wind_speed_10m ?? 0)} {windSpeedUnit}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-xs text-slate-500 dark:text-slate-400">
              Wind direction
            </dt>
            <dd>{formatWindDirection(current.wind_direction_10m, windDirectionUnit)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Powered by <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>.
        </p>
      </section>
    );
  } catch (error) {
    console.error(error);
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <h2 className="text-lg font-semibold">Weather unavailable</h2>
        <p className="mt-2 text-sm">
          We couldn&apos;t load the current weather right now. Please try again later.
        </p>
      </section>
    );
  }
}
