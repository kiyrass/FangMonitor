import { getFischForCategory } from '$lib/server/db.js'; // Assuming db.js is in $lib/server/
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // params.category will be URL-decoded by SvelteKit automatically
  const categoryName = params.category; 
  console.log(`[Fischlexikon Category Page JS] Loading fish for category: ${categoryName}`);

  try {
    const fishList = await getFischForCategory(categoryName);

    if (!fishList) {
      // getFischForCategory returns null if category not found or dataDoc is null.
      // It returns an empty array if the category exists but has no fish (which is valid).
      console.warn(`[Fischlexikon Category Page JS] No fish list or category not found for: ${categoryName}.`);
      // You might want to throw a 404 if fishList is null, indicating the category itself doesn't exist.
      // If fishList is an empty array, that's valid data (an empty category).
      if (fishList === null) {
        throw error(404, `Fischkategorie "${categoryName}" nicht gefunden.`);
      }
    }
    
    return {
      categoryName: categoryName, 
      fish: fishList || []      // Pass the array of fish, or empty array if null
    };
  } catch (err) {
    console.error(`[Fischlexikon Category Page JS] Error loading fish for category ${categoryName}:`, err);
    // If it's already a SvelteKit error (like the 404 we might throw), re-throw it
    if (err.status) throw err;
    // Otherwise, throw a generic 500
    throw error(500, `Fehler beim Laden der Fische für Kategorie "${categoryName}": ${err.message}`);
  }
}
