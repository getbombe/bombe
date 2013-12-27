from numpy import *
from scipy.interpolate import interp1d

class Background:

	@staticmethod
	def spline (data, res=10):
		'''cubic spline'''

		x_dat = data[0]
		y_dat = data[1]

		x_itp = linspace(x_dat[0], x_dat[x_dat.size-1], x_dat.size * res)

		#cub_spline = interp1d(x_dat, y_dat, kind='cubic')
		cub_spline = interp1d(x_dat, y_dat, kind='cubic')

		return (x_itp, cub_spline(x_itp))


	@staticmethod
	def linear (data, p1, p2):
		'''given two points, returns the line to subtract'''

		x_dat = data[0]
		y_dat = data[1]

		coeffs = polyfit(x_dat, y_dat, 1)
		linear = poly1d (coeffs)

		y_fit = list(linear(x_dat))

		return (x_dat, y_fit)


	@staticmethod
	def test():

		import matplotlib.pyplot as plt 

		x = arange(0, 20)
		y = sin(20*x) + cos(25*x)

		spl = spline([x,y])
		lin = linear([x, y], [x[1], y[1]], [x[10], y[10]])

		plt.scatter(x, y)
		plt.plot(spl[0], spl[1])
		plt.plot(lin[0], lin[1])
		plt.show()


if __name__ == '__main__':

	Background.test()
