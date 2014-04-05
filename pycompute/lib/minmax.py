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
	

	@staticmethod
	def clip (data):
		'''clips x-axis data to return a subset'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		clip_min = data['clip_min']
		clip_max = data['clip_max']

		x_dat = x_dat[clip_min:clip_max]
		y_dat = y_dat[clip_min:clip_max]

		data['data']['x'] = x_dat 
		data['data']['y'] = y_dat

		return data 