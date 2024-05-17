import http from 'http'

import {app} from './app.js'
import config from './config.js'

const port = config.port || 5000

const server = http.createServer(app)

server.listen(port)
