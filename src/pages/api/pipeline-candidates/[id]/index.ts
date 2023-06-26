import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { pipelineCandidateValidationSchema } from 'validationSchema/pipeline-candidates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.pipeline_candidate
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPipelineCandidateById();
    case 'PUT':
      return updatePipelineCandidateById();
    case 'DELETE':
      return deletePipelineCandidateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPipelineCandidateById() {
    const data = await prisma.pipeline_candidate.findFirst(convertQueryToPrismaUtil(req.query, 'pipeline_candidate'));
    return res.status(200).json(data);
  }

  async function updatePipelineCandidateById() {
    await pipelineCandidateValidationSchema.validate(req.body);
    const data = await prisma.pipeline_candidate.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePipelineCandidateById() {
    const data = await prisma.pipeline_candidate.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
