import { CandidateInterface } from 'interfaces/candidate';
import { PipelineInterface } from 'interfaces/pipeline';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RecruiterInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  candidate?: CandidateInterface[];
  pipeline?: PipelineInterface[];
  user?: UserInterface;
  _count?: {
    candidate?: number;
    pipeline?: number;
  };
}

export interface RecruiterGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
