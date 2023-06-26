import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { pipelineValidationSchema } from 'validationSchema/pipelines';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.pipeline
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPipelineById();
    case 'PUT':
      return updatePipelineById();
    case 'DELETE':
      return deletePipelineById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPipelineById() {
    const data = await prisma.pipeline.findFirst(convertQueryToPrismaUtil(req.query, 'pipeline'));
    return res.status(200).json(data);
  }

  async function updatePipelineById() {
    await pipelineValidationSchema.validate(req.body);
    const data = await prisma.pipeline.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePipelineById() {
    const data = await prisma.pipeline.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
