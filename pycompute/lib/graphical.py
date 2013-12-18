from numpy import *

def xy_dists (p1, p2):
	'''Get x and y distances between two points'''

	dx = abs(p1[0] - p2[0])
	dy = abs(p2[0] - p2[1])

	return (dx, dy)