import 'dotenv/config';
import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { inserir } from './routes/inserir';
import { excluir } from './routes/excluir';
import { recuperar } from './routes/recuperar';
import { incrementarAcessos } from './routes/incrementarAcessos';


const server = fastify()

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, { origin: 'http://localhost:5173', credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], })
server.register(inserir)
server.register(excluir)
server.register(recuperar)
server.register(incrementarAcessos)

server.listen({
    port: Number(process.env.PORT || 3333),
  })
  .then(() => {
    console.log(`🚀 HTTP Server running on http://localhost:${process.env.PORT}`)
  })
