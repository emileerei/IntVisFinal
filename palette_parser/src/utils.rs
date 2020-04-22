#![allow(dead_code)]
/*------------------------------------------------------------------------------
    This file stores useful defines and helper functions for converting between
    types.
------------------------------------------------------------------------------*/

use opencv::core::Vec3;
use opencv::core::{Mat, MatTrait, MatTraitManual, Scalar, CV_8UC3};
use opencv::imgproc::{cvt_color, COLOR_BGR2Lab, COLOR_Lab2RGB, COLOR_BGR2HSV, COLOR_RGB2HSV, COLOR_HSV2RGB};
use opencv::prelude::Vector;
use opencv::types::VectorOfi32;
use opencv::Error;

pub type Vec3U8 = Vec3<u8>;
pub type ImgVec = Vec<Vec3U8>;
pub type HSV = (u8, u8, u8);
pub type LargeHist = Vec<Vec<usize>>;

pub static NUM_PALETTES: usize = 5;
pub static MAX_ITER: usize = 100;

// num_bins * per_bin = 180 = max hue value
pub static NUM_BINS: usize = 20;
pub static PER_BIN: usize = 9;

pub static MAX_IMG_SIZE : i32 = 500;

/*------------------------------------------------------------------------------
   Lab color space helpers
------------------------------------------------------------------------------*/

/// Computes Euclidean distance between two LAB colors
pub fn lab_dist(v1: &Vec3U8, v2: &Vec3U8) -> f32 {
    let a = v1[0] as f32 - v2[0] as f32;
    let b = v1[1] as f32 - v2[1] as f32;
    let c = v1[2] as f32 - v2[2] as f32;
    let inner = (a * a) + (b * b) + (c * c);
    inner.sqrt()
}

/// Finds the mean value (in lab space) of an ImgVec
pub fn find_mean(vec_lab: &ImgVec) -> Vec3U8 {
    let mut sum_l = 0.0;
    let mut sum_a = 0.0;
    let mut sum_b = 0.0;

    for p in vec_lab {
        sum_l += p[0] as f64;
        sum_a += p[1] as f64;
        sum_b += p[2] as f64;
    }

    let avg_l = sum_l / vec_lab.len() as f64;
    let avg_a = sum_a / vec_lab.len() as f64;
    let avg_b = sum_b / vec_lab.len() as f64;

    let avg_l = avg_l.floor() as u8;
    let avg_a = avg_a.floor() as u8;
    let avg_b = avg_b.floor() as u8;

    return Vec3([avg_l, avg_a, avg_b]);
}

/*------------------------------------------------------------------------------
   Converters
------------------------------------------------------------------------------*/

/// Converts a Vec3<u8> to a (u8, u8, u8)
pub fn to_hsv(v: &Vec3U8) -> HSV {
    (v[0], v[1], v[2])
}

/// Converts an OpenCV image Mat into a Rust vector of <u8,u8,u8>'s
pub fn to_vec(img: &Mat) -> Result<ImgVec, Error> {
    let mut vec: ImgVec = Vec::new();

    let width = img.size()?.width;
    let height = img.size()?.height;

    for i in 0..height {
        for j in 0..width {
            if let Ok(p) = img.at_2d(i, j) {
                vec.push(*p);
            }
        }
    }

    Ok(vec)
}

/// Converts an ImgVec back into an OpenCV Mat (to allow color converting)
pub fn vec_to_mat(vec: &ImgVec) -> Mat {
    let mut s: VectorOfi32 = VectorOfi32::new();
    s.push(vec.len() as i32);
    s.push(1);

    let mut m = Mat::new_nd_vec_with_default(&s, CV_8UC3, Scalar::default()).unwrap();

    for i in 0..vec.len() {
        *m.at_2d_mut(i as i32, 0).unwrap() = vec[i];
    }

    m
}

/// Converts rgb(u8, u8, u8) into a #aaaaaa hex code
pub fn rgb_to_hex(r: u8, g: u8, b: u8) -> String {
    let mut res = String::from("#");
    res.push_str(format!("{:02x}", r).as_str());
    res.push_str(format!("{:02x}", g).as_str());
    res.push_str(format!("{:02x}", b).as_str());
    res
}

pub fn bgr_mat_to_hsv_and_lab_vecs(img_bgr: &Mat) -> Option<(ImgVec, ImgVec)> {
    let mut img_hsv = img_bgr.clone().expect("ERROR: could not clone BGR");
    let mut img_lab = img_bgr.clone().expect("ERROR: could not clone BGR");

    // Convert colors
    if cvt_color(&img_bgr, &mut img_hsv, COLOR_BGR2HSV, 0).is_err() {
        return None;
    }
    if cvt_color(&img_bgr, &mut img_lab, COLOR_BGR2Lab, 0).is_err() {
        return None;
    }

    // BGR 0-255
    // HSV 0-179, 0-255, 0-255
    // LAB 0-255, 0-172, 0-198 [i assume 0-255 for all]

    // Rust vectors for all future processing
    let vec_hsv = to_vec(&img_hsv).expect("Mat->Vec failed");
    let vec_lab = to_vec(&img_lab).expect("Mat->Vec failed");

    Some((vec_hsv, vec_lab))
}

/*------------------------------------------------------------------------------
   Debug printing
------------------------------------------------------------------------------*/

#[allow(dead_code)]
pub fn print_img_vec(vec: &ImgVec) {
    eprintln!("vec.len() = {:?}", vec.len());
    for x in vec {
        eprintln!("\tx = {:?}", x);
    }
    eprintln!("\n");
}

/*------------------------------------------------------------------------------
   Misc
------------------------------------------------------------------------------*/

/// Converts a color palette ImgVec (lab) into a list of #aaaaaa rgb hex strings
pub fn get_final_palette_string_list(vec_lab: &ImgVec) -> Vec<String> {
    let mut res: Vec<String> = Vec::new();

    // Convert to a matrix to get into RGB
    //let m = vec_to_mat(&vec_lab);
    //let mut m2 = m.clone().unwrap();
    //cvt_color(&m, &mut m2, COLOR_Lab2RGB, 0).unwrap();

    // We need to sort it by Hue (HSV) first
    let lab = vec_to_mat(&vec_lab);
    let mut rgb = lab.clone().unwrap();
    let mut hsv = rgb.clone().unwrap();

    cvt_color(&lab, &mut rgb, COLOR_Lab2RGB, 0).unwrap();
    cvt_color(&rgb, &mut hsv, COLOR_RGB2HSV, 0).unwrap();

    let mut hsv_vec= to_vec(&hsv).unwrap();
    //let mut hsv_vec2 : Vec<&Vec3U8> = hsv_vec.iter().collect();

    hsv_vec.sort_by(|&a, &b| {
        if a[0] == b[0] {
            if a[1] == b[1] {
                a[2].cmp(&b[2])
            } else {
                a[1].cmp(&b[1])
            }
        } else {
            a[0].cmp(&b[0])
        }
    });

    //for c in hsv_vec { eprintln!("c = {:?}", c); }

    // Convert this sorted back into RGB
    let sorted_hsv = vec_to_mat(&hsv_vec);
    let mut rgb = sorted_hsv.clone().unwrap();
    cvt_color(&sorted_hsv, &mut rgb, COLOR_HSV2RGB, 0).unwrap();


    // Push all the hex strings into the output vector
    let rgb_vec = to_vec(&rgb).unwrap();
    for rgb in rgb_vec {
        res.push(rgb_to_hex(rgb[0], rgb[1], rgb[2]));
    }

    res
}
