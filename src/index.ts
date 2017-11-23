import { Api } from './app'

const server = new Api(80 || process.env.PORT)
server.start().catch(error => console.error(error))
