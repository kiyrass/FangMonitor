<script>
  // Für die Auflistung der Seen als Links


  let { data } = $props(); // Receives { uniqueLakes, loadError } from +page.server.js

  //Konsolenlogs, um sicherzustellen, dass die See-Daten aus MongoDB laden.
  console.log('[Main Page /fischfangstatistik/+page.svelte - Lake List] Component instance created. Data:', data);
  console.log('[Main Page /fischfangstatistik/+page.svelte - Lake List] Unique lakes received:', data?.uniqueLakes);

  // Helper für Umstrukturierung der Seenamen 
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
</script>

<h1>Fangstatistik nach Seen</h1>

{#if data.loadError}
  <p class="error-message">
    <strong>Fehler beim Laden der Daten:</strong> {JSON.stringify(data.loadError)}
  </p>
{:else if !data.uniqueLakes || data.uniqueLakes.length === 0}
  <p>Keine Seen gefunden oder Daten werden geladen...</p>
{:else}
  <p>Wählen Sie einen See aus, um die Jahresstatistiken anzuzeigen:</p>
  <ul class="lake-list">
    {#each data.uniqueLakes as lakeId (lakeId)}
      <li>
        <!-- 
         Für Navigation zum gewünschten See(z.B., /fangstatistik/[see_id]).
        -->
        <a href={`/fischfangstatistik/${lakeId}`}>
          {getSeeDisplayName(lakeId)}
        </a>
      </li>
    {/each}
  </ul>
{/if}

<br/>
<a href="/" class ="back-link"> Zurück zur Startseite</a>



<style>
  
  h1 {
    margin-bottom: 20px;
    font-family: Arial, sans-serif; 
  }
  p {
    font-family: Arial, sans-serif; 
  }
  .error-message {
    color: #D8000C;
    background-color: #FFD2D2;
    border: 1px solid #D8000C;
    padding: 10px 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .lake-list {
    list-style-type: none;
    padding: 0;
    font-family: Arial, sans-serif; 
  }
  .lake-list li {
    margin-bottom: 10px;
  }
  .lake-list a {
    display: block;
    padding: 12px 18px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  }
  .lake-list a:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }
  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
  }
  
</style>
