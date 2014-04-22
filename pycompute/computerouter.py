from lib.background import *
from lib.transform import *
from lib.calculus import *
from lib.stats import *
from lib.graphical import *
from lib.export import *
from lib.minmax import *

class ComputeRouter:
	''' static, and should be used that way '''
	
	computeMap = {
		#background removal and interpolation
		'background_linear_subtract': Background.linear_subtract,
		'background_spline': Background.spline,
		'background_spline_smooth': Background.spline_smooth,

		#calculus
		'calculus_differentiate': Calculus.differentiate,
		'calculus_integrate': Calculus.integrate,

		#export
		'export_export': Export.export,

		#graphical
		'graphical_xy_dists' : Graphical.xy_dists,

		#statistics and fitting
		'stats_basic_stats' : Stats.basic_stats,
		'stats_poly_regression' : Stats.poly_regression,

		#transforms
		'transform_fourier': Transform.fourier,
		'transform_gaussian_filter': Transform.gaussian_filter,
		'transform_k_space_transform': Transform.k_space_transform,
		'transform_x_weight': Transform.x_weight,

		#min max
		'minmax_min': MinMax.min,
		'minmax_max': MinMax.max,
		'minmax_clip': MinMax.clip
	}

	def dataPreprocess(self, data):
		''' convert data from JSON '''

		data = json.loads(data)
		data['data']['x'] = list(map(float, data['data']['x']))
		data['data']['y'] = list(map(float, data['data']['y']))

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
DATA OBJECT JSON FORMAT (where the outer DATA is a graph object)

data = {
	'userid': '0001',
	'graphid': '1234',
	'data' : {
		'x' : ['1', '2', '3'],
		'y' : ['4.5', '-3', '0']
	},
	'unit' : {
		'x' : 'km',
		'y' : 'km/h'
	},
	'param1' : 'value1',
	'param2' : 'value2'
}
'''

if __name__ == '__main__':
	import matplotlib.pyplot as plt 

	cr = ComputeRouter()
	
	#create dummy json data
	arr = arange(0, 10, 0.5)
	data = dict()
	data['userid'] = '0001'
	data['graphid'] = '1234'
	data['data'] = {
		'x': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
		'y': ['1', '4', '9', '16', '25', '36', '49', '64', '81', '100']
	}
	data['unit'] = {
		'x': 't',
		'y': 'km/h'
	}
	data['p1'] = '1'
	data['p2'] = '3'
	data['order'] = '2'
	data['res'] = '10'
	data['real'] = 'True'
	data['graphtype'] = 'pdf'
	data['sigma'] = '3'
	data['clip_min'] = '3'
	data['clip_max'] = '5'
	data['label'] = {}
	data['label']['x'] = 'derp'
	data['label']['y'] = 'derp'
	data['filename'] = 'derp'
	data['removal'] = 'divide'
	data = json.dumps(data)

	'''TEST BACKGROUND FUNCTIONS'''
	lin = cr.compute('background_linear', data)
	spl = cr.compute('background_spline', data)	
	spl_sm = cr.compute('background_spline_smooth', data)
	
	plt.plot(lin['data']['x'], lin['data']['y'])
	plt.plot(spl['data']['x'], spl['data']['y'])
	plt.plot(spl_sm['data']['x'], spl_sm['data']['y'])
	plt.show()

	'''TEST CALCULUS FUNCTIONS'''
	diff = cr.compute('calculus_differentiate', data)
	intg = cr.compute('calculus_integrate', data)

	print intg['integral']
	plt.plot(diff['data']['x'], diff['data']['y'])
	plt.show()

	'''TEST GRAPHICAL FUNCTIONS'''
	dxdy = cr.compute('graphical_xy_dists', data)
	print (dxdy['dx'], dxdy['dy']) 

	'''TEST STATS FUNCTIONS'''
	bas_stats = cr.compute('stats_basic_stats', data)
	polr = cr.compute('stats_poly_regression', data)
	print (bas_stats['mean'], bas_stats['med'], bas_stats['stdev'])
	plt.plot(polr['data']['x'], polr['data']['y'])
	plt.show()

	'''TEST TRANSFORM FUNCTIONS'''
	ftr = cr.compute('transform_fourier', data)
	print(ftr)
	plt.plot(ftr['data']['x'], ftr['data']['y'])
	plt.show()

	'''gaus = cr.compute('transform_gaussian_filter', data)
	plt.plot(gaus['data']['x'], gaus['data']['y'])
	plt.show()'''

	'''TEST MIN MAX FUNCTIONS'''
	minn = cr.compute('minmax_min', data)
	print (minn['data']['xAtYMin'], minn['data']['yMin'])

	maxx = cr.compute('minmax_max', data)
	print (maxx['data']['xAtYMax'], maxx['data']['yMax'])

	cropp = cr.compute('minmax_clip', data)
	print(cropp)
