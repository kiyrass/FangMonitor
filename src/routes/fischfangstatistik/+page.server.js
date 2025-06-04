import { getUniqueLakeIds } from '$lib/server/db.js'; 
import { error as svelteKitError } from '@sveltejs/kit';


export async function load({ url }) {
 
  try {
    const uniqueLakes = await getUniqueLakeIds();
    console.log(`[Main /fischfangstatistik/+page.server.js] Unique lakes fetched (count: ${uniqueLakes ? uniqueLakes.length : 0}).`);

    return {
      uniqueLakes: uniqueLakes || [],
    };
  } catch (err) {
    console.error('[Main /fischfangstatistik/+page.server.js] Error in load function:', err);
    return {
      uniqueLakes: [],
      loadError: `Fehler beim Laden der Seenliste: ${err.message || 'Unbekannter Fehler'}`, //wird gecalled if data.loadError in +page.svelte
    };
  }
}
