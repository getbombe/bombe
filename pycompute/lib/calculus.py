from numpy import *

class Calculus:

	@staticmethod
	def differentiate (data):
		'''computes derivative'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		dy_dx = diff(y_dat) / diff(x_dat)

		#Delete last pt because diff() makes dy_dx smaller by 1 element
		x_dat = delete(x_dat, s_[:1])

		data['data']['x'] = list(x_dat)
		data['data']['y'] = list(dy_dx)

		return data


	@staticmethod
	def integrate (data):
		'''computes integral'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		integral = trapz(y_dat, x_dat)

		data['integral'] = integral

		return data
	
