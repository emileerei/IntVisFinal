const paintingList = document.getElementById("paintingList");
const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
const compareList = document.getElementById("compareList");

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
  const parsedString = searchString.split(" ");
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
  console.log(paintings);
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
        <input type="checkbox" class="checkbox" id=${painting.id} name="checkbox" value="compare">
      </li>
    `;
    })
    .join("");
  paintingList.innerHTML = htmlString;
};

var selections = [];
document.body.addEventListener('change', function(e) {
  console.log(e.target);
  var checkboxes = document.querySelectorAll('input[type=checkbox]');
  for (var checkbox of checkboxes) {
    var updated;
    checkbox.addEventListener('change', function(event) {
      if (event.target.checked) {
        updated = addComparisons(event.target.id, selections);
        selections = [updated];
        displayComparison(updated);
      } else {
        updated = removeComparisons(event.target.id, selections);
        selections = [updated];
        displayComparison(updated);
      }
    })
  }
}, false);

function addComparisons(id, selected) {
  selected.push(paintingDatabase.filter((painting) => {
    return painting.id == id;
  }));

  var updated_selections = [];
  selected.forEach(arr => {
    arr.forEach(e => {
      if (!updated_selections.includes(e)) {
        updated_selections.push(e);
      }
    });
  });
  selected = updated_selections;
  return updated_selections;
}

function removeComparisons(id, selected) {
  var updated_selections = [];
  selected.forEach(arr => {
    arr.forEach(p => {
      if (p.id != id && !updated_selections.includes(p)) {
        updated_selections.push(p);
      }
    })
  });
  selected = updated_selections;
  return updated_selections;
}

const displayComparison = (ids) => {
  const htmlString = ids
    .map((pid) => {
      return `<li class="compares">   
        <p>
        <div class="info"><strong>${pid.title}</strong> <br /> ${pid.author}</div></p>
      </li>
    `;
    })
    .join("");
  compareList.innerHTML = htmlString;
}