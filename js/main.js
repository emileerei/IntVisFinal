const paintingList = document.getElementById("paintingList");
const searchResultString = document.getElementById("searchString");
const searchBar = document.getElementById("searchBar");
let paintingDatabase = [
  { name: "Gaspar Rem", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-75", technique: "Oil on canvas", id: "1", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "Venus and Adonis", artist: "AACHEN, Hans von", timeline: "1601-1650", date: "1574-88", technique: "Oil on canvas", id: "2", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647623348615/versions/686602864615/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!Hvj2n-Cg8VnAFpXLaQRX6KnTk4gonGq1MfmkIXW8z5f8yb8dyxMSeFIZzH4pSmX7orCtFgwo-6GQitCJumdbQZr33N4dr5y1al_2PXbEwvfFhvDw2ASsyPmL7UJUrBn0STtpMnlLZ3hPb2L7-lDndA6OrlCq1h08KCDz-pq_H2dZg3einPd1Lq83jqvcbu1_x_gLsCj0s5USAJEdM7X8DO15ldqs_LKXfcguRsPhYzajSY6pNATEJ1p2At6DQsTVFlsrnHhIiN95JLGRzWqsB8a70ceT5y43oliG8mq_0NQCevBpqix0lVomf4YbJMHpSOFNlCK1ncOEidIy-PHcwHN-DukTZLKMCKKxqLlxuHHAH9u-3O1825_KFiga2rNJl0b0MAzQhANW-91rKr5fWSvPeOoEmaOyid_gqn-51XlMZX5tULSqcbOcj50KpJyuI8P9DP3ZDPzf8zTUZv57N-NdPR2IZX2QOhrhqfPS-lKRrw_K-6TNf7vsbhaYUTljdV4Qi-p1D31WwPCeBtSfGGxYQvekpUYw8_NFW01T_Gq2Rogq2OtnMZsjfteKR80Mqg..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "The Rose Garden", artist: "AAGAARD, Carl Frederik", timeline: "1851-1900", date: "1877", technique: "Oil on canvas", id: "22", palette:["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647634762052/versions/686614596052/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!iB0Z0SxLKaSw7SciA_syhvD2iowCgHyDs5ZvMhc7xBdm_oonZ1y-ht1Llm_8uT4u1L1edZvpwW_2v9yo23XXkRWayBg1DBM_w4lQOB_1aJ499I5i6JeJ5ZEUNHbwT_pfg49tcOUacZOGvhUoqUFSebocZkZ5swPcyGL48tfnSk5nR56x-N0r2uRLZMcnFXVmR-hfePqDJorQbBBq1e4VNXp_EVwuAuY21uTn4wco848zu2h_ODeof_Wk_dlDVD1DQqaQfYEeVplF1odfclkFQjc_5IjlOD7NojAjaVtdRVoCDXNJPFDEN2N_3nfdAwOdO_YWJH-GGTAXkcDXNud1vGnp4bMWRSBJaPKUduTFOQyg6nwY0WCYDp40KJgORxF9qbmk_5QbS-P_ULbF3L-PPMl2qjeQclsMrb0AxSB7VMENZSc3HJqORwsYn4JmAdBkBMTvzD2yJbYYvMFH--wgtSVok1sFZ8h8EUsdI7TAul_ny-XUL5lhyRymZNevw0iG0WRDg6v0j590L0-WKsdMzIbl_KNKGnU09ovzbr4q-1ZaXZBVleHQQYQJkNe8ln7YPw..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "The Archangel Michael", artist: "ABADIA, Juan de la", timeline: "1451-1500", date: "c. 1490", technique: "Wood", id: "24", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647609415977/versions/686589576377/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!sZE8E1YS_AelRKEum22-ZvMgzgz2MBRBmWahYSln2co3jJEVvdO6Sn45ubOdDQj8WAo6EgHwzq1TnIg0Wxq_SOqtpKyuzm-WB4Jmc8b9w53vaQ4b9FZfsKBxnpNQb3xIvF5PNeQhCN5AlUzYI6puTTdpC2oYiImsuz7aRp0sy3wSVrY-Km7tKECoj_Cq5BrSCf0VXIpWIQUxcETilG9JG2zYQdhnQaYG1bTj9ftt_d0kRCRnHM7p7vBGU0asTEfcnwvxmhOyK1pbeU24Y1Zn_dSBlqRFdZDePqY-Q9plNX9G_KXk5cqJ9_3RHPB2JznE80fTxlKu7-TIVZFpwXwHPVpx-Oj5mhRzNDJaF7uUBbGgdfb3Hbzq_2-vGnUQdVOvLZ4hSQPzb-Hs6FqNlQrot3gLdpACERBVZRUOdCJUg7Dkq0ucTfLy1YhJRUQmsjGT1-PaColDpw_wKLFCNZO5bywgofxVvOcpPz-cyKiwTHjdEXwHr0LLZiIRUi5XdfnZXt74vVVv5EsC56gIGcWkYk_lFQwdn8h1SAiYdaJ9GDmj7EHBdUbJ9evtzYTWtk3weg..&box_client_name=box-content-preview&box_client_version=2.37.0"},
  { name: "Man with Parrot", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1540s", technique: "Oil on canvas", id: "25", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647619368376/versions/686598953976/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!MHElYypab1M3lX7C0-5TTPLcAS1OZ-kANi30m2xCojITTD8jqF-NQGU6HpbXNXpX8aq4k-ECkcU9EGQTVHidjPZx9qdEcrEKi0aiRXjduPHE5cLlrp3oN3hc-5yTg_FcJjHX387Gq_YHzHr1tbawJ47SD8GHwEGOYSgxPDeofYB4PbmiC05yWuyv7RTfWzPkcnKr3gom8moyVv5ExR9DdopSt8ZgoVqfLWzbDFSciVbTgbguys4BQRCMawl4iLOscRYN8-FwtMywm7PXbR99edDHSfNGPHxk2I2Y-FhefT3sAQgSvxSpGCZDiVNiE69G8DQJ_vXjbYOciFCUSURIluf3FYfPIYB7T2NFVVojMmV4ZNBBKJNYYyUFvktu3vDouRgTXTbUsFcXoqc_j1gM98B7IztwQlox_sbClE5sIeo53ZkeqIb1QL0bBbCyTzvE4Oiy1pPR4R2O8_2QWUepbvG63rDPKGEFBdgDKf0coshUyH1-9nRznhbfjAIAbzLLNxo0vG_rbfmr9PAmfn6JaKe27Pwz4eIz7kmo7nu-3_dmNnI0TK2DHovobzOevOwI2A..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , { name: "Portrait of a Gentleman with a Falcon", artist: "ABBATE, Niccolò dell", timeline: "1501-1550", date: "1548-50", technique: "Oil on canvas", id: "27", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647620192233/versions/686599617033/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!gusIi3lrzbdYMz4qhMcLsf_CbwsPU9i5_H2WSUQX949sX7ww79g5oFyKCWRwKo7qCTRjqr7bs-APLibQIuiQcLljU98_TnoLnWVPrE6YPixGb2CGn62hO_Vf77FNHFTecolp9obtK3EK0kJGuXqUrSYWlJ3-ZoEKrWtjM_NMjExSweoUVhf18NE4r0MubueQybWZvUt3MYtJqg5a0InO6TkJ7jV2f6aRasFhGh0_HxbkCr_ODLo5rtEtP5IEaGzrU0yndTW4GvF21FO0zv2fqGhsko5FY2iqJPhfVLiO4vyB58pXLRrRtNVQ6REl9qL8GQrRYjWreGlBfaYBy71tX0WTi_7NOMvcRP4Gso2cFACmMzdAVCpO0Sw3tuUFloBalGicGqg1XzOdowXQkClxHiylMrtfUr6rGh_ZRXzYVAUMukqokgWIBhelwi_oalVwaFPGYIK4AXhxq_6dPTtZ1a16WsXchl8w1X8zEz3hbaJx3E7ucARNLQC-qa9ee-n4M3yB2LBGXcJJFhk6xqc0ZOinW6FYPtMBbFgRLEu4mMvVT-LWV_WnHEHKtNMJ4IfyEg..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , { name: "The Wounded Philoctetes", artist: "ABILDGAARD, Nicolai", timeline: "1751-1800", date: "1775", technique: "Oil on canvas", id: "43", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647625738805/versions/686605482805/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!_RwvpDNdf-81KANGRa6e6mc1_8VXro_usFAlzKE8HeonpRTLCvJkHtjLRvYWce6i0WC1FEiCZtkcv999gPq1bEAl7iZH_Bjd25l-TCehlpehZGo7IVEVE1Cg2cFC2BbFRQbU35fBLv4Uc0drSyc7Yl_ShpucGMHfHsUbZttFA723HRs-auPTbRR_kVjSUtgUhnZuMmy5sb_NZ9yCBqCP_FpLlqz7YGGoSvNic6yUGBcjuRQrbMz7BqhJ_qukpSdrdZpERrLE9WJEfaTb20TneuWaou2C4AYU6hMMttoJc3kh_voRoMJ7FN1cCk7pHKq0-e-UchjrlDb8xaf9_YP37AW0Nyr7LzJCRF3zZVMhlKPNERRkfscF1SLwaWKkJzsSq5YLY4WqRTBh7Le2EQz0YLV5YjuNmzevV1qDV5I6fAStTEofSvgvpfiixjm7EvsOV6-jRkVAAOKS0Z2W_4YLN8fulLlQDBtzgtg_FK4WzEVfaVjkh-L4hJRmRHEsy-4qnKGgOYWgl0cXaqcVELrhbfTZyMcjO9KX3KhT-3kRujzFg5G9O2KhgcWHprWZerSnqA..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , { name: "Fireworks in Naples", artist: "ACHENBACH, Oswald", timeline: "1851-1900", date: "1875", technique: "Oil on canvas", id: "47", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647632950390/versions/686612612790/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!0VsaTCul0QnIxVwGiyx0AZZK5rGm961N8uY00dPifLZSSrVzYGMzdrRmo5nahMQPssfJZCvYydg4D5FgBllDLiEjntUr3XhJ10vIiWtrcTr2Lf1ZCVts_ET1MsEefwjxxWZQxU3TfinjRAsxSeFsdsENQgQlDubMUI3CQZO2c9IStmY5guaSSVlH8zJdVvn81nfIuRwW0I19a-QhWwex0q32ExfeY9A19sDzdwzkGfkzkCHwgj9fgmmes6XRf-H7olZwWCSk63IhZOGB4ETRHzXbzHLYXU8tvTq8jOfjJVDnU_LOPpuFuch0eS87Zn1fzUt_VjX6TzkywK7kKe2zlgS6XzgHdvVYFXDsNWTnB2_Y_vcfmSvfVyqkrglm-rDm1-War045efaPYzBOsflRlDtak3KZxoyEPMZorH3dqRWF9fs84PqvbD03_Yx8nWg_LPB-cBaCON4OFpw05pQYMe4tWuLMPRJDZVeB7uQHfpjeoDpJZtS4zD9JL9bl4RFf4jZwSegLGd_rtFHgbC_y8ZKIiAFdmowkbHuSyuPLha3wgpqe3waUgPpITVNDzebvkA..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , { name: "Battle of Moscow on 7 September 1812", artist: "ADAM, Albrecht", timeline: "1801-1850", date: "1815-25", technique: "Oil and gouache", id: "48", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647609469977/versions/686589633977/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!E1jxV65PjdOoAzmDEN6Wt2fq5YQerVkWivuKOFwb_quB-rpahrUEDe9sx0edsRS9NPTj3snWJVM4gEuaYzm1nutR_lZ-Mh-avjKc0E_Pn3dWpWKB-F0yBK88uLl380eXVfTq3yB9LPSBh2ttRuLLL_AV0f92iusUKRQconAATceyJKA8sxHGoakxTF1JAax76o3uPfTa6e8MHAME-zceVx5hycK2Q63I07GP0SAktm02xnuM0bymS8lB3c9CXeGh4kft2Ox2daiGtXcxPiUWO_oVOH_O5x6merrOgV6wtsMtM1OpGHRs8h0CKKV0rTo14JWjpHnLc4HNOCuOlVW-i-WD_KMUqF0FuMdpQtdHxC2htHWHt_7IPkxkhliyGUkfNmzKmZMqcIC4npiH-0R2I7m37rdhP6OYatY61EFDEla8IozycSbPYItSIiJ5tiyzxmyKsdiY1ZxO-XwBunAlGznZ0oUTokXT3RA2CIigAehtxAeF2fqe7gQPGV3-hBWNNu4UW12hO8egdECay8uzQqJdoeKd9PMzXZELEl6K1vhziHx5klmbEVKJQySMGxcivA..&box_client_name=box-content-preview&box_client_version=2.37.0"}
  , { name: "Fish and Dead Game", artist: "ADRIAENSSEN, Alexander", timeline: "1601-1650", date: "1643", technique: "Oil on canvas", id: "64", palette: ["#aaa", "#bbb", "#ccc", "#ddd", "#eee"], img: "https://dl.boxcloud.com/api/2.0/internal_files/647621656352/versions/686601330752/representations/jpg_paged_2048x2048/content/1.jpg?access_token=1!ReA4mIr3Gqofr01MCHlyD5JDgYj7AJ_oeL2NbpzS6q-bVOWNNZeBjEKb5OYuiWBs9c0aCSkwdqPcdz7WzLZyKZsP2LzyJfzvHqHvdJvnCtdBB4yDAm8dHg0_cJF3w3yuDI3R_ZokC6hy3iUD5bk-KRM85HpyN9qUikMqYOuwftbqzkkuLuHGLyjX0dds6Fo0a4ilZUXOA94gZ9131uB-UUIADmvcoInim6ym90J8MaX84z5bKAFnW5hwdVCptZGqGQ-A5i5yZ9K81sjX6xOGfGmjSME-Vu02Cr39BkBnYz5ZM5R5oRn6mDVgeh6Ndxgb18xRpLa7SaEXUrS_dofeoJ4_efLqXjT9-aK7XJx6roQfWQzOnNolSTOyUyzxNTkirwBRwlqyn8lnrD3t-cjAZ39b2ziLWab71kvsMQSccPOtCbtNwh0d6zCOxkpyYeGQb0ef8Yqr7KIv0J68Hz6Oc9oHoDuV0RZgtXeBUMOAZ-8frNSRYv79rlTFjvWQAYe4QJVNezZvec-vXZU6KM6N3pW0nqG8cHuY1RQh_r25iv_fs5oqC1ZJE-8LWXgBTKSUaA..&box_client_name=box-content-preview&box_client_version=2.37.0"}];

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