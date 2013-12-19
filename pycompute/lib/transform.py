from numpy import *

def fourier (data):
	'''FFT on a dataset'''

	x_dat = data[0]
	y_dat = data[1]

	x_ft = fft.fftfreq(x_dat.size)
	y_ft = fft.fftshift(fft.fft(y_dat))

	return (x_ft, y_ft)

def test():

	import matplotlib.pyplot as plt 

	x = arange(0, 40*pi, 0.1)
	y = sin(x) + sin(3*x) + sin(5*x)

	ft = fourier([x, y])

	plt.plot (x, y)
	plt.show()

	plt.plot (ft[0], ft[1])
	plt.show()


if __name__ == '__main__':

	test()
