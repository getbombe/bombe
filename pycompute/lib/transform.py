from numpy import *
import scipy
import scipy.constants
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
		'''Gaussian window multiplication'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		sigma = float(data['sigma'])

		 
		gs = list(scipy.signal.gaussian(len(y_dat), sigma))
		data['data']['y'] = list(multiply(y_dat, gs))

		return data

	@staticmethod
	def k_space_transform(data):
		'''Tranforms energy (assumed to be in eV) to momentum space'''

		E_0 = float(data['E_zero'])

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		transform = lambda x: (((2 * scipy.constants.m_e * (x - E_0) * scipy.constants.e ) / (scipy.constants.hbar ** 2)) ** 0.5 ) 10**(-10)

		x_dat = map(transform, x_dat)

		data['data']['x'] = list(x_dat)
		data['data']['y'] = list(y_dat)

		return data

	@staticmethod
	def x_weight(data):
		'''amplifies y data by multiplying some power of x data'''
		
		power = float(data['power'])
		
		x_dat = data['data']['x']
		y_dat = data['data']['y']

		for i in range(len(y_dat)):
			y_dat[i] *= pow(x_dat[i], power)

		data['data']['y'] = list(y_dat)

		return data
