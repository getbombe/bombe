from lib.background import *
from lib.transform import *

class ComputeRouter:
	''' static, and should be used that way '''
	computeMap = {
		'background_linear': Background.linear,
		'background_spline': Background.spline,
		'transform_fourier': Transform.fourier
	}

	def dataPreprocess(self, data):
		''' convert data from JSON '''

		data = json.loads(data)
		data['data']['x'] = map(float, data['data']['x'])
		data['data']['y'] = map(float, data['data']['y'])

		return data

	def dataPostprocess(self, data):
		''' turn data back into JSON '''
		data = json.dumps(data)
		return data

	def compute(self, operation, data):
		preprocdata = self.dataPreprocess(data)
		result = ComputeRouter.computeMap[operation](preprocdata)
		postprocdata = self.dataPostprocess(data)
		return result


if __name__ == '__main__':
	cr = ComputeRouter()
	
	#create dummy json data
	data = dict()
	data['data'] = {
		'x': ['1','2','3','4','5','6'],
		'y': ['1','4','5','3','0','2']
	}
	data['p1'] = '1'
	data['p2'] = '3'
	data = json.dumps(data)

	#linear fit on two points
	lin = cr.compute('background_linear', data)

	#spline fit
	spl = cr.compute('background_spline', data)
	
	import matplotlib.pyplot as plt 
	plt.plot(lin['data']['x'], lin['data']['y'])
	plt.plot(spl['data']['x'], spl['data']['y'])
	plt.show()

'''
DATA OBJECT JSON FORMAT

data = {
	'data' : {
		'x' : ['1', '2', '3'],
		'y' : ['4.5', '-3', '0']
	},
	'param1' : 'value1',
	'param2' : 'value2'
}
'''