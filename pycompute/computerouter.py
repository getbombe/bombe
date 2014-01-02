from lib.background import *
from lib.transform import *
from lib.calculus import *

class ComputeRouter:
	''' static, and should be used that way '''
	computeMap = {
		#background removal and interpolation
		'background_linear': Background.linear,
		'background_spline': Background.spline,

		#calculus
		'calculus_differentiate': Calculus.differentiate,
		'calculus_integrate': Calculus.integrate,

		#transforms
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

if __name__ == '__main__':
	import matplotlib.pyplot as plt 

	cr = ComputeRouter()
	
	#create dummy json data
	data = dict()
	data['data'] = {
		'x': ['1','2','3','4','5','6'],
		'y': ['1','4','9','16','25','36']
	}
	data['p1'] = '1'
	data['p2'] = '3'
	data = json.dumps(data)

	'''TEST BACKGROUND FUNCTIONS'''
	#linear fit on two points
	lin = cr.compute('background_linear', data)

	#spline fit
	spl = cr.compute('background_spline', data)	
	
	plt.plot(lin['data']['x'], lin['data']['y'])
	plt.plot(spl['data']['x'], spl['data']['y'])
	plt.show()

	'''TEST CALCULUS FUNCTIONS'''
	diff = cr.compute('calculus_differentiate', data)
	intg = cr.compute('calculus_integrate', data)

	print intg['integral']
	plt.plot(diff['data']['x'], diff['data']['y'])
	plt.show()

