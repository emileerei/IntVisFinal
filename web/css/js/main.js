body {
  margin: 0 10px 0 0;
  font-family: 'Roboto', 'sans-serif';
  font-size: 1rem;
  color: #000000;
  text-align: center;
}

h1 {
  font-family: 'Roboto Slab', 'serif';
  font-size: 2rem;
}

h2 {
  font-family: 'Roboto Slab', 'serif';
  font-size: 1.5rem;
}

/* SEARCH BAR/NAV BAR */

.navbar {
  display: inline-block;
  margin: auto 0;
  width: 100%;
}

/* .logo {
  float: left;
  width: 3%;
  margin-right: 20px;
} */

#searchBar {
  margin: 0 auto;
  width: 30%;
  padding: 5px 10px;
  font-size: 1rem;
  border: 1px solid #a1a1a1;
}

.help-icon {
  background-color: #eeeeee;
  width: 20px; 
  padding: 2px 0px;
  border: 1px solid #a1a1a1;
}

.resultstitle {
  margin-top: -40px;
}

.navlink {
  display: inline-block;
  margin-right: 10px;
  color: #000;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 700;
}

.home-icon {
  margin: 0 auto;
  width: 20px;
}

/* SEARCH RESULTS */

.searchresults {
  margin: 100px 30px 0 0;
  float: right;
  width: 70%;
  border: 1px solid #a1a1a1;
}

.results {
  margin: 0 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1.5fr 2fr .8fr;
  grid-template-areas: 
      'label label label'
      'painting painting painting';
}

.results > h3 {
  margin: 10px 0;
  display: inline-block;
  width: 100%;
  padding: 10px 0;
  border: 1px solid #a1a1a1;
}

#paintingList {
  margin: 0 0 10px;
  display: grid;
  grid-area: painting;
  grid-template-columns: 100%;
  grid-gap: 10px;
  padding: 0;
}

.painting {
  list-style-type: none;
  border: 1px solid #a1a1a1;
  display: grid;
  grid-template-columns: 1.5fr 2fr .8fr;
  grid-template-areas: 
      'info palette checkbox';
}

.paintingimg {
  float: left;
  margin-left: 10px;
  max-width: 80px;
  max-height: 80px;
}

.painting > p {
  grid-area: info;
  margin: auto 0;
}

.info {
  margin: auto 0;
  grid-area: info;
  display: inline;
  margin-left: 100px;
  text-align: left;
}

.painting > .palette {
  margin: auto auto;
  grid-area: palette;
}

.box {
  float: left;
  margin: 20px 5px;
  width: 60px;
  height: 60px;
}

.painting > #checkbox {
  margin: auto auto;
  grid-area: checkbox;
}

/* COMPARE PANEL */

.compareresults {
  margin: 100px 0 0 50px;
  float: left;
  width: 15%;
  border: 1px solid #a1a1a1;
}

.compare {
  margin: 0 20px;
  border: 1px solid #a1a1a1;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas: 
      'image info buttons';
}

#compareList {
  margin: 0 0 10px;
  display: grid;
  grid-area: painting;
  grid-template-columns: 100%;
  grid-gap: 10px;
  padding: 0;
}

.comparebutton {
  background-color: #eeeeee;
  margin: 10px auto;
  padding: 5px 10px;
  font-size: 0.8rem;
  border: 1px solid #a1a1a1;
}

#searchbutton {
  margin: 0px auto;
  font-size: 1rem;
}

/* RADAR CHART */

.legend {
  font-family: 'Lato', sans-serif;
  fill: #333333;
}

.tooltip {
  fill: #333333;
}

.radarchart {
  display: inline-block;
}

.radarChart {
  display: inline-block;
}

.paintingsidebar {
  display: inline-block;
}

