import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { candidateValidationSchema } from 'validationSchema/candidates';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCandidates();
    case 'POST':
      return createCandidate();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCandidates() {
    const data = await prisma.candidate
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'candidate'));
    return res.status(200).json(data);
  }

  async function createCandidate() {
    await candidateValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.pipeline_candidate?.length > 0) {
      const create_pipeline_candidate = body.pipeline_candidate;
      body.pipeline_candidate = {
        create: create_pipeline_candidate,
      };
    } else {
      delete body.pipeline_candidate;
    }
    const data = await prisma.candidate.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
