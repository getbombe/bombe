import web
import json

'''custom'''
from computerouter import ComputeRouter
        
urls = (
    '/compute', 'Compute'
)
app = web.application(urls, globals())

class Compute:
    def POST(self):
        web.header('Access-Control-Allow-Origin',      '*')
        web.header('Access-Control-Allow-Credentials', 'true')
        
    	inp = web.input()
    	web.header('Content-Type', 'application/json')
    	
    	data = inp.data
    	operation = inp.operation

    	cr = ComputeRouter()
    	result = cr.compute(operation, data)

    	return json.dumps({
    		'result': result
    	})

if __name__ == "__main__":
    app.run()