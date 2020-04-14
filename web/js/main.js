const paintingList = document.getElementById("paintingList");
const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "/data/json/q.json", false);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

var paintingDatabase;
loadJSON(function (json) {
  paintingDatabase = JSON.parse(json);
});

searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  searchResultString.innerHTML = `Search Results for "${searchString}"`;
  // we split the string provided by the user into an array of individual searches
  // const parsedString = searchString.split(" ");
  const parsedString = parseString(searchString);
  let fp = [];
  parsedString.forEach((element) => {
    if (element.startsWith("title:")) {
      fp.push(
        paintingDatabase.filter((painting) => {
          return painting.title
            .toLowerCase()
            .includes(element.replace("title:", ""));
        })
      );
    } else if (element.startsWith("author:")) {
      fp.push(
        paintingDatabase.filter((painting) => {
          return painting.author
            .toLowerCase()
            .includes(element.replace("author:", ""));
        })
      );
    } else if (element.startsWith("timeline:")) {
      fp.push(
        paintingDatabase.filter((painting) => {
          return painting.timeline
            .toLowerCase()
            .includes(element.replace("timeline:", ""));
        })
      );
    } else if (element.startsWith("technique:")) {
      fp.push(
        paintingDatabase.filter((painting) => {
          return painting.technique
            .toLowerCase()
            .includes(element.replace("technique:", ""));
        })
      );
    } else if (element.startsWith("type:")) {
      fp.push(
        paintingDatabase.filter((painting) => {
          return painting.painting_type
            .toLowerCase()
            .includes(element.replace("type:", ""));
        })
      );
    } else {
      fp.push(
        paintingDatabase.filter((painting) => {
          // possibly add timeline, technique, and date
          return (
            painting.title.toLowerCase().includes(element) ||
            painting.author.toLowerCase().includes(element)
          );
        })
      );
    }
  });

  // we combine the array of arrays we have gathered from the filtering for each of the search strings
  let filteredPaintings = [];
  fp.forEach((arr) => {
    arr.forEach((painting) => {
      // makes sure there are no duplicates in final array
      if (!filteredPaintings.includes(painting)) {
        filteredPaintings.push(painting);
      }
    });
  });

  displayPaintings(filteredPaintings);
});

const displayPaintings = (paintings) => {
  const htmlString = paintings
    .map((painting) => {
      return `
      <li class="painting">   
        <p> 
        <div class="info"><strong>${painting.title}</strong> <br /> ${painting.author}</div></p>
        <div class="palette">
          <div style="background-color:${painting.palette1}" class="box"></div>
          <div style="background-color:${painting.palette2}" class="box"></div>
          <div style="background-color:${painting.palette3}" class="box"></div>
          <div style="background-color:${painting.palette4}" class="box"></div>
          <div style="background-color:${painting.palette5}" class="box"></div>
        </div>
        <input type="checkbox" id="checkbox" name="checkbox" value="compare">
      </li>
    `;
    })
    .join("");
  paintingList.innerHTML = htmlString;
};

function parseString(searchString) {
  const parsedString = searchString.split(" ");

  return parsedString;
}
