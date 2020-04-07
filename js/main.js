const paintingList = document.getElementById("paintingList");
const searchBar = document.getElementById("searchBar");
let paintingDatabase = [
  {name: "The Starry Night", artist: "Vincent van Gogh"},
  {name: "Starry Night", artist: "Vincent van Gogh"}
];

searchBar.addEventListener("keyup", e => {
  const searchString = e.target.value.toLowerCase();
  
  const filteredPaintings = paintingDatabase.filter(painting => {
    return (
      painting.name.toLowerCase().includes(searchString) ||
      painting.artist.toLowerCase().includes(searchString)
    );
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
