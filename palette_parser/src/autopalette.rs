/*------------------------------------------------------------------------------
    This file computes the color palettes using a modified k-means.
------------------------------------------------------------------------------*/

use crate::utils::{
    find_mean, get_final_palette_string_list, lab_dist, to_hsv, ImgVec, LargeHist, Vec3U8,
    MAX_ITER, NUM_BINS, NUM_PALETTES, PER_BIN,
};

/*------------------------------------------------------------------------------
   Setup
------------------------------------------------------------------------------*/

/// Create a (20 hue color + 1 gray) bin histogram to divide the pixels into
fn initialize_large_hist() -> LargeHist {
    let mut hist: LargeHist = Vec::new();
    for _ in 0..NUM_BINS {
        let indices: Vec<usize> = Vec::new();
        hist.push(indices);
    }
    hist.push(Vec::new());

    return hist;
}

/// Places pixels of the image into bins based on hue (or grayness)
fn fill_large_hist(hist: &mut LargeHist, vec_hsv: &ImgVec) {
    let mut index = 0;
    for p in vec_hsv {
        let (h, s, v) = to_hsv(p);

        if s < 20 || v < 20 {
            let indices = hist.get_mut(NUM_BINS).unwrap();
            indices.push(index);
        } else {
            let bin = h as usize / PER_BIN as usize;
            let indices = hist.get_mut(bin).unwrap();
            indices.push(index);
        }

        index += 1;
    }

    hist.sort_by(|x, y| x.len().cmp(&y.len()));
    hist.reverse();
}

/// Compute the starting seed values for k-means. It separates the colors of
///   the image into a large histogram based on hues (low s/v are considered
///   gray). Then, it takes the top NUM_PALETTES bins and computes the mean LAB
///   value for all pixels in that bin. These averages are the starting seeds
///   for k-means.
fn compute_starting_seeds(vec_hsv: &ImgVec, vec_lab: &ImgVec) -> Vec<Vec3U8> {
    // Populate the large histogram
    let mut hist = initialize_large_hist();
    fill_large_hist(&mut hist, &vec_hsv);

    // Figure out the seed values
    let mut seeds: Vec<Vec3U8> = Vec::new();

    for x in hist.iter().take(NUM_PALETTES) {
        let mut list: Vec<Vec3U8> = Vec::new();
        for index in x {
            let pixel: Vec3U8 = *vec_lab.get(*index).unwrap();
            list.push(pixel);
        }

        // Add the mean to our output set
        let mean: Vec3U8 = find_mean(&list);
        seeds.push(mean);
    }

    seeds
}

/*------------------------------------------------------------------------------
   Iteration steps
------------------------------------------------------------------------------*/

/// Assigns pixels of the input image to the bucket with the closest (in lab
///   distance) seed.
fn fill_buckets_with_closest_pixels(
    seed_buckets: &mut Vec<Vec<usize>>,
    vec_lab: &ImgVec,
    seeds: &ImgVec,
) {
    let mut index: usize = 0;
    for pixel in vec_lab {
        let mut dist = 9999999.0;
        let mut curr_bucket: usize = 0;

        // figure out the closest one in lab distance
        let mut curr_seed = 0;
        for seed in seeds {
            let dist_to_seed = lab_dist(pixel, seed);

            if dist_to_seed < dist {
                dist = dist_to_seed;
                curr_bucket = curr_seed;
            }
            curr_seed += 1;
        }

        // Add this pixel to its closest seed bucket
        let indices = seed_buckets.get_mut(curr_bucket).unwrap();
        indices.push(index);

        index += 1;
    }
}

/// One step of k-means: compute the next seed points given a previous set
fn get_next_seeds(vec_lab: &ImgVec, seeds: &ImgVec) -> ImgVec {
    // Initialize the buckets to store indices
    let mut seed_buckets: Vec<Vec<usize>> = Vec::new();
    for _ in 0..NUM_PALETTES {
        let indices: Vec<usize> = Vec::new();
        seed_buckets.push(indices);
    }

    // Find out which pixels belong to which seed
    fill_buckets_with_closest_pixels(&mut seed_buckets, &vec_lab, &seeds);

    // Figure out the next seeds based on the means of each bucket
    let mut next_seeds: ImgVec = Vec::new();

    for s in seed_buckets {
        let mut list: Vec<Vec3U8> = Vec::new();
        for index in s {
            let color = vec_lab.get(index).unwrap();
            list.push(*color);
        }

        let mean: Vec3U8 = find_mean(&list);
        next_seeds.push(mean);
    }

    next_seeds
}

/*------------------------------------------------------------------------------
   Iteration
------------------------------------------------------------------------------*/

/// Check if the seeds have changed since the last iteration. Returns true if
/// nothing has changed
fn no_updates(seeds: &ImgVec, new_seeds: &ImgVec) -> bool {
    for i in 0..NUM_PALETTES {
        if seeds.get(i).unwrap() != new_seeds.get(i).unwrap() {
            return false;
        }
    }

    true
}

/// The actual k-means iteration loop
pub fn kmeans(vec_hsv: &ImgVec, vec_lab: &ImgVec) -> (usize, Vec<String>) {
    let mut seeds: ImgVec = compute_starting_seeds(&vec_hsv, &vec_lab);

    let mut total_iter = 0;
    for curr_iteration in 0..MAX_ITER {
        total_iter = curr_iteration + 1;
        let new_seeds = get_next_seeds(&vec_lab, &seeds);

        if no_updates(&seeds, &new_seeds) {
            break;
        }

        seeds = new_seeds;
    }

//    println!("Final palette:");
//    for s in &seeds {
//        eprintln!("color = {:?}", s);
//    }

    (total_iter, get_final_palette_string_list(&seeds))
}
