/*------------------------------------------------------------------------------
    This file handles all the CSV input
------------------------------------------------------------------------------*/

use crate::autopalette::kmeans;
use crate::hist::normalized_hist_vector;
use crate::utils::{bgr_mat_to_hsv_and_lab_vecs, MAX_IMG_SIZE};
use csv::Reader;
use opencv::core::{Mat, MatTrait, MatTraitManual, Size};
use opencv::imgcodecs::{imread, IMREAD_COLOR};
use opencv::imgproc::{resize, INTER_AREA};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

// input from the CSV file
// ID,AUTHOR,TIMELINE,DATE,TITLE,TECHNIQUE,TYPE,URL
#[derive(Debug, Serialize, Deserialize)]
struct Record {
    id: u32,
    author: String,
    timeline: String,
    date: String,
    title: String,
    technique: String,
    painting_type: String,
    url_wga_info: String,
}

// Get the image from the url
// record.url = "https://www.wga.hu/html/a/azeglio/arabs.html"
// becomes =>>> "https://www.wga.hu/art/a/azeglio/arabs.jpg"
fn url_to_image(url: String) -> String {
    let url = url.replace(".html", ".jpg");
    let url = url.replace("/html/", "/art/");
    url
}

fn load_small_img(filename: &String) -> Mat {
    let img_full = imread(&filename, IMREAD_COLOR).unwrap();

    let w = img_full.size().unwrap().width;
    let h = img_full.size().unwrap().height;

    let max = w.max(h);
    if max > MAX_IMG_SIZE {
        let scaling_factor = MAX_IMG_SIZE as f64 / max as f64;
        //eprintln!("scaling_factor = {:?}", scaling_factor);
        let mut img_scaled = img_full.clone().unwrap();
        resize(
            &img_full,
            &mut img_scaled,
            Size::default(),
            scaling_factor,
            scaling_factor,
            INTER_AREA,
        )
        .expect("ERROR: Resize failed");
        return img_scaled;
    } else {
        //eprintln!("no scaling");
        return img_full;
    }
}

// Converts the record struct into a JSON object & adds the color info
fn record_to_json(record: Record) -> (i64, Value) {
    let mut obj = json!(&record);

    obj["url_wga_jpg"] = json!(url_to_image(record.url_wga_info));

    // Local image filename
    let artist_first_letter = record
        .author
        .chars()
        .nth(0)
        .unwrap_or('x')
        .to_ascii_lowercase();
    let local_filename = format!("/images/{}/{}.jpg", artist_first_letter, record.id);
    let testing = format!("images/{}/{}.jpg", artist_first_letter, record.id);
    obj["local_img"] = json!(local_filename);

    // Start the timer
    let start = chrono::Utc::now();

    // Compute the color information
    let img_bgr = load_small_img(&testing);

    if let Some((vec_hsv, vec_lab)) = bgr_mat_to_hsv_and_lab_vecs(&img_bgr) {
        let (iters, palette) = kmeans(&vec_hsv, &vec_lab);
        obj["palette"] = json!(&palette);
        obj["num_iterations"] = json!(iters);

        let radar = normalized_hist_vector(&vec_hsv);
        obj["radar"] = json!(radar);
    }

    // Finish up
    let time_elapsed = (chrono::Utc::now() - start).num_seconds();
    obj["time_elapsed"] = json!(time_elapsed);
    let pretty = serde_json::to_string(&obj).unwrap();
    println!("{}", pretty);

    (time_elapsed, obj)
}

// Converts the given CSV file into a JSON file and returns the string form of it
pub fn load_csv(csv_loc: &str) -> String {
    eprintln!("START: {}", csv_loc);

    let mut rdr = Reader::from_path(csv_loc).expect("ERROR: invalid CSV path");
    let records: Vec<Record> = rdr
        .records()
        .filter(|x| x.is_ok())
        .map(|x| x.unwrap().deserialize(None).unwrap())
        .collect();

    let mut objects: Vec<Value> = Vec::new();

    let mut curr = 0;
    let total = records.len();

    for r in records {
        eprintln!("Processing {} / {}: {} - {} ({})", curr, total, r.author, r.title, r.id);

        let (time, obj) = record_to_json(r);
        objects.push(obj);

        eprintln!("Finished after {} seconds\n", time);
        curr += 1;
    }

    serde_json::to_string_pretty(&objects).unwrap()
}
