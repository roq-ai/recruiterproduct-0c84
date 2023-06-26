import axios from 'axios';
import queryString from 'query-string';
import { PipelineCandidateInterface, PipelineCandidateGetQueryInterface } from 'interfaces/pipeline-candidate';
import { GetQueryInterface } from '../../interfaces';

export const getPipelineCandidates = async (query?: PipelineCandidateGetQueryInterface) => {
  const response = await axios.get(`/api/pipeline-candidates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPipelineCandidate = async (pipelineCandidate: PipelineCandidateInterface) => {
  const response = await axios.post('/api/pipeline-candidates', pipelineCandidate);
  return response.data;
};

export const updatePipelineCandidateById = async (id: string, pipelineCandidate: PipelineCandidateInterface) => {
  const response = await axios.put(`/api/pipeline-candidates/${id}`, pipelineCandidate);
  return response.data;
};

export const getPipelineCandidateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/pipeline-candidates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePipelineCandidateById = async (id: string) => {
  const response = await axios.delete(`/api/pipeline-candidates/${id}`);
  return response.data;
};
