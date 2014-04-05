from numpy import *
from scipy.interpolate import interp1d
from scipy.interpolate import LSQUnivariateSpline
from scipy.interpolate import UnivariateSpline
import json

class Background:

	@staticmethod
	def spline (data):
		'''cubic spline interpolation'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']
		res = float(data['res'])

		x_itp = list(linspace(x_dat[0], x_dat[len(x_dat)-1], round(len(x_dat) * res)))

		cub_spline = interp1d(x_dat, y_dat, kind='cubic')
		y_itp = list(cub_spline(x_itp))

		data['data']['x'] = x_itp

		data['data']['y'] = y_itp	

		return data

	@staticmethod
	def spline_smooth (data):
		'''spline smoothing w/ optional removal'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']
		res = float(data['res'])

		s = UnivariateSpline(x_dat, y_dat, s=res)
		ys = list(s(x_dat))

		if data['removal'] == 'subtract':
			data['data']['y'] = list(subtract(y_dat, ys)) 
		elif data['removal'] == 'divide':
			data['data']['y'] = list(divide(y_dat, ys))
		else:
			data['data']['y'] = ys
		
		return data

	@staticmethod
	def knot_spline (data):
		'''smoothing spline with user-specified number of equally spaced knots'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']
		num_knots = data['knots'] - 2 #endpoints are auto-included

		knots = []

		increm = floor(len(x_dat) / num_knots)

		for i in range(num_knots):
			knots.push(x_dat[increm*(i+1)])

		s = scipy.interpolate.LSQUnivariateSpline(x_dat, y_dat, knots)

		y_intp = s(x_dat)

		data['data']['y'] = list(y_intp)

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
