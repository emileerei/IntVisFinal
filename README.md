# IntVisFinal (Name not yet decided)

An interface for visualizing the color palettes of various paintings across several centuries of art. Currently a work in progress.

## Modules
* web - Our main interface / visualization, using javascript
* data - Contains our database of paintings (author, title, url, etc.) in the original CSV format, as well as a JSON format containing some extra color information that we extract for our visualization to use
* csv_to_json - A command line rust program that converts our original CSVs into the final JSON format with the added information we need
* scraper - A command line rust program that will slowly download each image in our CSV database to local storage for us to process and extract color information

## Planned Modules
* color_extractor - A program to extract color data from each image, generate color palettes, and perform other processing steps that we need to run on each downloaded image file.
* server (?) - We may need to create some sort of serving backend for our frontend piece to request data from. This detail is not yet ironed out, and we may not need it.

## Building the Rust modules
You'll need to clone this repo and install Rust (https://www.rust-lang.org/tools/install). We recommend using rust-up to get the proper environment set up (directions can be found at the previous url). Rust comes with the Cargo build system which can be used to build and run the code of each Rust module.

To build, navigate to the module's directory in your terminal (i.e. the folder where Cargo.toml exists) and type: 

    cargo build
    
which should compile the program and place an executable in a created target directory. You can run that program from inside that folder, or simplify the process by building and running in the same step with:

    cargo run
    
Our Rust modules are currently set up mostly hardcoded and do not take command line arguments, so you'll probably need to edit the main function at the bottom of each src/main.rs file to point it at the right locations/files.

# Todo (web):
* help button tooltip/popup
* radar chart blob tooltip
* ~hex color for palette hovers~
* selected painting background
* change focus painting
* remove search button
* make sure checkboxes stay checked in results page if they are checked when page is swapped