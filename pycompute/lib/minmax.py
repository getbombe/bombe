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

		clip_min = float(data['clip_min'])
		clip_max = float(data['clip_max'])

		diff = 0;

		new_x = [];
		new_y = [];

		for i, x in enumerate(x_dat):
			print x
			print i
			if x >= clip_min and x <= clip_max:
				new_x.append(x);
				new_y.append(y_dat[i]);

		data['data']['x'] = new_x 
		data['data']['y'] = new_y

		return data 