from numpy import *
from scipy.interpolate import interp1d
import json

class Background:

	@staticmethod
	def spline (data, res=10):
		'''cubic spline'''

		x_dat = json.loads(data['x'])
		y_dat = json.loads(data['y'])

		x_itp = list(linspace(x_dat[0], x_dat[len(x_dat)-1], len(x_dat) * res))

		cub_spline = interp1d(x_dat, y_dat, kind='cubic')
		y_itp = list(cub_spline(x_itp))

		dict = {
			"x" : x_itp,
			"y" : y_itp
		}

		ret_json = json.dumps(dict)

		return ret_json


	@staticmethod
	def linear (data, pts):
		'''given two points, returns the line to subtract'''

		x_dat = json.loads(data['x'])
		y_dat = json.loads(data['y'])

		coeffs = polyfit([x_dat[pts['p1']], x_dat[pts['p2']]], [y_dat[pts['p1']], y_dat[pts['p2']]], 1)
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
		y = array(sin(20*x) + cos(25*x)).tolist()

		data = {
			'x': json.dumps(list(x)),
			'y': json.dumps(y)
		}

		#pt values are indices!
		pts = {
			'p1': 1,
			'p2': 10
		}

		spl = json.loads(Background.spline(data, res=5))
		lin = json.loads(Background.linear(data, pts))

		plt.scatter(x, y)
		plt.plot(spl['x'], spl['y'])
		plt.plot(lin['x'], lin['y'])
		plt.show()


if __name__ == '__main__':
	Background.test()
