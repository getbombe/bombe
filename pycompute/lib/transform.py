from numpy import *
import scipy
import scipy.fftpack

class Transform:

	@staticmethod
	def fourier (data, real=True):
		'''FFT on a dataset'''

		x_dat = data[0]
		y_dat = data[1]

		x_ft = scipy.fftpack.fftfreq(x_dat.size, x_dat[1] - x_dat[0])
		y_ft = abs(scipy.fft(y_dat))

		if real:
			x_ft = x_ft[1:len(x_ft) / 2]
			y_ft = y_ft[1:len(y_ft) / 2]

		return (x_ft, y_ft)


	@staticmethod
	def test():

		import matplotlib.pyplot as plt 

		x = arange(0, 20*pi, 0.05)
		y = sin(x) + sin(2*pi*2.0*x) + sin(2*pi*6.0*x)

		ft = fourier([x, y])

		plt.plot (x, y)
		plt.show()

		plt.plot (ft[0], ft[1])
		plt.show()


if __name__ == '__main__':

	Transform.test()
