import { db } from '@/infra/db';
import { links } from '@/infra/db/schemas/links';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { eq, sql } from 'drizzle-orm';

export const redirecionamento: FastifyPluginAsyncZod = async server => {
    server.get('/brev.ly/:encurtado', async (request, reply) => 
    {
        const { encurtado } = request.params as { encurtado: string };

        const [linkOriginal] = await db.select({
                    id: links.id,
                    url: links.original,
                }).from(links).where(eq(links.encurtado, encurtado));

        if (linkOriginal)  
        {
            await db.update(links).set({  acesso: sql`${links.acesso} + 1` }).where(eq(links.id, linkOriginal.id));
            return reply.code(200).send({ originalUrl: linkOriginal.url });  
        }    
        else 
            reply.code(404).send('Link não encontrado.');
    })
}