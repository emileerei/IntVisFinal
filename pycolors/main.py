import cv2
import numpy as np

# defines
PALETTE_SIZE = 5
NUM_ITERATIONS = 40

# red, orange, yellow, green, blue, purple, gray
hist = np.array([0, 0, 0, 0, 0, 0, 0])
(RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, GRAY) = (0, 1, 2, 3, 4, 5, 6)
NUM_COLORS = 7


# Places the HSV values into the histogram groupings above (returns normalized)
# TODO: update with final values
def compute_histogram(h, s, v):
    conditions = [
        h < 9,  # red
        h < 21,  # orange
        h < 33,  # yellow
        h < 82,  # green
        h < 128,  # blue
        h < 171,  # purple
        True  # red again
    ]

    choices = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, RED]
    res = np.select(conditions, choices)
    res[np.where((s < 20) | (v < 20))] = GRAY

    for i in range(NUM_COLORS):
        hist[i] = np.count_nonzero(res == i)

    # normalize
    total = h.shape[0]
    hist_norm = np.array(hist) / total

    return hist_norm


# DEBUG
# Makes JPG files for testing hue breakpoints
def hue_gen():
    sat = 20
    val = 180

    size = 512
    skip = 10

    for hue in range(0, 180, skip):
        filename = "sathues/{}.jpg".format(hue)

        img = np.array([[[hue, sat, val]]], np.uint8)
        img = np.tile(img, (size, size)).reshape((size, -1, 3))
        img = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)

        cv2.imwrite(filename, img)
        print("Wrote:", filename)


# DEBUG
# Writes a palette (a matrix with rows [L A B]) to an image file (with squares of size 128)
def output_palette(lab, filename):
    square_size = 128
    img = np.zeros((square_size, square_size, 3))

    for i in range(lab.shape[0]):
        pixel = np.array(lab[i])
        region = np.tile(pixel, (square_size, square_size)).reshape((square_size, -1, 3))
        img = np.hstack((img, region))

    img = np.array(img[:, square_size:, :], np.uint8)
    out_img = cv2.cvtColor(img, cv2.COLOR_LAB2BGR)
    cv2.imwrite(filename, out_img)
    print("Outputting palette to", filename)


# Sort a palette by hue first
# TODO: could have more intelligent sorting
def sort_palette(pal):
    sorted = pal[pal[:, 0].argsort()]
    sorted = sorted[sorted[:, 1].argsort()]
    sorted = sorted[sorted[:, 2].argsort()]
    return sorted


# Euclidean distance between two LAB colors
# TODO: probably a smarter distance alg exists
def lab_dist(lab1, lab2):
    s = lab1.astype(np.float64) - lab2.astype(np.float64)
    return np.sqrt(np.sum(s * s, 1))


# Makes an approximate starting guess of starting seeds based on HSV hue
# histogram bins (most populated bins get their mean LAB values)
def determine_starting_seeds(img_hsv, img_lab):
    seeds = []
    hues = img_hsv[:, :, 0].flatten()
    [h, w, _] = img_lab.shape

    img_lab = img_lab.reshape((h * w, 3))

    NUM_BINS = 20
    BIN_SIZE = 180 / NUM_BINS
    hist = np.zeros((NUM_BINS, 2))

    # compute the histogram
    for i in range(NUM_BINS):
        l = i * BIN_SIZE
        u = l + BIN_SIZE
        hist[i] = [np.count_nonzero((hues >= l) & (hues < u)), l]

    # sort it by most populated first
    sorted = np.flip(hist[hist[:, 0].argsort()]).astype(np.int)

    # take the mean LAB color of these bins as our starter palette
    for i in range(PALETTE_SIZE):
        l = sorted[i][0]
        lab_values = img_lab[np.where((hues >= l) & (hues < l + BIN_SIZE))]
        mean_lab = np.mean(lab_values, 0).astype(np.int)
        seeds.append(mean_lab)

    seeds = sort_palette(np.array(seeds))
    return seeds


# Returns one k-means based step on a LAB image using the given (LAB) seeds as starting values
def determine_new_seed_values(lab, seeds):
    closest = np.zeros((lab.shape[0], 3))
    dists = np.repeat(999999, lab.shape[0])
    tmp_dists = np.zeros(lab.shape[0])

    for seed in seeds:
        # Find the distance between a seed point and all pixels in the image
        tmp_dists[:] = lab_dist(seed, lab[:, :])

        # Remember which seed was closest to every pixel
        closest[np.where(tmp_dists < dists)] = seed
        dists = np.minimum(dists, tmp_dists)

    # Now, find the new seeds by taking the average
    palette = []
    for seed in seeds:
        pixel_idx = np.where(closest == seed)
        pixels = lab[pixel_idx[0]]
        palette.append(np.mean(pixels, 0))

    return np.array(palette, dtype=np.int)


# Computes a (LAB) color palette for this image
def compute_palette(img_hsv, img_lab):
    [h, w, _] = img_lab.shape
    lab = img_lab.reshape((w * h, 3))

    # Seed indices are based on a histogram of hues
    seeds = determine_starting_seeds(img_hsv, img_lab)

    # K-means iterations
    for i in range(NUM_ITERATIONS):
        new_seeds = determine_new_seed_values(lab, seeds)

        # Quit early if no changes
        if (new_seeds == seeds).all():
            break

        seeds = new_seeds

    print("Took", i, "iterations to complete")

    # Sort and create the final output image
    palette = sort_palette(seeds)
    output_palette(palette, "output.jpg")

    return palette


if __name__ == "__main__":
    img_bgr = cv2.imread("test3.jpg")
    img_hsv = np.array(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV))
    img_lab = np.array(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB))

    # Flattened HSV vectors
    hs = img_hsv[:, :, 0].flatten()
    ss = img_hsv[:, :, 1].flatten()
    vs = img_hsv[:, :, 2].flatten()

    hist = compute_histogram(hs, ss, vs)
    print(hist)

    pal = compute_palette(img_hsv, img_lab)
