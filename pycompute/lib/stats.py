from numpy import *

class Stats:

	@staticmethod
	def basic_stats (data):
		'''basic descriptive stats'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		data['mean'] = mean(y_dat)
		data['med'] = median(y_dat)
		data['stdev'] = std(y_dat)

		return data


	@staticmethod
	def poly_regression (data):
		'''nth order polynomial fit'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']
		order = int(data['order'])
		res = float(data['res'])

		x_itp = list(linspace(x_dat[0], x_dat[len(x_dat)-1], len(x_dat) * res))
		y_itp = list(linspace(y_dat[0], y_dat[len(y_dat)-1], len(y_dat) * res))

		coeffs = polyfit(x_dat, y_dat, order)
		polynom = poly1d (coeffs)

		if data['removal'] == 'subtract':
			data['data']['y'] = list(subtract(y_itp, list(polynom(x_itp)))) 
		elif data['removal'] == 'divide':
			data['data']['y'] = list(divide(y_itp, list(polynom(x_itp))))
		else:
			data['data']['y'] = list(polynom(x_itp))

		data['data']['x'] = x_itp

		return data
