import { PipelineCandidateInterface } from 'interfaces/pipeline-candidate';
import { RecruiterInterface } from 'interfaces/recruiter';
import { GetQueryInterface } from 'interfaces';

export interface PipelineInterface {
  id?: string;
  recruiter_id: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  pipeline_candidate?: PipelineCandidateInterface[];
  recruiter?: RecruiterInterface;
  _count?: {
    pipeline_candidate?: number;
  };
}

export interface PipelineGetQueryInterface extends GetQueryInterface {
  id?: string;
  recruiter_id?: string;
  name?: string;
}
