/*------------------------------------------------------------------------------
    This file computes our Radar chart histogram
------------------------------------------------------------------------------*/

use crate::utils::ImgVec;

/// Stores the counts of each type of pixel
#[derive(Default, Debug)]
struct Hist {
    red: u32,
    orange: u32,
    yellow: u32,
    green: u32,
    blue: u32,
    purple: u32,
    gray: u32,
}

/// Updates the hist according to our hue breakpoints for a single HSV pixel
fn incr_hist(hist: &mut Hist, h: u8, s: u8, v: u8) {
    if s < 20 || v < 20 {
        hist.gray += 1;
    } else if h < 9 {
        hist.red += 1;
    } else if h < 21 {
        hist.orange += 1;
    } else if h < 33 {
        hist.yellow += 1;
    } else if h < 82 {
        hist.green += 1;
    } else if h < 128 {
        hist.blue += 1;
    } else if h < 171 {
        hist.purple += 1;
    } else {
        hist.red += 1;
    }
}

/// Computes the HSV histogram for the given image vector
fn hsv_hist(vec: &ImgVec) -> Hist {
    let mut hist: Hist = Hist::default();

    let mut mh = 0;
    for p in vec {
        incr_hist(&mut hist, p[0], p[1], p[2]);
        if p[1] > mh {
            mh = p[1];
        }
    }

    hist
}


/// Returns a vector of f32's with the normalized percentage of each category
pub fn normalized_hist_vector(vec: &ImgVec) -> Vec<f32> {
    let hist = hsv_hist(&vec);

    let mut total = 0;
    total += hist.red;
    total += hist.orange;
    total += hist.yellow;
    total += hist.green;
    total += hist.blue;
    total += hist.purple;
    total += hist.gray;
    let total = total as f32;

    let mut res : Vec<f32> = Vec::new();
    res.push(hist.red as f32 / total);
    res.push(hist.orange as f32 / total);
    res.push(hist.yellow as f32 / total);
    res.push(hist.green as f32 / total);
    res.push(hist.blue as f32 / total);
    res.push(hist.purple as f32 / total);
    res.push(hist.gray as f32 / total);

    res
}
