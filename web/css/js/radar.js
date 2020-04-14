const paintingList = document.getElementById("paintingList");
const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
let paintingDatabase = [
  { name: "Gaspar Rem", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-75", technique: "Oil on canvas", id: "1", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/9/98/Hans_von_Aachen_-_Portrait_of_the_painter_Gaspar_Rem.jpg"},
  { name: "Venus and Adonis", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-88", technique: "Oil on canvas", id: "2", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://media.getty.edu/museum/images/web/enlarge/00103001.jpg"},
  { name: "The Rose Garden", artist: "AAGAARD, Carl Frederik", timeline: "1851-1900", date: "1877", technique: "Oil on canvas", id: "22", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/4/4f/The_Rose_Garden-Carl_Aagaard.jpg"},
  { name: "The Archangel Michael", artist: "ABADIA, Juan de la", timeline: "1451-1500", date: "c. 1490", technique: "Wood", id: "24", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Michael_abadia.jpg"},
  { name: "Man with Parrot", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1540s", technique: "Oil on canvas", id: "25", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/0/03/NdellAbateViennaportrait.jpg"}
  , { name: "Portrait of a Gentleman with a Falcon", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1548-50", technique: "Oil on canvas", id: "27", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://media.artgallery.nsw.gov.au/collection_images/1/167.1991%23%23S.jpg"}
  , { name: "The Wounded Philoctetes", artist: "ABILDGAARD, Nicolai", timeline: "1751-1800", date: "1775", technique: "Oil on canvas", id: "43", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Den_s%C3%A5rede_Filoktet.jpg/250px-Den_s%C3%A5rede_Filoktet.jpg"}
  , { name: "Fireworks in Naples", artist: "ACHENBACH, Oswald", timeline: "1851-1900", date: "1875", technique: "Oil on canvas", id: "47", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Oswald_Achenbach_001.jpg"}
  , { name: "Battle of Moscow on 7 September 1812", artist: "ADAM, Albrecht", timeline: "1801-1850", date: "1815-25", technique: "Oil and gouache", id: "48", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Battle_of_Moscow_7_Septembr_1812_year.jpg"}
  , { name: "Fish and Dead Game", artist: "ADRIAENSSEN, Alexander", timeline: "1601-1650", date: "1643", technique: "Oil on canvas", id: "64", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://upload.wikimedia.org/wikipedia/commons/1/10/Alexander_Adriaenssen_-_Fish_and_Dead_Game_-_WGA0033.jpg"}];

searchBar.addEventListener("keyup", e => {
  const searchString = e.target.value.toLowerCase();
  searchResultString.innerHTML = `Search Results for "${searchString}"`
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
      // makes sure there are no duplicates in final array
      if( !filteredPaintings.includes(painting) ) {
        filteredPaintings.push(painting);
      }
    });
  });

  displayPaintings(filteredPaintings);
});

const displayPaintings = (paintings) => {
  const htmlString = paintings.map((painting) => {
    return `
      <li class="painting">   
        <p><img class="paintingimg" src="${painting.img}"></img> 
        <div class="info"><strong>${painting.name}</strong> <br /> ${painting.artist}</div></p>
        <div class="palette">
          <div style="background-color:${painting.palette[0]}" class="box"></div>
          <div style="background-color:${painting.palette[1]}" class="box"></div>
          <div style="background-color:${painting.palette[2]}" class="box"></div>
          <div style="background-color:${painting.palette[3]}" class="box"></div>
          <div style="background-color:${painting.palette[4]}" class="box"></div>
        </div>
        <input type="checkbox" id="checkbox" name="checkbox" value="compare">
      </li>
    `;}).join('');
  paintingList.innerHTML = htmlString;
};

function parseString(searchString) {
  const parsedString = searchString.split(" ");

  return parsedString;
}