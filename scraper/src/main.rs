use csv::Reader;
use serde::Deserialize;
use std::process::Command;
use std::thread::sleep;
use std::time::Duration;
use std::ops::Add;
use chrono::Timelike;

// A struct containing one line of the CSV data
// ID,AUTHOR,TIMELINE,DATE,TITLE,TECHNIQUE,TYPE,URL
#[derive(Debug, Deserialize)]
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

// Go through each line in the given csv file, extract the image url and then
// download it into the output_folder using wget and a small delay between
// downloads. The "skip" parameter enables us to resume the program later at
// an arbitrary starting point.
//
// Some general output about which file is currently being processed goes to
// stdout. Some overall remaining time based output goes to stderr. This makes
// it easy to pipe out the output into a log file and just display the estimated
// remaining time in the current terminal
// e.g.:    ./scraper > output.txt

fn parse_and_save(csv_loc : &str, output_folder : &str, skip : usize) {
    eprintln!("START: {}", csv_loc);
    println!("START: {}", csv_loc);

    // A vector of records
    let mut rdr = Reader::from_path(csv_loc).unwrap();
    let records: Vec<Record> = rdr
        .records()
        .filter(|x| x.is_ok())
        .map(|x| x.unwrap().deserialize(None).unwrap())
        .skip(skip)
        .collect();

    let total_paintings = records.len();
    let mut curr_painting = 1;

    for record in records {
        println!("{} / {}", curr_painting, total_paintings);

        // Remaining time debug output every 10 files (~ 1 minute between)
        if curr_painting % 10 == 0 {
            let est_remaining_secs  = (total_paintings as u64 - curr_painting as u64) * 6;
            let dur = Duration::from_secs(est_remaining_secs);

            let x = chrono::Local::now().add(chrono::Duration::from_std(dur).unwrap());
            let time_finished = format!("{}:{}", x.hour(), x.minute());

            eprintln!("Expected finish time: {} | {}  {} / {}", time_finished, csv_loc, curr_painting + 1, total_paintings);
        }

        curr_painting += 1;

        println!("record = {:?}", record);

        if let Some(image_url) = url_to_image(record.url) {
            let output_file = format!("{}{}.jpg", output_folder, record.id);

            println!("image = {:?}", image_url);
            println!("output_file = {:?}", output_file);

            // Download through wget and then sleep before continuing
            Command::new("wget")
                .arg(image_url)
                .arg("-O")
                .arg(output_file)
                .output()
                .expect("ERROR: no wget?");
            sleep(Duration::from_secs(5));
        }
        println!();
    }

    eprintln!("END: {}", csv_loc);
    eprintln!("-----------------------------------------------");
    eprintln!();

    println!("END: {}", csv_loc);
    println!("-----------------------------------------------");
    println!();
}

fn main() {
    // Use like (csv location, output folder, skip):
    //parse_and_save("../scrape/i.csv", "../images/i/", 0);
    //parse_and_save("../scrape/j.csv", "../images/j/", 0);
    //parse_and_save("../scrape/k.csv", "../images/k/", 0);

    parse_and_save("../../../scrape/l.csv", "../../../images/l/", 0);
    parse_and_save("../../../scrape/m.csv", "../../../images/m/", 0);
    parse_and_save("../../../scrape/n.csv", "../../../images/n/", 0);
    parse_and_save("../../../scrape/o.csv", "../../../images/o/", 0);
    parse_and_save("../../../scrape/p.csv", "../../../images/p/", 0);
    parse_and_save("../../../scrape/q.csv", "../../../images/q/", 0);
    parse_and_save("../../../scrape/r.csv", "../../../images/r/", 0);
    parse_and_save("../../../scrape/s.csv", "../../../images/s/", 0);
    parse_and_save("../../../scrape/t.csv", "../../../images/t/", 0);
    parse_and_save("../../../scrape/u.csv", "../../../images/u/", 0);
    parse_and_save("../../../scrape/v.csv", "../../../images/v/", 0);
    parse_and_save("../../../scrape/w.csv", "../../../images/w/", 0);
    parse_and_save("../../../scrape/x.csv", "../../../images/x/", 0);
    parse_and_save("../../../scrape/y.csv", "../../../images/y/", 0);
    parse_and_save("../../../scrape/z.csv", "../../../images/z/", 0);


    // TODO: make it take command line arguments or something. i'm pretty lazy
    // though so whatever
}
