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

		data['data']['x'] = x_dat
		data['data']['y'] = dy_dx

		return data


	@staticmethod
	def integrate (data):
		'''computes integral'''

		x_dat = data['data']['x']
		y_dat = data['data']['y']

		integral = trapz(y_dat, x_dat)

		data['integral'] = integral

		return data


	@staticmethod
	def test():

		import matplotlib.pyplot as plt 

		x = arange(0, 2*pi, 0.1)
		y = sin(x)

		deriv = differentiate([x, y])
		intgr = integrate([x, y])

		plt.plot (x, y)
		plt.plot (deriv[0], deriv[1])

		plt.show()

		print intgr


if __name__ == '__main__':
	Calculus.test()
	
