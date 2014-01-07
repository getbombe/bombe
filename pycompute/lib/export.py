import matplotlib.pyplot as plt
import os

class Export:

	@staticmethod
	def pdf (data):
		'''Exports a PDF of the graph'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		x_unit = data['unit']['x']
		y_unit = data['unit']['y']

		plt.plot(x_dat, y_dat, 'k-')
		plt.xlabel(x_unit)
		plt.ylabel(y_unit)

		plt.xticks(size='x-small')
		plt.yticks(size='x-small')

		path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'uploads'))

		name = path + '/' + data['userid'] + '_' + data['graphid'] + '.pdf'

		data['filename'] = name

		plt.savefig(name, format='pdf')

		return data