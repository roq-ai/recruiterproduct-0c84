import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPipelineCandidateById, updatePipelineCandidateById } from 'apiSdk/pipeline-candidates';
import { Error } from 'components/error';
import { pipelineCandidateValidationSchema } from 'validationSchema/pipeline-candidates';
import { PipelineCandidateInterface } from 'interfaces/pipeline-candidate';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PipelineInterface } from 'interfaces/pipeline';
import { CandidateInterface } from 'interfaces/candidate';
import { getPipelines } from 'apiSdk/pipelines';
import { getCandidates } from 'apiSdk/candidates';

function PipelineCandidateEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PipelineCandidateInterface>(
    () => (id ? `/pipeline-candidates/${id}` : null),
    () => getPipelineCandidateById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PipelineCandidateInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePipelineCandidateById(id, values);
      mutate(updated);
      resetForm();
      router.push('/pipeline-candidates');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PipelineCandidateInterface>({
    initialValues: data,
    validationSchema: pipelineCandidateValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Pipeline Candidate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <AsyncSelect<PipelineInterface>
              formik={formik}
              name={'pipeline_id'}
              label={'Select Pipeline'}
              placeholder={'Select Pipeline'}
              fetcher={getPipelines}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<CandidateInterface>
              formik={formik}
              name={'candidate_id'}
              label={'Select Candidate'}
              placeholder={'Select Candidate'}
              fetcher={getCandidates}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'pipeline_candidate',
  operation: AccessOperationEnum.UPDATE,
})(PipelineCandidateEditPage);
