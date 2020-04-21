const paintingList = document.getElementById("paintingList");
//const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
const compareList = document.getElementById("compareList");

// For only a few images per page
// TODO: make it configurable
var perPage = 5; // const
var pageNum = 0;

function setPage(num) {
  pageNum = num;
  parseSearchResults();
}

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

function populatePageLinks(total) {
  var pageLinkDiv = document.getElementById("pageLinks");

  // Remove all existing children
  while (pageLinkDiv.firstChild) {
    pageLinkDiv.removeChild(pageLinkDiv.lastChild);
  }

  // Add text / dropdown box maybe
  var t = document.createTextNode(total + " Results (" + perPage + " per page):\t");
  pageLinkDiv.appendChild(t);

  var whitespace = document.createTextNode("\u00A0");
  pageLinkDiv.appendChild(whitespace);


  // Add all the links
  var numPages = total / perPage;

  for (var i = 0; i < numPages; ++i) {
    if (pageNum != i) {
      var a = document.createElement('a');
      var linkText = document.createTextNode("" + (i + 1))
      a.appendChild(linkText);
      a.title = "tooltip";
      a.href = "javascript:setPage(" + i + ")";
      pageLinkDiv.appendChild(a);
    }
    else {
      var linkText = document.createTextNode("" + (i + 1))
      pageLinkDiv.appendChild(linkText);
    }

    // Add a gap between links
    var whitespace = document.createTextNode("\u00A0");
    pageLinkDiv.appendChild(whitespace);


  }

}

function parseSearchResults() {
  //const searchString = e.target.value.toLowerCase();
  const searchString = searchBar.value.toLowerCase();
  //searchResultString.innerHTML = `Search Results for "${searchString}"`;
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
  populatePageLinks(filteredPaintings.length);

}

searchBar.addEventListener("keyup", (e) => {
  pageNum = 0;
  parseSearchResults();
});

// TODO: remove hardcoded palette[0] etc. to make it flexible and handle the whole list
// can replace painting.local_img with painting.img_url to download it from wga
// i have the images downloaded in images/*/*.jpg
const displayPaintings = (paintings) => {
  console.log(paintings);
  const htmlString = paintings
    .map((painting) => {
      return `
      <li class="painting">  
      <p>
      <img class="paintingimg" src="${painting.local_img}">
        <div class="info">
        <strong>${painting.title}</strong> <br /> ${painting.author}</div></p>
        <div class="palette">
          <div style="background-color:${painting.palette[0]}" class="box" title="${painting.palette[0]}"></div>
          <div style="background-color:${painting.palette[1]}" class="box" title="${painting.palette[1]}"></div>
          <div style="background-color:${painting.palette[2]}" class="box" title="${painting.palette[2]}"></div>
          <div style="background-color:${painting.palette[3]}" class="box" title="${painting.palette[3]}"></div>
          <div style="background-color:${painting.palette[4]}" class="box" title="${painting.palette[4]}"></div>
        </div>
        <input type="checkbox" class="checkbox" id=${painting.id} name="checkbox" value="compare">
      </li>
    `;
    })
    .slice(pageNum * perPage, pageNum * perPage + perPage)
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
        updated[0]["selected"] = true;
        selections = [updated];
        localStorage.setItem('current-comparisons', JSON.stringify(updated));
        displayComparison(updated);
      } else {
        updated = removeComparisons(event.target.id, selections);
        updated[0]["selected"] = true;
        selections = [updated];
        localStorage.setItem('current-comparisons', JSON.stringify(updated));
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
        e["selected"] = false;
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
        p["selected"] = false;
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
        <img class="paintingimg3" src="${pid.local_img}">
        <div class="info"><strong>${pid.title}</strong> <br /> ${pid.author}</div></p>
        <input type="checkbox" class="checkbox" id=${pid.id} name="checkbox" value="compare">
      </li>
    `;
    })
    .join("");
  compareList.innerHTML = htmlString;
}


// For updating
window.onload = function setup() {
  console.log("Loaded");
  this.parseSearchResults();

  // TODO: update the comparison list here!
}