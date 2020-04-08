const paintingList = document.getElementById("paintingList");
const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
let paintingDatabase = [
  { name: "Gaspar Rem", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-75", technique: "Oil on canvas", id: "1", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "Venus and Adonis", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-88", technique: "Oil on canvas", id: "2", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "The Rose Garden", artist: "AAGAARD, Carl Frederik", timeline: "1851-1900", date: "1877", technique: "Oil on canvas", id: "22", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "The Archangel Michael", artist: "ABADIA, Juan de la", timeline: "1451-1500", date: "c. 1490", technique: "Wood", id: "24", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  {name: "Man with Parrot", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1540s", technique: "Oil on canvas", id: "25", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , {name: "Portrait of a Gentleman with a Falcon", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1548-50", technique: "Oil on canvas", id: "27", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , {name: "The Wounded Philoctetes", artist: "ABILDGAARD, Nicolai", timeline: "1751-1800", date: "1775", technique: "Oil on canvas", id: "43", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , {name: "Fireworks in Naples", artist: "ACHENBACH, Oswald", timeline: "1851-1900", date: "1875", technique: "Oil on canvas", id: "47", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , {name: "Battle of Moscow on 7 September 1812", artist: "ADAM, Albrecht", timeline: "1801-1850", date: "1815-25", technique: "Oil and gouache", id: "48", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , {name: "Fish and Dead Game", artist: "ADRIAENSSEN, Alexander", timeline: "1601-1650", date: "1643", technique: "Oil on canvas", id: "64", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"}];

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