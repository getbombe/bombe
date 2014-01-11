import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import os
import datetime

class Export:

	@staticmethod
	def pdf (data):
		'''Exports a PDF of the graph'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		x_unit = data['unit']['x']
		y_unit = data['unit']['y']

		x_label = data['label']['x']
		y_label = data['label']['y']

		plt.plot(x_dat, y_dat, 'k-')
		plt.xlabel(x_label + " ("+x_unit+")")
		plt.ylabel(y_label + " ("+y_unit+")")

		plt.xticks(size='x-small')
		plt.yticks(size='x-small')

		#path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', '/static/uploads'))
		path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), os.pardir, 'static/uploads'))

		name = str(data['userid']) + '_' + str(data['graphid']) + '.pdf'

		data['filename'] = name + str(time.time)

		print path
		print name
		print path + "/" + name

		plt.savefig(path + "/" + name, format='pdf')

		return data