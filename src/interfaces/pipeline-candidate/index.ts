import { PipelineInterface } from 'interfaces/pipeline';
import { CandidateInterface } from 'interfaces/candidate';
import { GetQueryInterface } from 'interfaces';

export interface PipelineCandidateInterface {
  id?: string;
  pipeline_id: string;
  candidate_id: string;
  created_at?: any;
  updated_at?: any;

  pipeline?: PipelineInterface;
  candidate?: CandidateInterface;
  _count?: {};
}

export interface PipelineCandidateGetQueryInterface extends GetQueryInterface {
  id?: string;
  pipeline_id?: string;
  candidate_id?: string;
}
