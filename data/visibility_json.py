import argparse
import h5py
import json
import numpy as np

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        __doc__,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        "file", nargs=1,
        help="hdf5 file with the visibility data")

    args = parser.parse_args()
    input_file = args.file[0]

    h5file = h5py.File(input_file, "r")
    dataset = h5file["postprocessing/visibility"]
    with open(
        input_file.replace(
            ".hdf5", "_visibility.json"), "w") as output_json:
        visibility = np.mean(dataset[0, ...], axis=1)
        print("visibility dataset shape", visibility.shape)
        json.dump(visibility.tolist(), output_json)
    h5file.close()
