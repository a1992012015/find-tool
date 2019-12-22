from http.server import HTTPServer, SimpleHTTPRequestHandler, BaseHTTPRequestHandler, test
import json
import io, shutil,urllib
from raidtool import get_models

host = ('localhost', 8888)

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

    def do_GET(self):
        self.queryString = urllib.parse.unquote(self.path.split('?',1)[1])
        params = urllib.parse.parse_qs(self.queryString)
        print(params)
        PID = int(params['pid'][0])
        EC = int(params['ec'][0])
        IVs = list(map(lambda x: int(x), params['IVs'][0].split(",")))
        usefilters = False if int(params['usefilters'][0]) == 0 else True
        MaxResults = int(params['maxResults'][0])
        flawlessiv = int(params['flawlessiv'][0])
        HA = int(params['ha'][0])
        RandomGender = int(params['randomGender'][0])
        IsShinyType = False if int(params['isShinyType'][0]) == 0 else True
        data = {
            'result': 'this is a test',
            'filter': get_models(
                PID,
                EC,
                IVs,
                usefilters,
                MaxResults,
                flawlessiv,
                HA,
                RandomGender,
                IsShinyType
            )
        }
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

if __name__ == '__main__':
    server = HTTPServer(host, CORSRequestHandler)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
