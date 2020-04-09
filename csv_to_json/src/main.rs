use csv::Reader;
use serde::{Serialize, Deserialize};
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
    url: String,
}

// Get the image from the url
// record.url = "https://www.wga.hu/html/a/azeglio/arabs.html"
// becomes =>>> "https://www.wga.hu/art/a/azeglio/arabs.jpg"
fn url_to_image(url: String) -> Option<String> {
    if url.ends_with(".html") {
        let mut s = String::from(url.trim_end_matches(".html"));
        s.push_str(".jpg");

        if s.contains("html") {
            s = s.replace("html", "art");
            return Some(s);
        }
    }
    None
}

// Converts the record struct into a JSON object & adds the color info
fn record_to_json(record : Record) -> Value {
    let mut obj = json!(&record);

    // Can compute palettes here
    obj["palette1"] = json!("#AABBCC");
    obj["palette2"] = json!("#123456");
    obj["palette3"] = json!("#A1A1FF");
    obj["palette4"] = json!("#1H3A12");
    obj["palette5"] = json!("#BCB100");

    // Can compute radar details here
    obj["radarRed"] = json!(0.13 as f32);
    obj["radarOrange"] = json!(0.15 as f32);
    obj["radarYellow"] = json!(0.18 as f32);
    obj["radarGreen"] = json!(0.01 as f32);
    obj["radarBlue"] = json!(0.62 as f32);
    obj["radarPurple"] = json!(0.42 as f32);
    obj["radarGray"] = json!(0.23 as f32);

    obj
}

// Converts the given CSV file into a JSON file and returns the string form of it
fn parse(csv_loc: &str) -> String {
    println!("START: {}", csv_loc);

    let mut rdr = Reader::from_path(csv_loc).expect("ERROR: invalid CSV path");
    let records: Vec<Value> = rdr
        .records()
        .filter(|x| x.is_ok())
        .map(|x| x.unwrap().deserialize(None).unwrap())
        .map(|x| record_to_json(x))
        .collect();

    serde_json::to_string_pretty(&records).unwrap()
}

fn main() {
    //let s = parse("../csv/q.csv");
    //println!("s = {:?}", s);
    // TODO: can write to file
}
