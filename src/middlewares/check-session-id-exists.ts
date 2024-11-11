import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
    let sessionId = request.cookies.sessionId   
      
    if (!sessionId) {
        return reply.status(401).send({
            message: 'Usuário não possui autorização para utilizar este serviço'
        })
    }
}