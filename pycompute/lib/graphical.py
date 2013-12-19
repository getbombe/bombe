from numpy import *

def xy_dists (p1, p2):
	'''Get x and y distances between two points'''

	dx = abs(p1[0] - p2[0])
	dy = abs(p1[1] - p2[1])

	return (dx, dy)


def test():

	dataset = [
		[0, 1],
		[4, -5]
	]

	print xy_dists(dataset[0], dataset[1])


if __name__ == '__main__':

	test()
	