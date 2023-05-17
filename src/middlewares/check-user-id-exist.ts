import { FastifyRequest, FastifyReply } from 'fastify'

export async function checkUserIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.userId

  if (!userId) {
    return reply.status(401).send({
      error: 'Crie primeiro um usuário para poder fazer esta requisição.',
    })
  }
}
