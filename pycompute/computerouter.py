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

		data = json.loads(data)
		data['data']['x'] = map(float, data['data']['x'])
		data['data']['y'] = map(float, data['data']['y'])
		
		return data

	def dataPostprocess(self, data):
		''' TODO: decide if there is anything here'''
		data = json.dumps(data)
		return data

	def compute(self, operation, data):
		preprocdata = self.dataPreprocess(data)
		result = ComputeRouter.computeMap[operation](preprocdata)
		postprocdata = self.dataPostprocess(data)
		return result


if __name__ == '__main__':
	cr = ComputeRouter()
	
	data = dict()
	data['data'] = {
		'x': ['1','2','3','4','5','6'],
		'y': ['1','4','5','3','0','2']
	}
	data['p1'] = '1'
	data['p2'] = '3'
	data = json.dumps(data)

	cr.compute('background_linear', data)