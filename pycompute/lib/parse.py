import csv
import numpy as np 

class Parse:

	@staticmethod
	def parse_data (datafile, fmt = None):
		'''parses datafiles given by user'''

		#check if format is known
		if fmt == 'csv':
			with open(datafile) as f:
				reader = csv.reader(f, delimiter=",")
				return_data = [row for row in reader]

			return return_data
		else:
			pass

		return 1

	@staticmethod
	def test ():
		print Parse.parse_data('derp.csv', fmt='csv')

if __name__ == '__main__':
	Parse.test()

