import * as yup from 'yup';

export const candidateValidationSchema = yup.object().shape({
  name: yup.string().required(),
  job_role: yup.string().required(),
  function: yup.string().required(),
  industry: yup.string().required(),
  client: yup.string().required(),
  recruiter_id: yup.string().nullable().required(),
});
