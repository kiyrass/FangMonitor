import { getSingleFangstatistikGroup } from '$lib/server/db.js'; 
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { see_id, jahr, typ } = params;
  console.log(`[Details Page +page.server.js] Load function called for: see_id=${see_id}, jahr=${jahr}, typ=${typ}`);

  if (!see_id || !jahr || !typ) {
    console.error('[Details Page +page.server.js] Missing required parameters.');
    throw error(400, 'Ungültige Anfrage: See-ID, Jahr und Typ sind erforderlich.');
  }

  try {
    //getSingleFangstatistikGroup erwartet (jahrParam, seeIdParam, typParam)
    const statistikGruppe = await getSingleFangstatistikGroup(jahr, see_id, typ);

    if (!statistikGruppe) {
      console.log(`[Details Page +page.server.js] No statistik group found for: ${see_id}, ${jahr}, ${typ}`);
      throw error(404, 'Die angeforderte Statistikgruppe wurde nicht gefunden.');
    }

    console.log('[Details Page +page.server.js] Statistik group found and returned.');
    return {
      gruppe: statistikGruppe // Das ist data.gruppe in +page.svelte
    };

  } catch (err) {
    console.error(`[Details Page +page.server.js] Error loading statistik group:`, err);
    if (err.status && err.body?.message) { //SvelteKit errors
        throw err;
    }
    throw error(500, `Serverfehler beim Laden der Statistikgruppe: ${err.message}`);
  }
}
