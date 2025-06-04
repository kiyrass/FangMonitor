<script>
    const categories = [
      { id: 'raubfische', name: 'Raubfische', description: 'Fische, die sich vorwiegend von anderen Fischen und Tieren ernähren.' },
      { id: 'salmoniden', name: 'Salmoniden', description: 'Fische aus der Familie der Lachsfische, oft in kühleren Gewässern.' },
      { id: 'cypriniden', name: 'Cypriniden', description: 'Karpfenfische, eine artenreiche Familie von Süsswasserfischen.' },
      { id: 'andere', name: 'Andere', description: 'Weitere einheimische Fischarten.' },
      { id: 'neozonen', name: 'Neozoen', description: 'Gebietsfremde Arten, die durch menschlichen Einfluss eingeführt wurden.' }
    ];
  </script>
  
  <div class="lexikon-container">
    <header class="lexikon-header">
      <h1>Fischlexikon</h1>
      <p>Entdecken Sie Informationen zu verschiedenen Fischkategorien.</p>
    </header>
  
    <nav class="category-navigation">
      <h2>Kategorien</h2>
      <ul>
        {#each categories as category (category.id)}
          <li>
            <a href={`/fischlexikon/${category.id}`}>
              {category.name}
            </a>
            <p class="category-description">{category.description}</p>
          </li>
        {/each}
      </ul>
    </nav>
  
    <section class="lexikon-content">
      <p>
        Wählen Sie eine Kategorie aus, um mehr über die darin enthaltenen Fischarten zu erfahren.
        Diese Sektion wird laufend erweitert.
      </p>
    </section>
  
    <footer class="lexikon-footer">
      <a href="/"> Zurück zur Startseite</a>
    </footer>
  </div>
  
  <style>
    .lexikon-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
  
    .lexikon-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #28a745; 
    }
  
    .lexikon-header h1 {
      color: #28a745;
      margin-bottom: 10px;
    }
  
    .category-navigation {
      margin-bottom: 30px;
    }
  
    .category-navigation h2 {
      color: #1e7e34;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
  
    .category-navigation ul {
      list-style-type: none;
      padding: 0;
    }
  
    .category-navigation li {
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 5px;
      border: 1px solid #e9ecef;
    }
  
    .category-navigation a {
      text-decoration: none;
      color: #28a745;
      font-size: 1.2em;
      font-weight: bold;
    }
  
    .category-navigation a:hover {
      color: #1e7e34;
      text-decoration: underline;
    }
    .category-description {
      font-size: 0.9em;
      color: #555;
      margin-top: 5px;
    }
  
    .lexikon-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 0.9em;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
    .lexikon-footer a {
      color: #007bff;
      text-decoration: none;
    }
    .lexikon-footer a:hover {
      text-decoration: underline;
    }
  </style>
  