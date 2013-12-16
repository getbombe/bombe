from numpy import *

def differentiate (data):
	'''computes derivative'''

	x_dat = data[0]
	y_dat = data[1]

	dy_dx = diff(y_dat) / diff(x_dat)

	return (x_dat, dy_dx)

def integrate (data):
	'''computes integral'''

	x_dat = data[0]
	y_dat = data[1]

	integral = trapz(y_dat, x_dat)

	return integral
