from numpy import *
from scipy.interpolate import interp1d
import json

class Background:

	@staticmethod
	def spline (data, res=10):
		'''cubic spline'''

		x_dat = data[0]
		y_dat = data[1]

		x_itp = list(linspace(x_dat[0], x_dat[x_dat.size-1], x_dat.size * res))

		cub_spline = interp1d(x_dat, y_dat, kind='cubic')
		y_itp = list(cub_spline(x_itp))

		dict = {
			"x" : x_itp,
			"y" : y_itp
		}

		ret_json = json.dumps(dict)

		return ret_json


	@staticmethod
	def linear (data, p1, p2):
		'''given two points, returns the line to subtract'''

		x_dat = data[0]
		y_dat = data[1]

		coeffs = polyfit([p1[0], p2[0]], [p1[1], p2[1]], 1)
		linear = poly1d (coeffs)

		y_fit = list(linear(x_dat))

		dict = {
			"x" : list(x_dat),
			"y" : y_fit
		}

		ret_json = json.dumps(dict)

		return ret_json


	@staticmethod
	def test():

		import matplotlib.pyplot as plt 

		x = linspace(0, 20)
		y = sin(20*x) + cos(25*x)

		spl = json.loads(Background.spline([x,y], res=5))
		lin = json.loads(Background.linear([x, y], [x[1], y[1]], [x[10], y[10]]))

		plt.scatter(x, y)
		plt.plot(spl['x'], spl['y'])
		plt.plot(lin['x'], lin['y'])
		plt.show()


if __name__ == '__main__':

	Background.test()
