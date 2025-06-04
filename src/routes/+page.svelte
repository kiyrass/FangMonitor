<script>
    
    const appName = "FangMonitor";
  </script>
  
  <div class="home-container">
    <header class="home-header">
      <h1>Willkommen zum {appName}</h1>
      <p>Alles rund um die Fischerei in der Schweiz</p>
    </header>
  
    <nav class="home-navigation">
      <h2>Navigation</h2>
      <ul>
        <li>
          <a href="/fischfangstatistik">Fischfangstatistiken Anzeigen</a>
        </li>
        <li>
          <a href="/fischlexikon">Fischlexikon Durchstöbern</a> 
          </li>
        <li>
          <a href="/fang-eintragen">Neuen Fang Eintragen</a> 
          </li>
        </ul>
    </nav>
  
    <section class="home-content">
      <h2>Über diese Anwendung</h2>
      <p>
        Sehen Sie detaillierte Statistiken über Fischfänge in den 5 grössten Schweizer Seen ein. 
        Helfen Sie der Fischbewirtschaftung, indem Sie direkt selbst Fänge erfassen
        und ein umfangreiches Fischlexikon konsultieren.
      </p>
      </section>
  
    <footer class="home-footer">
      <p>&copy; {new Date().getFullYear()} {appName}. Ein Studentenprojekt.</p>
    </footer>
  </div>
  
  <style>
    .home-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
  
    .home-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #007bff;
    }
  
    .home-header h1 {
      color: #007bff;
      margin-bottom: 10px;
    }
  
    .home-header p {
      font-size: 1.1em;
      color: #555;
    }
  
    .home-navigation {
      margin-bottom: 40px;
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
  
    .home-navigation h2 {
      margin-top: 0;
      color: #0056b3;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
  
    .home-navigation ul {
      list-style-type: none;
      padding: 0;
    }
  
    .home-navigation li {
      margin-bottom: 10px;
    }
  
    .home-navigation a {
      text-decoration: none;
      color: #007bff;
      font-weight: bold;
      padding: 8px 0;
      display: inline-block;
    }
  
    .home-navigation a:hover {
      color: #0056b3;
      text-decoration: underline;
    }
  
    .home-content h2 {
      color: #0056b3;
    }
    
    .home-footer {
      margin-top: 40px;
      text-align: center;
      font-size: 0.9em;
      color: #777;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
  