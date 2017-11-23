import { Api } from './app'

const server = new Api(8585 || process.env.PORT)
server.start().catch(error => console.error(error))
