import { getUniqueTypesForSeeYear } from '$lib/server/db.js'; 
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { see_id, jahr } = params; // see_id und jahr vom URL Pfad
  console.log(`[+page.server.js /fischfangstatistik/${see_id}/${jahr}] Load function called.`);

  if (!see_id || !jahr) {
   //Fehler sollte nicht geworfen werden, wenn routing funktioniert
    console.error(`[+page.server.js /fischfangstatistik/${see_id}/${jahr}] see_id or jahr parameter is missing.`);
    throw error(400, 'Ungültige Anfrage: See-ID und Jahr sind erforderlich.');
  }

  try {
    // Funktionsaufruf in db.js für Typ pro See und Jahr
    // getUniqueTypesForSeeYear erwartet, dass jahr eine Nummer/ein String der zu einer Nummer gecastet werden kann ist, mit aktuellen Daten kein Problem
    const types = await getUniqueTypesForSeeYear(see_id, jahr);

    if (!types || types.length === 0) {
      // Sollte mit aktuellen Daten nicht passieren.
      console.log(`[+page.server.js /fischfangstatistik/${see_id}/${jahr}] No types found for this lake/year.`);
    } else {
      console.log(`[+page.server.js /fischfangstatistik/${see_id}/${jahr}] Types fetched:`, types);
    }

    return {
      currentSeeId: see_id,       
      currentJahr: jahr,          
      availableTypes: types || [] 
    };

  } catch (err) {
    console.error(`[+page.server.js /fischfangstatistik/${see_id}/${jahr}] Error loading types for lake/year:`, err);
    if (err.status && err.body?.message) { //SvelteKit errors --> HttpError
        throw err;
    }
    // Für alle anderen Fehler, 500
    throw error(500, `Fehler beim Laden der Statistik-Typen für ${see_id}, Jahr ${jahr}.`);
  }
}
