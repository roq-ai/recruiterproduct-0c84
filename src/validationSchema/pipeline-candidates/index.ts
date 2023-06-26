import * as yup from 'yup';

export const pipelineCandidateValidationSchema = yup.object().shape({
  pipeline_id: yup.string().nullable().required(),
  candidate_id: yup.string().nullable().required(),
});
