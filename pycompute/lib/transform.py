from numpy import *
import scipy
import scipy.fftpack
import scipy.signal


class Transform:

	@staticmethod
	def fourier (data):
		'''FFT on a dataset'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']
		real = bool(data['real'] == 'True')

		#assume a constant spacing equal to 1st space
		dx = x_dat[1] - x_dat[0]

		x_ft = scipy.fftpack.fftfreq(len(x_dat), dx)
		y_ft = abs(scipy.fft(y_dat))

		if real is True:
			x_ft = x_ft[1:len(x_ft) / 2]
			y_ft = y_ft[1:len(y_ft) / 2]

		data['data']['x'] = list(x_ft)
		data['data']['y'] = list(y_ft)

		return data

	@staticmethod
	def gaussian_filter (data):
		'''Gaussian window convolution'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		sigma = float(data['sigma'])

		 
		gs = list(scipy.signal.gaussian(len(y_dat), sigma))
		data['data']['y'] = list(scipy.signal.convolve(y_dat, gs, mode='same'))

		return data
