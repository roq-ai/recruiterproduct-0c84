import axios from 'axios';
import queryString from 'query-string';
import { RecruiterInterface, RecruiterGetQueryInterface } from 'interfaces/recruiter';
import { GetQueryInterface } from '../../interfaces';

export const getRecruiters = async (query?: RecruiterGetQueryInterface) => {
  const response = await axios.get(`/api/recruiters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRecruiter = async (recruiter: RecruiterInterface) => {
  const response = await axios.post('/api/recruiters', recruiter);
  return response.data;
};

export const updateRecruiterById = async (id: string, recruiter: RecruiterInterface) => {
  const response = await axios.put(`/api/recruiters/${id}`, recruiter);
  return response.data;
};

export const getRecruiterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/recruiters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRecruiterById = async (id: string) => {
  const response = await axios.delete(`/api/recruiters/${id}`);
  return response.data;
};
