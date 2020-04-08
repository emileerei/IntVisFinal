const paintingList = document.getElementById("paintingList");
const searchBar = document.getElementById("searchBar");
let paintingDatabase = [
  {name: "Gaspar Rem", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-75", technique: "Oil on canvas"},
  {name: "Venus and Adonis", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-88", technique: "Oil on canvas"},
  {name: "The Rose Garden", artist: "AAGAARD, Carl Frederik", timeline: "1851-1900", date: "1877", technique: "Oil on canvas"},
  {name: "The Archangel Michael", artist: "ABADIA, Juan de la", timeline: "1451-1500", date: "c. 1490", technique: "Wood"},
  {name: "Man with Parrot", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1540s", technique: "Oil on canvas"},
  {name: "Portrait of a Gentleman with a Falcon", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1548-50", technique: "Oil on canvas"},
  {name: "The Wounded Philoctetes", artist: "ABILDGAARD, Nicolai", timeline: "1751-1800", date: "1775", technique: "Oil on canvas"},
  {name: "Fireworks in Naples", artist: "ACHENBACH, Oswald", timeline: "1851-1900", date: "1875", technique: "Oil on canvas"},
  {name: "Battle of Moscow on 7 September 1812", artist: "ADAM, Albrecht", timeline: "1801-1850", date: "1815-25", technique: "Oil and gouache"},
  {name: "Fish and Dead Game", artist: "ADRIAENSSEN, Alexander", timeline: "1601-1650", date: "1643", technique: "Oil on canvas"}
];

searchBar.addEventListener("keyup", e => {
  const searchString = e.target.value.toLowerCase();
  // we split the string provided by the user into an array of individual searches
  // const parsedString = searchString.split(" ");
  const parsedString = parseString(searchString);
  let fp = [];
  parsedString.forEach(element => {
    if( element.startsWith("name:") ) {
      fp.push(paintingDatabase.filter(painting => {
        return (
          painting.name.toLowerCase().includes(element.replace("name:", ""))
        );
      }));
    } else if( element.startsWith("artist:") ) {
      fp.push(paintingDatabase.filter(painting => {
        return (
          painting.artist.toLowerCase().includes(element.replace("artist:", ""))
        );
      }));
    } else if( element.startsWith("timeline:") ) {
      fp.push(paintingDatabase.filter(painting => {
        return (
          painting.timeline.toLowerCase().includes(element.replace("timeline:", ""))
        );
      }));
    } else if( element.startsWith("technique:") ) {
      fp.push(paintingDatabase.filter(painting => {
        return (
          painting.technique.toLowerCase().includes(element.replace("technique:", ""))
        );
      }));
    } else {
      fp.push(paintingDatabase.filter(painting => {
        // possibly add timeline, technique, and date
        return (
          painting.name.toLowerCase().includes(element) ||
          painting.artist.toLowerCase().includes(element)
        );
      }));
    }
  });

  // we combine the array of arrays we have gathered from the filtering for each of the search strings
  let filteredPaintings = [];
  fp.forEach(arr => {
    arr.forEach(painting => {
      console.log(painting);
      filteredPaintings.push(painting);
    });
  });

  displayPaintings(filteredPaintings);
});

const displayPaintings = (paintings) => {
  const htmlString = paintings.map((painting) => {
    return `
      <li class="painting">
        <p>${painting.name}</p>
        <p>${painting.artist}</p>
      </li>
    `;}).join('');
  paintingList.innerHTML = htmlString;
};

function parseString(searchString) {
  const parsedString = searchString.split(" ");

  return parsedString;
}