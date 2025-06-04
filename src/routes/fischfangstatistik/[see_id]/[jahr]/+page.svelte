<script>
    let { data } = $props(); 

    const seeNamen = {
      "bodensee": "Bodensee",
      "zuerichsee": "Zürichsee",
      "vierwaldstaettersee": "Vierwaldstättersee",
      "genfersee": "Genfersee",
      "neuenburgersee": "Neuenburgersee",
    
    };
  
    function getSeeDisplayName(id) {
        return seeNamen[id] || id;
    }
  
    const seeDisplayName = getSeeDisplayName(data.currentSeeId);
    const jahrDisplay = data.currentJahr;
  
    console.log(`[+page.svelte /fischfangstatistik/${data.currentSeeId}/${data.currentJahr}] Page loaded. Types:`, data.availableTypes);
  </script>
  
  <div class="types-for-year-container">
    <h1>Statistik-Typen für {seeDisplayName} im Jahr {jahrDisplay}</h1>
  
    {#if data.loadError}
      <p class="error-message">Fehler: {JSON.stringify(data.loadError)}</p>
    {:else if data.availableTypes && data.availableTypes.length > 0}
      <p>Wählen Sie einen Statistik-Typ aus, um die Details anzuzeigen:</p>
      <ul class="type-list">
        {#each data.availableTypes as typ (typ)}
          <li>
            <!-- 
              um zu vermeiden, dass Spezialzeichen in der URL falsch interpretiert werden, wird via trmplate literal
              encodeURIComponent verwendet.
            -->
            <a href={`/fischfangstatistik/details/${data.currentSeeId}/${data.currentJahr}/${encodeURIComponent(typ)}`}>
              {typ}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p>Für {seeDisplayName} im Jahr {jahrDisplay} wurden keine Statistik-Typen gefunden.</p>
    {/if}
  
    <br />
    <a href={`/fischfangstatistik/${data.currentSeeId}`} class="back-link"> Zurück zur Jahresauswahl für {seeDisplayName}</a>
    <br />
    <a href="/fischfangstatistik" class="back-link"> Zurück zur Seenübersicht</a>
    <br/>
    <a href="/" class ="back-link"> Zurück zur Startseite</a>
  </div>
  
  <style>
    .types-for-year-container {
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #ccc;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .error-message {
      color: red;
    }
    .type-list {
      list-style-type: none;
      padding: 0;
    }
    .type-list li {
      margin-bottom: 10px;
    }
    .type-list a {
      display: block;
      padding: 10px 15px;
      background-color: #17a2b8; 
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    .type-list a:hover {
      background-color: #138496;
    }
    .back-link {
      display: inline-block;
      margin-top: 10px; 
      margin-right: 15px; 
      color: #007bff;
    }
  </style>
  