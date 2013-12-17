from numpy import *
from scipy.interpolate import interp1d

def spline (data):
	'''cubic spline'''

	x_dat = data[0]
	y_dat = data[1]

	cub_spline = interp1d(x_dat, y_dat, kind='cubic')

	return (x_dat, cub_spline(x_dat))

