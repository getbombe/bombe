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

		#add zero padding
		num_zeros = int(len(x_dat) * 0.05) #5% of dataset length
		y_dat = concatenate((zeros(num_zeros), y_dat, zeros(num_zeros)))

		x_ft = scipy.fftpack.fftfreq(len(x_dat) + 2*num_zeros, dx)
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
		y_dat = list(multiply(y_dat, gs))

		#zero out the edges at 5% each
		num_zeros = int(len(y_dat) * 0.05)
		y_dat[:num_zeros] = [0]*num_zeros
		y_dat[-num_zeros:] = [0]*num_zeros

		data['data']['y'] = list(y_dat)

		return data

	@staticmethod
	def k_space_transform(data):
		'''Tranforms energy (assumed to be in eV) to momentum space'''

		E_0 = float(data['E_zero'])

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		def transform(energies):
			for i, x in enumerate(energies):
				root = ((2 * scipy.constants.m_e * (x - E_0) * scipy.constants.e) / (scipy.constants.hbar ** 2))
				
				if root < 0:
						root = 0
				else:
					root = ( root ** 0.5 ) * 10**(-10)

				energies[i] = root

			return energies

		x_dat = transform(x_dat)

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
