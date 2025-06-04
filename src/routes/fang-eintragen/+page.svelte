<script>
  import { enhance } from "$app/forms";

  let { data, form } = $props();

  //IDs zu Namen
  const seeNamenMap = {
    bodensee: "Bodensee",
    zuerichsee: "Zürichsee",
    vierwaldstaettersee: "Vierwaldstättersee",
    genfersee: "Genfersee",
    neuenburgersee: "Neuenburgersee",
  };

  //$derived --> 1..n reaktive Variablen
  const seeOptions = $derived(
    data.uniqueLakes && data.uniqueLakes.length > 0
      ? data.uniqueLakes.map((id) => ({ id, name: seeNamenMap[id] || id })) //true: für jede id wir neues Objekt erstellt
      : Object.entries(seeNamenMap).map(([id, name]) => ({ id, name })), //false: Fallback auf seeNamenMap (hardgecodet)
  );

  const fischartOptions = $derived(
    data.allFishNames && data.allFishNames.length > 0 //allFishNames --> server.js --> db.js getAllFischarten()
      ? data.allFishNames
      : ["Hecht", "Zander", "Egli", "Andere"], //Fallback
  );
  //Deklaration der Form-Variablen mit form?, da diese bei Aufruf der Seite bereits initialisiert werden
  //form? prüft, ob form. undefined oder null ist
  let see_id_val = $state(form?.see_id || "");
  let fischart_name_val = $state(form?.fischart_name || "");
  let laenge_cm_val = $state(form?.laenge_cm || "");
  let gewicht_kg_val = $state(form?.gewicht_kg || "");
  let fang_datum_val = $state(
    form?.fang_datum || new Date().toISOString().split("T")[0],
  );
  let fang_zeit_val = $state(
    form?.fang_zeit || new Date().toTimeString().substring(0, 5),
  );
  let fang_ort_beschreibung_val = $state(form?.fang_ort_beschreibung || "");
  let koeder_val = $state(form?.koeder || "");
  let bemerkungen_val = $state(form?.bemerkungen || "");
  //Geodaten
  let latitude = $state(form?.latitude || null);
  let longitude = $state(form?.longitude || null);
  let locationError = $state("");
  let isFetchingLocation = $state(false);
  //Form
  let formMessage = $state(form?.message || "");
  let formSuccess = $state(form?.success === true);

  function getCurrentLocation() {
    if (navigator.geolocation) {
      //Unterstützt Browser Geolocation?
      isFetchingLocation = true;
      locationError = "";
      navigator.geolocation.getCurrentPosition(
        //navigator ruft geolocation über Geolocation API (JS Interface) auf (alle herkömmlichen Browser sollten unterstützt sein)
        //position-Objekt ist Besstandteil der geolocation API
        (position) => {
          //=> Callbackfunktion, gCP sucht nach Standort, Zuweisung danach durch (position) =>
          latitude = position.coords.latitude.toFixed(6); //Auf 11cm genau, bei uns 7-8cm --> Genauigkeit nimmt hinsichtlich Polen zu
          longitude = position.coords.longitude.toFixed(6);
          isFetchingLocation = false;
          console.log("Location fetched:", latitude, longitude); //Konsolen-Log für Test
        },
        (error) => { //wird gecalled, wenn navigator.geolocation fehlschlägt
          locationError = `Fehler beim Abrufen des Standorts: ${error.message}`; //`Template-Literal`--> Einbettung von Ausdrücken in String
          isFetchingLocation = false;
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      locationError = "Geolocation wird von diesem Browser nicht unterstützt.";
    }
  }

  $effect(() => { //Svelte 5, für reaktive Werte, für Änderungen in Form-Prop
    if (form) {
      console.log("Form prop updated:", form);
      formMessage = form.message || "";
      formSuccess = form.success === true; //if form.success --> $state-Variablen werden zurückgesetzt

      if (form.success) {
        see_id_val = "";
        fischart_name_val = "";
        laenge_cm_val = "";
        gewicht_kg_val = "";
        fang_datum_val = new Date().toISOString().split("T")[0];
        fang_zeit_val = new Date().toTimeString().substring(0, 5);
        fang_ort_beschreibung_val = "";
        koeder_val = "";
        bemerkungen_val = "";
        latitude = null;
        longitude = null;
        const timer = setTimeout(() => {
          formMessage = "";
          formSuccess = false;
        }, 7000); //Timeout 7s nach Übermittlung, callback auf Formular (!formSuccess)
        return () => clearTimeout(timer); //zurücksetzen Timer, wenn Übermittlung fehlgeschlagen
      }
    }
  });
</script>

<div class="form-container">
  <h1>Neuen Fang eintragen</h1>

  {#if formMessage} <!-- Nach <Formübermittlung-->
    <p
      class="form-message"
      class:success={formSuccess}
      class:error={!formSuccess && formMessage}
    >
      {formMessage}
    </p>
  {/if}
  {#if data.loadError && !formMessage}
    <p class="form-message error">
      Optionen konnten nicht geladen werden: {data.loadError}
    </p>
  {/if}

  <form method="POST" use:enhance id="catch-form"> <!--Für Formularübermittlung, ohne dass alles neu lädt (durch JS im Browser), erhält Fkt. auch mit normalem HTML-->
    <fieldset> <!-- Visuelle Strukturierung Formularelemente -->
      <legend>Fisch & Fangdetails</legend>
      <div>
        <label for="see_id">See:</label>
        <select id="see_id" name="see_id" bind:value={see_id_val} required> <!-- Dropdown gemäss $state-Variable -->
          <option value="" disabled={see_id_val !== ""} 
            >-- See auswählen --</option> <!-- Platzhalter, nur, wenn noch nichts ausgewählt -->
          {#each seeOptions as see (see.id)}
            <option value={see.id}>{see.name}</option> <!-- Value an id gebunden, angezeigt wird Name -->
          {/each}
        </select>
      </div>
      <div>
        <label for="fischart_name">Fischart:</label>
        <input
          type="text"
          id="fischart_name"
          name="fischart_name"
          list="fischarten-datalist"
          bind:value={fischart_name_val}
          required
        />
        <datalist id="fischarten-datalist">
          {#each fischartOptions as fischName (fischName)}
            <option value={fischName}></option>
          {/each}
        </datalist>
      </div>
      <div>
        <label for="laenge_cm">Länge (cm):</label>
        <input
          type="number"
          id="laenge_cm"
          name="laenge_cm"
          step="0.1"
          min="0"
          bindvalue={laenge_cm_val}
        />
      </div>
      <div>
        <label for="gewicht_kg">Gewicht (kg):</label>
        <input
          type="number"
          id="gewicht_kg"
          name="gewicht_kg"
          step="0.01"
          min="0"
          bind:value={gewicht_kg_val}
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Datum & Uhrzeit</legend>
      <div>
        <label for="fang_datum">Datum:</label>
        <input
          type="date"
          id="fang_datum"
          name="fang_datum"
          bind:value={fang_datum_val}
          required
        />
      </div>
      <div>
        <label for="fang_zeit">Uhrzeit:</label>
        <input
          type="time"
          id="fang_zeit"
          name="fang_zeit"
          bind:value={fang_zeit_val}
          required
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Standort</legend>
      <div>
        <label for="fang_ort_beschreibung">Ort (Beschreibung):</label>
        <input
          type="text"
          id="fang_ort_beschreibung"
          name="fang_ort_beschreibung"
          placeholder="z.B. Nähe Steg, Schilfbereich Westufer"
          bind:value={fang_ort_beschreibung_val}
        />
      </div>
      <button
        type="button"
        onclick={getCurrentLocation}
        disabled={isFetchingLocation}
      >
        {isFetchingLocation
          ? "Standort wird ermittelt..."
          : "Aktuellen Standort verwenden"}
      </button> <!-- isFetchingLocation: true wenn Location gefunden-->
      {#if locationError}<p class="error-text">{locationError}</p>{/if}
      {#if latitude && longitude}
        <p class="location-display">
          Lat: {latitude}, Lon: {longitude} (wird mitgesendet)
        </p>
      {/if}
      <input type="hidden" name="latitude" value={latitude || ""} />
      <input type="hidden" name="longitude" value={longitude || ""} />
    </fieldset>

    <fieldset>
      <legend>Weitere Details (Optional)</legend>
      <div>
        <label for="koeder">Köder:</label>
        <input type="text" id="koeder" name="koeder" bindvalue={koeder_val} />
      </div>
      <div>
        <label for="bemerkungen">Bemerkungen:</label>
        <textarea
          id="bemerkungen"
          name="bemerkungen"
          rows="3"
          bindvalue={bemerkungen_val}
        ></textarea>
      </div>
    </fieldset>

    <button type="submit" class="submit-button">Fang speichern</button>
  </form>

  <br/>
  <a href="/" class ="back-link"> Zurück zur Startseite</a>

</div>

<style>
  .form-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: Arial, sans-serif;
  }
  fieldset {
    border: 1px solid #ddd;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 4px;
  }
  legend {
    font-weight: bold;
    color: #337ab7;
    padding: 0 5px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  input[type="text"],
  input[type="number"],
  input[type="date"],
  input[type="time"],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  button[type="button"],
  .submit-button {
    padding: 10px 15px;
    background-color: #337ab7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 10px;
  }
  button[type="button"]:hover,
  .submit-button:hover {
    background-color: #286090;
  }
  button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  .error-text {
    color: red;
    font-size: 0.9em;
    margin-top: 5px;
  }
  .location-display {
    font-size: 0.9em;
    color: green;
    background-color: #e6ffe6;
    padding: 5px;
    border-radius: 3px;
    margin-top: 5px;
  }
  .form-message {
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
  }
  .form-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .form-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #007bff;
  }
</style>
