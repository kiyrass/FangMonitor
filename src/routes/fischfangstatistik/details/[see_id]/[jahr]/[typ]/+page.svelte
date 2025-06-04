<script>
    let { data } = $props(); // empfängt { gruppe, loadError }
  
    // Für Statistikanzeige
    // { _id: { see_id: "...", jahr: ..., typ: "..." }, fischarten: [ ... ] }
    const gruppe = data.gruppe;
  
    console.log('[Details Page Svelte] Received data.gruppe:', gruppe);
  
  
    const seeNamen = {
      "bodensee": "Bodensee",
      "zuerichsee": "Zürichsee",
      "vierwaldstaettersee": "Vierwaldstättersee",
      "genfersee": "Genfersee",
      "neuenburgersee": "Neuenburgersee",
    };
  
    const fischartNamen = {
      "hecht": "Hecht",
      "zander": "Zander",
      "forellen": "Forellen",
      "felchen": "Felchen",
      "saiblinge": "Saiblinge",
      "egli": "Egli",
      "cypriniden": "Cypriniden (div.)",
      "rest": "Restliche Arten",
    };
  
    function getSeeName(id) {
      return seeNamen[id] || id;
    }
  
    function getFischartName(id) {
      return fischartNamen[id] || id;
    }
  
    function formatMenge(menge) {
      if (typeof menge === 'number') {
        return menge.toFixed(2) + " kg"; //auf 10g genau, jetzige Daten sowieso nur auf kg genau
      }
      return menge;
    }
  </script>
  
  <div class="details-container">
    {#if data.loadError}
      <p class="error-message">Fehler: {JSON.stringify(data.loadError.message || data.loadError)}</p>
      <a href={`/fischfangstatistik/${gruppe?._id?.see_id}/${gruppe?._id?.jahr}`} class="back-link"> Zurück zur Typ-Auswahl</a>
      <!--Template literal mit gruppe? für null oder undefined Prüfung-->
      <br>
      <a href="/fischfangstatistik" class="back-link"> Zurück zur Seenübersicht</a>
    {:else if gruppe}
      <h1>
        Details für: {getSeeName(gruppe._id.see_id)} - {gruppe._id.jahr} - {gruppe._id.typ}
      </h1>
  
      <div class="info-section">
        <h2>Allgemeine Informationen der Gruppe</h2>
        <p><strong>Jahr:</strong> {gruppe._id.jahr}</p>
        <p><strong>See:</strong> {getSeeName(gruppe._id.see_id)}</p>
        <p><strong>Typ:</strong> {gruppe._id.typ}</p>
      </div>
  
      <div class="fischarten-section">
        <h2>Aufstellung der gefangenen Fischarten</h2>
        {#if gruppe.fischarten && gruppe.fischarten.length > 0}
          <table>
            <thead>
              <tr>
                <th>Fischart</th>
                <th>Menge</th>
              </tr>
            </thead>
            <tbody>
              {#each gruppe.fischarten as fisch (fisch.fischart_id)}
                <tr>
                  <td>{getFischartName(fisch.fischart_id)}</td>
                  <td>{formatMenge(fisch.menge_kg)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <p>Keine Fischarten-Daten für diese spezifische Gruppe verfügbar.</p>
        {/if}
      </div>
  
      <a href={`/fischfangstatistik/${gruppe._id.see_id}/${gruppe._id.jahr}`} class="back-link"> Zurück zur Typ-Auswahl für {getSeeName(gruppe._id.see_id)}, {gruppe._id.jahr}</a>
      <br>
      <a href="/fischfangstatistik" class="back-link"> Zurück zur Seenübersicht</a>
      <br/>
      <a href="/" class ="back-link"> Zurück zur Startseite</a>
    {:else}
      <h1>Statistikgruppe nicht gefunden</h1>
      <p>Die angeforderte Statistikgruppe konnte nicht geladen werden oder existiert nicht.</p>
      <a href="/fischfangstatistik" class="back-link"> Zurück zur Seenübersicht</a>
    {/if}
  </div>
  
  <style>
    .details-container{ 
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .details-container h1 {
      color: #333;
      border-bottom: 2px solid #ccc;
      padding-bottom: 10px;
    }
    .info-section, .fischarten-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .info-section h2, .fischarten-section h2 {
      margin-top: 0;
      color: #555;
    }
    .fischarten-section table {
      width: 100%;
      border-collapse: collapse;
    }
    .fischarten-section th, .fischarten-section td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .fischarten-section th {
      background-color: #f2f2f2;
    }
    .error-message {
      color: red;
    }
    .back-link {
      display: inline-block;
      margin-top: 10px;
      margin-right: 15px;
      color: #007bff;
    }
  </style>
  