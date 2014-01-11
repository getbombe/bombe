import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import os
import time

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

		fig = plt.figure()
		ax = fig.add_subplot(111)

		ax.plot(x_dat, y_dat, 'k-')
		ax.set_xlabel(x_label + " ("+x_unit+")")
		ax.set_ylabel(y_label + " ("+y_unit+")")

		#path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', '/static/uploads'))
		path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), os.pardir, 'static/uploads'))

		name = str(data['userid']) + '_' + str(data['graphid']) + str(time.time()) + '.pdf'

		data['filename'] = name 

		print path
		print name
		print path + "/" + name

		fig.savefig(path + "/" + name, format='pdf')
		fig.clf()
		plt.close()

		return data