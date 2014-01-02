from numpy import *

class Graphical:

	@staticmethod
	def xy_dists (data):
		'''Get x and y distances between two points'''

		i1 = int(data['p1'])
		i2 = int(data['p2'])
		p1 = [data['data']['x'][i1], data['data']['y'][i1]]
		p2 = [data['data']['x'][i2], data['data']['y'][i2]]

		data['dx'] = abs(p1[0] - p2[0])
		data['dy'] = abs(p1[1] - p2[1])

		return data
	