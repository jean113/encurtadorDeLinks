import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'


export const excluir: FastifyPluginAsyncZod = async server => {
    server.delete('/excluir/:id', 
    {
        // validação dos dados com zod
        schema: {
            params: z.object({
                id: z.string(),
            }),
            response: {
                201: z.string(),
                400: z.object({ message: z.string() }),
          },
        }
    },
    async (request, reply) => 
    {
        // extração dos dados da requisição
        const { id } = request.params;

        // excluindo do banco
        const linksExcluidos = await db.delete(links).where(eq(links.id, id)).returning({ idExcluido: links.id });

        if (linksExcluidos.length === 0) 
            return reply.status(400).send({ message: 'O link com este ID não foi encontrado.' });

        return reply.status(201).send('Link excluído com sucesso!');
    })
}