from numpy import *

def fourier (data):
	'''FFT on a dataset'''

	x_dat = data[0]
	y_dat = data[1]

	x_ft = fft.fftfreq(x_dat)
	y_ft = fft.fft(y_dat)

	return (x_ft, y_ft)
