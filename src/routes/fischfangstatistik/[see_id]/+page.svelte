<script>
  let { data } = $props(); 

  //Helfer für die Userfreundliche Darstellung der Seenamen
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

  console.log(`[+page.svelte /fischfangstatistik/${data.currentSeeId}] Page loaded. Displaying as: "${seeDisplayName}". Years:`, data.availableYears);
</script>

<div class="lake-years-container">
  <h1>Statistiken für {seeDisplayName}</h1> {#if data.currentJahr} im Jahr {data.currentJahr}{/if}

  {#if data.loadError}
    <p class="error-message">Fehler: {JSON.stringify(data.loadError.message || data.loadError)}</p>
  {:else if data.availableYears && data.availableYears.length > 0}
    <p>Wählen Sie ein Jahr aus, um die Statistik-Typen anzuzeigen:</p>
    <ul class="year-list">
      {#each data.availableYears as jahr (jahr)}
        <li>
          <a href={`/fischfangstatistik/${data.currentSeeId}/${jahr}`}>
            Statistiken für das Jahr {jahr}
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Für {seeDisplayName} wurden keine Jahresdaten in der Statistik gefunden.</p>
  {/if}

  <br />
  <a href="/fischfangstatistik" class="back-link"> Zurück zur Seenübersicht</a>
  <br/>
  <a href="/" class ="back-link"> Zurück zur Startseite</a>
</div>

<style>
  .lake-years-container {
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
  .year-list {
    list-style-type: none;
    padding: 0;
  }
  .year-list li {
    margin-bottom: 10px;
  }
  .year-list a {
    display: block;
    padding: 10px 15px;
    background-color: #138496; 
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  .year-list a:hover {
    background-color: #007bff;
  }
  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
  }
</style>
