from numpy import *

def basic_stats (data):
	'''basic descriptive stats'''

	x_dat = data[0]
	y_dat = data[1]

	y_mean = mean(y_dat)
	y_med = median(y_dat)
	y_stdev = std(y_dat)

	return (y_mean, y_med, y_stdev)


def poly_regression (data, order):
	'''nth order polynomial fit'''

	x_dat = data[0]
	y_dat = data[1]

	coeffs = polyfit(x_dat, y_dat, order)
	polynom = poly1d (coeffs)

	y_fit = list(polynom(x_dat))

	return (x_dat, y_fit)


def test():

	dataset = [
		[1, 2, 3, 4, 5],
		[1, 4, 9, 16, 25]
	]

	print basic_stats(dataset)
	print poly_regression(dataset, 1)
	print poly_regression(dataset, 2)

#TESTS

if __name__ == '__main__':
	test()
	
