import * as yup from 'yup';

export const pipelineValidationSchema = yup.object().shape({
  name: yup.string().required(),
  recruiter_id: yup.string().nullable().required(),
});
