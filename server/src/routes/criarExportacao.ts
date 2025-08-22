import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { generateCsvContent } from '@/services/geradorCsv'
import { uploadToS3 } from '@/services/servicoS3'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const criarExportacao: FastifyPluginAsyncZod = async server => {
    server.post('/exportar',
    async (request, reply) => 
    {
         try 
         {
            const recuperarLinks = await db.select({
                id: links.id,
                original: links.original,
                encurtado: links.encurtado,
                acesso: links.acesso,
                createdAt: links.createdAt,
            }).from(links).orderBy(links.id);

            const csvContent = generateCsvContent(recuperarLinks);
            if (!csvContent) {
                return reply.status(400).send({ error: 'Não há dados para exportar.' });
            }

            const fileUrl = await uploadToS3(csvContent);

            return reply.status(201).send({ message: 'Exportação concluída!', fileUrl });
        } 
        catch (error) 
        {
            return reply.status(500).send({ error: 'Falha ao exportar arquivo.' });
        }
    })
}