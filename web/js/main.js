const paintingList = document.getElementById("paintingList");
//const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
const compareList = document.getElementById("compareList");

// For only a few images per page
// TODO: make it configurable
var perPage = 30; // const
var pageNum = 0;

function setPage(num) {
  pageNum = num;
  parseSearchResults();
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "/data/json2/combined.json", false);
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

// Makes the search area pagified
function populatePageLinks(total) {
  var pageLinkDiv = document.getElementById("pageLinks");

  // Remove all existing children
  while (pageLinkDiv.firstChild) {
    pageLinkDiv.removeChild(pageLinkDiv.lastChild);
  }

  // Add text / dropdown box maybe
  var t = document.createTextNode(total + " Results (" + perPage + " per page)");
  pageLinkDiv.appendChild(t);

  var whitespace = document.createElement("br");
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
    var whitespace = document.createTextNode("\t");
    pageLinkDiv.appendChild(whitespace);
  }
}

function filterKeyword(db, filter, keyword, exact_match) {
  if (exact_match) {
    return db.filter((painting) => {
      return painting[keyword].toLowerCase() == filter;
    });
  }
  else {
    return db.filter((painting) => {
      return painting[keyword].toLowerCase().includes(filter);
    });
  }
}

// Returns only the elements of db that pass the filter. Filters can have 
//   keywords (xyz:foo) but in general we search against title and author
//
// TODO: negation, add in the ability for OR, maybe make it search exact/not
//   just contains, etc. [low priority]
function filterDB(db, filter) {
  let final = [];

  // Keywords
  if (filter.startsWith("title:")) {
    return filterKeyword(db, filter.replace("title:", ""), "title", false);
  }
  else if (filter.startsWith("artist:")) {
    return filterKeyword(db, filter.replace("artist:", ""), "author", false);
  }
  else if (filter.startsWith("timeline:")) {
    return filterKeyword(db, filter.replace("timeline:", ""), "timeline", false);
  }
  else if (filter.startsWith("technique:")) {
    return filterKeyword(db, filter.replace("technique:", ""), "technique", false);
  }
  else if (filter.startsWith("type:")) {
    return filterKeyword(db, filter.replace("type:", ""), "painting_type", false);
  }
  else if (filter.startsWith("date:")) {
    return filterKeyword(db, filter.replace("date:", ""), "date", false);
  }
  else if (filter.startsWith("id:")) {
    //return filterKeyword(db, filter.replace("id:", ""), "id", true);
    // This is an int so requires something a bit special
    return db.filter((painting) => {
      return painting["id"] == Number(filter.replace("id:", ""));
    });
  }
  else if (filter.startsWith("iter:")) {
    // This is an int so requires something a bit special
    return db.filter((painting) => {
      return painting["iterations_taken"] == Number(filter.replace("iter:", ""));
    });
  }
  // General Search
  else {
    final = db.filter((painting) => {
      return painting.title.toLowerCase().includes(filter) || 
             painting.author.toLowerCase().includes(filter);
    });
  }

  return final;
}

function parseSearchResults() {
  //const searchString = e.target.value.toLowerCase();
  const searchString = searchBar.value.toLowerCase();
  //searchResultString.innerHTML = `Search Results for "${searchString}"`;
  // we split the string provided by the user into an array of individual searches
  const parsedString = searchString.split(" ");
  let filteredPaintings = paintingDatabase;

  parsedString.forEach(filter => {
    filteredPaintings = filterDB(filteredPaintings, filter);
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
  // slice, update index
  const htmlString = paintings
    .map((painting) => {
      return `
      <li class="painting">  
      <p>
      <img class="paintingimg" src="${painting.local_img}"
      title="ID: ${painting.id} - Click to view full size" onclick="javascript:window.open('${painting.local_img}', 'Image');" 
      >
        <div class="info">
        <p class="paintingSearchMainText">
        <strong>${painting.title}</strong> <br />  <span style="font-size:0.8rem"><i>${painting.author} (${painting.date})</i></span>
        </p> 
        <small><p class="paintingSearchTechniqueText">${painting.technique}</p></small></div></p>
        <div class="palette">
          <div style="background-color:${painting.palette[0]}" class="box" ><span class="tooltiptext">${painting.palette[0]}</span></div>
          <div style="background-color:${painting.palette[1]}" class="box" ><span class="tooltiptext">${painting.palette[1]}</span></div>
          <div style="background-color:${painting.palette[2]}" class="box" ><span class="tooltiptext">${painting.palette[2]}</span></div>
          <div style="background-color:${painting.palette[3]}" class="box" ><span class="tooltiptext">${painting.palette[3]}</span></div>
          <div style="background-color:${painting.palette[4]}" class="box" ><span class="tooltiptext">${painting.palette[4]}</span></div>
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
      if (event.target.checked) {
        updated = addComparisons(event.target.id, selections);
        updated[0]["selected"] = true;
        selections = [updated];
        localStorage.setItem('current-comparisons', JSON.stringify(updated));
        displayComparison(updated);
      } else {
        updated = removeComparisons(event.target.id, selections);
        if (updated[0]) {
          updated[0]["selected"] = true;
        }
        selections = [updated];
        localStorage.setItem('current-comparisons', JSON.stringify(updated));
        displayComparison(updated);
      }
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
        <div class="info"><strong>${pid.title}</strong> <br /> <span style="font-size:0.8rem"><i>${pid.author}</i></span></div></p>
        <input type="checkbox" class="checkbox" id=${pid.id} name="checkbox" value="compare">
      </li>
    `;
    })
    .join("");
  compareList.innerHTML = htmlString;
}

function helpPopupFunction() {
  var popup = document.getElementById("helpPopup");
  popup.classList.toggle("show");
}


// For updating
window.onload = function setup() {
  console.log("Loaded");
  this.parseSearchResults();

  // TODO: update the comparison list here!

  // TODO: make the pagenum local storage and load it between page swaps
}
