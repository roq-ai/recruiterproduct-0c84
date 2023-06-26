import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { recruiterValidationSchema } from 'validationSchema/recruiters';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRecruiters();
    case 'POST':
      return createRecruiter();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRecruiters() {
    const data = await prisma.recruiter
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'recruiter'));
    return res.status(200).json(data);
  }

  async function createRecruiter() {
    await recruiterValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.candidate?.length > 0) {
      const create_candidate = body.candidate;
      body.candidate = {
        create: create_candidate,
      };
    } else {
      delete body.candidate;
    }
    if (body?.pipeline?.length > 0) {
      const create_pipeline = body.pipeline;
      body.pipeline = {
        create: create_pipeline,
      };
    } else {
      delete body.pipeline;
    }
    const data = await prisma.recruiter.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
