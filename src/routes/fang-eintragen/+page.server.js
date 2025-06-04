import { addCatch, getAllFischartenNamen, getUniqueLakeIds } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit'; //error Nachricht

// Helferfunktion, weil Open-Meteo YYYY-MM-DD erwartet
function formatDateForAPI(dateString) {
    const date = new Date(dateString); //Datumsobjekt aus Input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); //Monate 0-11 => +1, 0 wird bei einstelligen Monaten hinzugefügt
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; //Open-Meteo
}


export async function load() {
  console.log('[fang-eintragen/+page.server.js] Load function called to get form options.');
  try {
    const [allFishNames, uniqueLakes] = await Promise.all([  //weil 2 async Funktionen gecallt werden, Promise, wartet auf alle Daten
      getAllFischartenNamen(),
      getUniqueLakeIds() 
    ]);
    
    console.log(`[fang-eintragen/+page.server.js] Fetched ${allFishNames?.length} fish names and ${uniqueLakes?.length} lake names.`);
    return {
      allFishNames: allFishNames || [],
      uniqueLakes: uniqueLakes || []
    };
  } catch (error) { //v.a. wenn Datenbank nicht verfügbar ist
    console.error('[fang-eintragen/+page.server.js] Error in load function:', error);
    return {
      allFishNames: [], 
      uniqueLakes: [],
      loadError: `Fehler beim Laden der Formularoptionen: ${error.message}`
    };
  }
}


// Form Action
export const actions = { //Form submissions handeln
  default: async ({ request }) => { 
    const formData = await request.formData(); //for handling form request => Promise
    const formValues = Object.fromEntries(formData); // Get all form values for potential return on failure

    const see_id = formData.get('see_id');
    const fischart_name = formData.get('fischart_name');
    const laenge_cm_str = formData.get('laenge_cm');
    const gewicht_kg_str = formData.get('gewicht_kg');
    const fang_datum_str = formData.get('fang_datum');
    const fang_zeit_str = formData.get('fang_zeit');
    const fang_ort_beschreibung = formData.get('fang_ort_beschreibung');
    const koeder = formData.get('koeder');
    const bemerkungen = formData.get('bemerkungen');
    const latitude_str = formData.get('latitude');
    const longitude_str = formData.get('longitude');

    if (!see_id || !fischart_name || !fang_datum_str || !fang_zeit_str) {
      return fail(400, { ...formValues, message: 'See, Fischart, Datum und Uhrzeit sind Pflichtfelder.' });
    }
    if (!latitude_str || !longitude_str) {
        return fail(400, { ...formValues, message: 'Standort (Latitude/Longitude) ist erforderlich. Bitte Standort ermitteln.' });
    }

    const latitude = parseFloat(latitude_str);
    const longitude = parseFloat(longitude_str); //String zu float
    if (isNaN(latitude) || isNaN(longitude)) {
        return fail(400, { ...formValues, message: 'Ungültige Latitude/Longitude Werte.'}); //formValues & Error Message in Error
    }

    const fangTimestamp = new Date(`${fang_datum_str}T${fang_zeit_str}:00`); //Date Objekt, {}T${} ISO 8601, 00 Sekunden
    let weatherData = null;
    const formattedFangDatumForAPI = formatDateForAPI(fang_datum_str);
    
  
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${formattedFangDatumForAPI}&end_date=${formattedFangDatumForAPI}`;
    //Wetterdaten für Länge- Breitegrad & Datum
   
    try {
      const weatherResponse = await fetch(weatherApiUrl); //Network Request
      if (!weatherResponse.ok) {
        console.error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}. Response:`, await weatherResponse.text());
      } else {
        const rawWeatherData = await weatherResponse.json();
        
        if (rawWeatherData.current) { //.current ruft aktuelle Wetterdaten auf
            weatherData = {
                timestamp: rawWeatherData.current.time ? new Date(rawWeatherData.current.time) : fangTimestamp, //if not null ? use current.time else = fangTimestamp
                temperature_celsius: rawWeatherData.current.temperature_2m,
                apparent_temperature_celsius: rawWeatherData.current.apparent_temperature,
                relative_humidity_percent: rawWeatherData.current.relative_humidity_2m,
                precipitation_mm: rawWeatherData.current.precipitation,
                weather_condition_code: rawWeatherData.current.weather_code, 
                wind_speed_kmh: rawWeatherData.current.wind_speed_10m,
                wind_direction_degrees: rawWeatherData.current.wind_direction_10m,
                surface_pressure_hpa: rawWeatherData.current.surface_pressure,
                api_source: "Open-Meteo",
            };
        } else {
            console.warn('"current" weather data not found in Open-Meteo response.');
        }
      }
    } catch (e) {
      console.error('[Form Action] Failed to fetch weather data:', e);
    }

    const catchDocument = {
      see_id,
      fischart_name,
      laenge_cm: laenge_cm_str ? parseFloat(laenge_cm_str) : null,
      gewicht_kg: gewicht_kg_str ? parseFloat(gewicht_kg_str) : null,
      fang_datum: fangTimestamp,
      fang_ort_beschreibung: fang_ort_beschreibung || null, //optional, muss durch User nicht eingetragen werden
      koeder: koeder || null,
      bemerkungen: bemerkungen || null,
      geolocation: { latitude: latitude, longitude: longitude },
      weather: weatherData, // null, wenn API-call fehlgeschlagen oder keine .current Wetterdaten
    };

    try {
      await addCatch(catchDocument);
      return { success: true, message: 'Fang erfolgreich eingetragen!' }; // 
    } catch (e) {
      console.error('Error saving catch to DB:', e);
      // Fehlermeldung mit Ortsdaten
      return fail(500, { ...formValues, latitude: String(latitude), longitude: String(longitude), message: `Fehler beim Speichern in der Datenbank: ${e.message}` }); //${} template literal --> e.message wird schön in den String gepackt
    }
  }
};
