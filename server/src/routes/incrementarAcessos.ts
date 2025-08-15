import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'


export const incrementarAcessos: FastifyPluginAsyncZod = async server => {
    server.get('/acessos/:id', 
    {
        // validação dos dados com zod
        schema: {
            params: z.object({
                id: z.string(),
            }),
            response: {
                201: z.object({ qtdAcessoAtualizada: z.number() }),
                400: z.object({ message: z.string() }),
          },
        }
    },
    async (request, reply) => 
    {
        // extração dos dados da requisição
        const { id } = request.params;

        // recuperar acesso do link de acordo com id
        const [recuperarLink] = await db.select({ acesso: links.acesso }).from(links).where(eq(links.id, id));

        let { acesso } = recuperarLink;

        acesso = acesso + 1;

        // atualizando do banco
        await db.update(links).set({ acesso }).where(eq(links.id, id));

        // recuperar a qtd de acessos do link atualizada de acordo com id
        const [recuperarLinkAtualizado] = await db.select({ acesso: links.acesso }).from(links).where(eq(links.id, id));

        return reply.status(201).send({ qtdAcessoAtualizada: recuperarLinkAtualizado.acesso });
    })
}