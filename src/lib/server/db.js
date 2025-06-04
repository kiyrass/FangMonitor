import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);

// Konsolenlogs, um Verbindung mit MongoDb sicherzustellen
console.log('(db.js) Initializing MongoDB client');
await client.connect();
console.log('(db.js) MongoDB client connected successfully.');
const db = client.db("FangMonitor");

const statistikCollection = db.collection('fangstatistik');
const fischlexikonCollection = db.collection('fischlexikon');
const catchesCollection = db.collection('catches');

//Fangstatistik

export async function getSingleFangstatistikGroup(jahrParam, seeIdParam, typParam) {
    const jahr = Number(jahrParam);
    if (isNaN(jahr)) { console.error(`(db.js) Invalid jahr in getSingleFangstatistikGroup: ${jahrParam}`); return null; } //sollte mit den jetzigen Daten nicht passieren
    const pipeline = [
        { $match: { jahr: jahr, see_id: seeIdParam, typ: typParam } },
        { $group: { _id: { see_id: "$see_id", jahr: "$jahr", typ: "$typ" }, fischarten: { $push: { fischart_id: "$fischart_id", menge_kg: "$menge_kg" } } } }
    ];
    try {
        const result = await statistikCollection.aggregate(pipeline).toArray();
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (error) { console.error('[db.js] Error in getSingleFangstatistikGroup:', error); throw new Error(`DB error: ${error.message}`); }
}

export async function getUniqueLakeIds() {
  try {
    const lakeIds = await statistikCollection.distinct("see_id"); //weil seen aus fangstatistik genommen werden
    return lakeIds.filter(id => id != null).sort(); //prüfen, dass keine ids null sind
  } catch (error) { console.error('[db.js] Error fetching unique lake IDs:', error); throw new Error(`DB error: ${error.message}`); }
}


export async function getUniqueYearsForSee(seeId) {
  if (!seeId) { console.warn('[db.js] getUniqueYearsForSee: seeId parameter is missing.'); return []; } //empty Array, um Fehler zu vermeiden
  try {
    const years = await statistikCollection.distinct("jahr", { see_id: seeId }); 
    return years.map(year => Number(year)).filter(year => !isNaN(year)).sort((a, b) => b -a ); //neuestes Jahr zuerst
  } catch (error) { console.error(`[db.js] Error fetching unique years for seeId '${seeId}':`, error); throw new Error(`DB error: ${error.message}`); }
}

export async function getUniqueTypesForSeeYear(seeId, jahrParam) {
  const jahr = Number(jahrParam);
  if (!seeId || isNaN(jahr)) { console.warn(`[db.js] getUniqueTypesForSeeYear: invalid params. seeId: ${seeId}, jahr: ${jahrParam}`); return []; }
  try {
    const types = await statistikCollection.distinct("typ", { see_id: seeId, jahr: jahr });
    return types.filter(typ => typ != null).sort();
  } catch (error) { console.error(`[db.js] Error fetching unique types for seeId '${seeId}' and jahr '${jahr}':`, error); throw new Error(`DB error: ${error.message}`); }
}

//Fischlexikon
//Helferfunktion für getAllFischartenNamen(), getFischForCategory(categoryNameParam), um die finOnde Opeartion durchzuführen.
async function getFischlexikonDataDoc() {
  try {
    const dataDoc = await fischlexikonCollection.findOne({}); //Fischlexikon-Daten werden in einem Dokument gespeichert
    if (!dataDoc) { console.warn('[db.js] No document found in fischlexikon collection.'); return null; }
    return dataDoc;
  } catch (error) { console.error('[db.js] Error fetching fischlexikon data document:', error); throw new Error(`DB error: ${error.message}`); }
}


export async function getFischForCategory(categoryNameParam) {
  const dataDoc = await getFischlexikonDataDoc();
  if (!dataDoc) { console.warn(`[db.js] Fischlexikon data document not found.`); return null; }
  const lowerCategoryNameParam = categoryNameParam.toLowerCase();
  let foundKey = null;
  for (const key in dataDoc) { if (key.toLowerCase() === lowerCategoryNameParam) { foundKey = key; break; } }
  if (foundKey && dataDoc[foundKey] && Array.isArray(dataDoc[foundKey])) {
    return dataDoc[foundKey];
  }
  return null; 
}
// Fänge erfassen
export async function getAllFischartenNamen() {
  const dataDoc = await getFischlexikonDataDoc();
  if (!dataDoc) {
    console.warn('[db.js] Fischlexikon data document not found for getAllFischartenNamen.');
    return [];
  }
  const fishNames = new Set(); //Duplikate vermeiden (bereits in aktuellen Daten bereinigt)
  for (const categoryKey in dataDoc) {
    if (categoryKey === '_id') continue; //Objekt-ID überspringen
    const fishArray = dataDoc[categoryKey];
    if (Array.isArray(fishArray)) { //Fische in Fischkategorie als Array gespeichert
      fishArray.forEach(fish => {
        if (fish && typeof fish.name === 'string') {
          fishNames.add(fish.name);
        }
      });
    }
  }
  const sortedFishNames = Array.from(fishNames).sort(); //Fische in ein Array, alphabetisch sortiert, Array für .sort() 
  return sortedFishNames;
}




export async function addCatch(catchData) { //Input wird nur im backend gespeichert und dann jahresweise ausgewertet
  if (!catchData) {
    console.error('[db.js] addCatch: catchData is empty or undefined.');
    throw new Error('Catch data cannot be empty.');
  }
  try {
    const result = await catchesCollection.insertOne({
      ...catchData, //für dynamische Daten
      createdAt: new Date() //createdAt wird den Daten hinzugefügt
    });
    console.log('[db.js] Catch added with ID:', result.insertedId);
    return result;
  } catch (error) {
    console.error('[db.js] Error inserting catch into MongoDB:', error);
    throw new Error(`Database error inserting catch: ${error.message}`);
  }
}

export default {
  getSingleFangstatistikGroup,
  getUniqueLakeIds,
  getUniqueYearsForSee,
  getUniqueTypesForSeeYear,
  getFischForCategory,
  getAllFischartenNamen,
  addCatch
};
