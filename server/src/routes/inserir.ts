import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'


export const inserir: FastifyPluginAsyncZod = async server => {
    server.post('/inserir', 
    {
        // validação dos dados com zod
        schema: {
            body: z.object({
                original: z.string().min(1),
                encurtado: z.string().min(1),
            }),
            response: {
                201: z.object({ linkId: z.string() }),
                400: z.object({ message: z.string() }),
          },
        }
    },
    async (request, reply) => 
    {
        // extração dos dados da requisição
        const { original, encurtado } = request.body;

        // gravando no banco
        const [novoLink] = await db.insert(links).values({
            original,
            encurtado,
        })
        .returning({  insertedId: links.id, });

        return reply.status(201).send({ linkId: novoLink.insertedId });
    })
}