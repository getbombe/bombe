from lib.background import *
from lib.transform import *

class ComputeRouter:
	''' static, and should be used that way '''
	computeMap = {
		'background_linear': Background.linear,
		'transform_fourier': Transform.fourier
	}

	def dataPreprocess(self, data):
		''' TODO: decide if there is anything here'''
		return data

	def compute(self, operation, data):
		ppdata = self.dataPreprocess(data);
		result = ComputeRouter.computeMap[operation](ppdata, 1, 1)

		return result


if __name__ == '__main__':
	cr = ComputeRouter()
	cr.compute('background_linear', [[2,2,2,2,2,2],[1,1,1,1,1,1]])