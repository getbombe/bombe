from numpy import *

class MinMax:

	@staticmethod
	def min (data):
		'''computes min'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		data['data']['xAtYMin'] = [x_dat[y_dat.index(min(y_dat))]]
		data['data']['yMin'] = [min(y_dat)]

		return data


	@staticmethod
	def max (data):
		'''computes max'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		data['data']['xAtYMax'] = [x_dat[y_dat.index(max(y_dat))]]
		data['data']['yMax'] = [max(y_dat)]

		return data
	
