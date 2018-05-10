import argparse
import json

"""
converts nist table to json format for d3 plots

"""

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        __doc__,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        "file",
        nargs="?",
        default="data/cross.section.carbon.dat",
        help="file downloaded from nist")
    parser.add_argument(
        "--min_cross_section",
        nargs="?",
        default=0.005,
        type=float,
        help="minimum cross section")
    parser.add_argument(
        "--max_cross_section",
        nargs="?",
        default=1,
        type=float,
        help="maximum cross section")
    args = parser.parse_args()
    minimum = args.min_cross_section
    maximum = args.max_cross_section
    with open(args.file, "r") as input_file:
        names = ["coherent", "incoherent", "photoelectric", "total"]
        dicts = [{"name": name, "values": []} for name in names]
        for line in input_file:
            try:
                energy, coherent, incoherent, photo, total = [float(x) for x
                                                              in
                                                              line.split()]
                energy = energy * 1e3
                if coherent >= minimum and coherent <= maximum:
                    dicts[0]["values"].append(
                        {"energy": energy,
                         "cross_section": coherent})
                if incoherent >= minimum and incoherent <= maximum:
                    dicts[1]["values"].append(
                        {"energy": energy,
                         "cross_section": incoherent})
                if photo >= minimum and photo <= maximum:
                    dicts[2]["values"].append(
                        {"energy": energy,
                         "cross_section": photo})
                if total >= minimum and total <= maximum:
                    dicts[3]["values"].append(
                        {"energy": energy,
                         "cross_section": total})
            except ValueError:
                continue
        with open(args.file.replace(".dat", ".json"), "w") as output_json:
            print(dicts)
            json.dump(dicts, output_json)
