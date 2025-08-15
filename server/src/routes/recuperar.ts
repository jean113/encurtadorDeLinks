import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'


export const recuperar: FastifyPluginAsyncZod = async server => {
    server.get('/recuperar', 
    {
        // validação dos dados com zod
        schema: {
            response: {
                201: z.object({
                    linksRecuperados: z.array(
                        z.object({
                            id: z.string(),
                            original: z.string(),
                            encurtado: z.string(),
                            acesso: z.number(),
                        })
                    )
                }),
                400: z.object({ message: z.string() }),
          },
        }
    },
    async (request, reply) => 
    {
        // recuperando dados do banco
        const recuperarLinks = await db.select({
            id: links.id,
            original: links.original,
            encurtado: links.encurtado,
            acesso: links.acesso,
        }).from(links)

        return reply.status(201).send({ linksRecuperados: recuperarLinks });
    })
}