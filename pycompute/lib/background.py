from numpy import *
from scipy.interpolate import interp1d
import json

class Background:

	@staticmethod
	def spline (data, res=10):
		'''cubic spline'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		x_itp = list(linspace(x_dat[0], x_dat[len(x_dat)-1], len(x_dat) * res))

		cub_spline = interp1d(x_dat, y_dat, kind='cubic')
		y_itp = list(cub_spline(x_itp))

		data['data']['x'] = x_itp
		data['data']['y'] = y_itp

		return data


	@staticmethod
	def linear (data):
		'''given two points, returns the line to subtract'''

		i1 = int(data['p1'])
		i2 = int(data['p2'])
		p1 = [data['data']['x'][i1], data['data']['y'][i1]]
		p2 = [data['data']['x'][i2], data['data']['y'][i2]]

		coeffs = polyfit(p1, p2, 1)
		linear = poly1d (coeffs)

		y_fit = list(linear(data['data']['x']))

		data['data']['y'] = y_fit
		
		return data