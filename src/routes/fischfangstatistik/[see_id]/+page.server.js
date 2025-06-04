import { getUniqueYearsForSee } from '$lib/server/db.js'; 
import { error } from '@sveltejs/kit';


export async function load({ params }) {
  const { see_id } = params; // Für see_id vom URL path
  console.log(`[+page.server.js /fischfangstatistik/${see_id}] Load function called.`);

  if (!see_id) {
    //Falls Routen-Matching nicht funktioniert
    console.error(`[+page.server.js /fischfangstatistik/${see_id}] see_id parameter is missing.`);
    throw error(400, 'Ungültige Anfrage: See-ID ist erforderlich.');
  }

  try {
    const years = await getUniqueYearsForSee(see_id);

    if (!years || years.length === 0) {
      console.log(`[+page.server.js /fischfangstatistik/${see_id}] No years found for this lake.`);
    } else {
      console.log(`[+page.server.js /fischfangstatistik/${see_id}] Years fetched:`, years);
    }
    return {
      currentSeeId: see_id, // See_id aus gewählter Route
      availableYears: years || [] // Leeres Array um Fehlermeldung zu vermeiden
    };

  } catch (err) {
    console.error(`[+page.server.js /fischfangstatistik/${see_id}] Error loading years for lake:`, err);
    if (err.status) throw err; // SvelteKit error
    throw error(500, `Fehler beim Laden der Jahresdaten für den See ${see_id}.`);
  }
}
