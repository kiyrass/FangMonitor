<script>
    let { data } = $props(); // empfängt { categoryName, fish, loadError }
  
    const categoryDisplayNames = {
      "raubfische": "Raubfische",
      "salmoniden": "Salmoniden",
      "cypriniden": "Cypriniden",
      "neozonen": "Neozonen",
      "andere": "Andere Fische"
    };
    const displayName = categoryDisplayNames[data.categoryName] || data.categoryName;
  
    const fishList = data.fish;
  
    console.log(`[Fischlexikon Category Page Svelte] Displaying category: ${displayName}, Fish count: ${fishList?.length}`);
    if (fishList && fishList.length > 0) {
      console.log('[Fischlexikon Category Page Svelte] First fish item:', JSON.stringify(fishList[0]));
    }
  
    // Helferfunktion für Bild-Routen
    function getImagePath(imageName) {
      if (!imageName) return '/images/placeholder.jpg'; // Fallback Platzhalter
      if (imageName.startsWith('/images/')) {
        return imageName;
      }
      return `/images/${imageName}`; 
    }
  
    // Funktion für image loading errors
    function handleImageError(event) {
      console.warn('[Fischlexikon Category Page Svelte] Image failed to load:', event.target.src, '- Applying placeholder: /images/placeholder.png');
      event.target.onerror = null; // Verhindert infinite loops wenn auch Route zum placeholder fehlschlägt, handleImageError (im HTML-Codeblock wird null gesetzt)
      event.target.src = '/images/placeholder.jpg'; 
    }
  </script>
  
  <div class="category-page-container">
    <header class="category-header">
      <h1>Lexikon: {displayName}</h1>
    </header>
  
    <section class="category-content">
      {#if data.loadError}
        <p class="error-message">Fehler beim Laden: {JSON.stringify(data.loadError.message || data.loadError)}</p>
      {:else if fishList && fishList.length > 0}
        <p>Anzahl Fische in dieser Kategorie: {fishList.length}</p>
        <ul class="fish-list">
          {#each fishList as fish, index (fish?.scientific_name || fish?.name || index)}
            <li class="fish-item">
              <div class="fish-image-container">
                <img 
                  src={getImagePath(fish?.image_url)} 
                  alt="Bild von {fish?.name || 'Fisch'}" 
                  class="fish-image"
                  onerror={handleImageError} /> 
              </div>
              <div class="fish-details">
                <h2>{fish.name} {#if fish.scientific_name}(<em>{fish.scientific_name}</em>){/if}</h2>
                {#if fish.habitat}<p><strong>Habitat:</strong> {fish.habitat}</p>{/if}
                {#if fish.max_size_cm}<p><strong>Max. Grösse:</strong> {fish.max_size_cm} cm</p>{/if}
                {#if fish.description}<p class="fish-description">{fish.description}</p>{/if}
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p>Für die Kategorie "{displayName}" sind aktuell keine Fischeinträge vorhanden oder die Kategorie wurde nicht gefunden.</p>
      {/if}
    </section>
  
    <footer class="category-footer">
      <a href="/fischlexikon"> Zurück zur Kategorieübersicht</a>
      <br>
      <a href="/"> Zurück zur Startseite</a>
    </footer>
  </div>
  
  <style>
    .category-page-container { max-width: 900px; margin: 40px auto; padding: 20px; font-family: Arial, sans-serif; color: #333; }
    .category-header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #28a745; }
    .category-header h1 { color: #28a745; }
    
    .fish-list { list-style: none; padding: 0; }
    .fish-item { 
      display: flex; 
      margin-bottom: 25px; 
      padding-bottom: 25px; 
      border-bottom: 1px solid #eee; 
      gap: 20px;
      align-items: flex-start;
    }
    .fish-item:last-child { border-bottom: none; }
  
    .fish-image-container { 
      flex-shrink: 0; 
      width: 150px; 
    }
    .fish-image { 
      width: 100%; 
      height: auto; 
      object-fit: cover; 
      border-radius: 4px; 
      border: 1px solid #ddd;
    }
    
    .fish-details {
      flex-grow: 1;
    }
    .fish-details h2 { margin-top: 0; color: #1e7e34; font-size: 1.5em; }
    .fish-details p { margin: 5px 0; line-height: 1.6; }
    .fish-description { font-style: italic; color: #444; }
  
    .category-footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
    .category-footer a { color: #007bff; text-decoration: none; margin-right: 15px; }
    .category-footer a:hover { text-decoration: underline; }
    .error-message {
      color: #D8000C;
      background-color: #FFD2D2;
      border: 1px solid #D8000C;
      padding: 10px 15px;
      border-radius: 4px;
    }
  </style>
  