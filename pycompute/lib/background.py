from numpy import *
from scipy.interpolate import interp1d

def spline (data):
	'''cubic spline'''

	x_dat = data[0]
	y_dat = data[1]

	cub_spline = interp1d(x_dat, y_dat, kind='cubic')

	return (x_dat, cub_spline(x_dat))

def linear (data, p1, p2):
	'''given two points, returns the line to subtract'''

	x_dat = data[0]
	y_dat = data[1]

	coeffs = polyfit(x_dat, y_dat, 1)
	linear = poly1d (coeffs)

	y_fit = list(linear(x_dat))

	return (x_dat, y_fit)

