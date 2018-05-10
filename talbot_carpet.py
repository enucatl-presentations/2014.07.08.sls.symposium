"""Draw the talbot carpet."""

import io
import os
import numpy as np
import argparse
import matplotlib.pyplot as plt
from matplotlib import ticker
from scipy import signal

from dpcsimulation.grating import Grating
from dpcsimulation.grating import calculate_thickness
from dpcsimulation.wave import PolychromaticWave
from dpcsimulation.wave import intensity
from dpcsimulation.wave import propagate_freely
from dpcsimulation.wave import propagate_through_material
from dpcsimulation.constants import hc
from spekcalc2numpy.loader import loader
from spekcalc2numpy.loader import normalize_spectrum
from nist_lookup.nist_lookup import get_formatted_table
from nist_lookup.nist_lookup import get_graph_delta
from nist_lookup.nist_lookup import get_graph_beta
from progress_bar.progress_bar import progress_bar

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='''draw a talbot carpet.''',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("spectrum", metavar="FILE",
                        help="file with the spekcalc spectrum")
    parser.add_argument("--energy", metavar="E (keV)",
                        type=float, default=100, nargs='?',
                        help="design energy of the interferometer")
    parser.add_argument("--dpi", metavar="DPI",
                        type=int, default=200, nargs='?',
                        help="resolution of the saved image")
    parser.add_argument("--steps", metavar="STEPS",
                        type=int, default=1000, nargs='?',
                        help="steps for the propagation of the wave")
    parser.add_argument("--cells", metavar="CELLS",
                        type=int, default=300, nargs='?',
                        help="number of cells for the simulation")
    parser.add_argument("--talbot", metavar="ORDER",
                        type=int, default=5, nargs='?',
                        help="total number of talbot distances")
    parser.add_argument("--period", metavar="PERIOD",
                        type=float, default=2.8e-4, nargs='?',
                        help="period of the phase grating (cm)")
    parser.add_argument("--material", metavar="SYMBOL",
                        default="Au", nargs='?',
                        help="material of the phase grating")
    parser.add_argument("--batch",
                        action="store_true",
                        help="don't show the plot")
    parser.add_argument("--sample",
                        action="store_true",
                        help="is the sample there?")
    args = parser.parse_args()
    target_energy = args.energy
    cells = args.cells
    steps = args.steps
    period = args.period
    grating_periods = 6
    physical_size = grating_periods * period
    material = args.material
    table = io.StringIO(get_formatted_table(material))
    delta = get_graph_delta(table)(target_energy)
    pi_shift_thickness = calculate_thickness(target_energy, delta, np.pi)
    print("grating thickness", pi_shift_thickness)
    s = normalize_spectrum(loader(args.spectrum))
    w = PolychromaticWave(shape=(cells, s.shape[0]), energies=s[:, 0],
                          physical_size=physical_size)
    g = Grating(shape=cells, physical_size=physical_size,
                material=material, pitch=period, duty_cycle=0.5)
    g *= pi_shift_thickness
    g_material_table = io.StringIO(get_formatted_table(g.material))
    after_grating = propagate_through_material(w, g, g_material_table)
    # detector
    detector_thickness = 0.06
    detector_materials = ["Cs", "I"]
    detector_tables = [io.StringIO(get_formatted_table(material))
                       for material in detector_materials]
    detector_betas = [get_graph_beta(table)
                      for table in detector_tables]
    detectors = [np.exp(-w.ks * graph_beta(w.energies) * detector_thickness)
                 for graph_beta in detector_betas]
    d = 1 - np.multiply(*detectors)
    # spectrum * detector efficiency
    spectral_weights = d * s[:, 1]
    talbot_distance = period ** 2 * target_energy / (8 * hc)
    total_talbot_distances = args.talbot
    total_distance = total_talbot_distances * talbot_distance
    carpet = np.zeros(shape=(cells, steps))
    step_size = total_distance / steps
    t_g2 = np.linspace(0, 2 * np.pi,
                       cells / 2 / grating_periods, endpoint=False)
    g2 = 0.5 * (1 + signal.square(t_g2, duty=0.5))

    sample_table = io.StringIO(get_formatted_table(args.material))

    max_sample_thickness = 0.005
    if args.sample:
        sample = np.concatenate((
            np.zeros(cells // 3),
            np.arange(0, 1, 1 / (cells // 3)),
            np.ones(cells // 3)
        )) * max_sample_thickness
        after_sample = propagate_through_material(
            after_grating,
            sample,
            sample_table)
    else:
        after_sample = after_grating

    for i, distance in enumerate(np.linspace(0, total_distance, steps)):
        print(progress_bar((i + 1) / steps), end="\r")
        propagated_wave = propagate_freely(after_sample, distance)
        sq_amplitude = intensity(propagated_wave, weights=spectral_weights)
        phase_stepping_curve = np.convolve(sq_amplitude, g2, 'valid')
        fourier_transform = np.absolute(np.fft.fft(phase_stepping_curve))
        carpet[:, i] = sq_amplitude
    figure = plt.figure(frameon=False)
    ax1 = plt.axes([0, 0, 1, 1])
    image = ax1.imshow(carpet, cmap=plt.cm.Greys)
    image.set_clim(
        np.min(carpet),
        np.max(carpet))
    ax1.set_axis_off()
    if not args.batch:
        plt.ion()
        plt.show()
        print()
        input("Press any key to close.")  # pylint: disable=W0141
    output_picture_name = "images/talbot_carpet_{0}_{1}.png".format(
        os.path.splitext(os.path.basename(args.spectrum))[0],
        args.sample
    )
    plt.savefig(output_picture_name, dpi=args.dpi)
