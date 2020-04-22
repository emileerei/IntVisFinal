use crate::csv::load_csv;
use std::env;
use std::fs::OpenOptions;
use std::io::Write;

mod autopalette;
mod csv;
mod hist;
mod utils;

fn write_string_to_file(s: &String, filename: &str) {
    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .write(true)
        .open(filename)
        .expect("Failed to open file for writing");

    file.write_all(s.as_bytes()).unwrap();
    file.write("\n".as_bytes()).unwrap();
}

fn main() {
    if let Some(letter) = env::args().nth(1) {
        let start = chrono::Utc::now();

        let output_file = format!("output/{}.json", letter);
        let filename = format!("csv/{}.csv", letter);

        //eprintln!("Looking at {} | {}", filename, output_file);

        let json_string = load_csv(&filename);

        write_string_to_file(&json_string, &output_file);

        let total_elapsed = chrono::Utc::now() - start;
        let hours = total_elapsed.num_hours();
        let minutes = total_elapsed.num_minutes();
        let seconds = total_elapsed.num_seconds();

        eprintln!(
            "Completed {} in {:02}:{:02}:{:02}",
            filename, hours, minutes, seconds
        );
        println!(
            "Completed {} in {:02}:{:02}:{:02}",
            filename, hours, minutes, seconds
        );
    }
    else {
        eprintln!("ERROR: specify one command line argument with the letter you want");
    }
}
