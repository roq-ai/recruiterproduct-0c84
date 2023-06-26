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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPipeline } from 'apiSdk/pipelines';
import { Error } from 'components/error';
import { pipelineValidationSchema } from 'validationSchema/pipelines';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RecruiterInterface } from 'interfaces/recruiter';
import { getRecruiters } from 'apiSdk/recruiters';
import { PipelineInterface } from 'interfaces/pipeline';

function PipelineCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PipelineInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPipeline(values);
      resetForm();
      router.push('/pipelines');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PipelineInterface>({
    initialValues: {
      name: '',
      recruiter_id: (router.query.recruiter_id as string) ?? null,
    },
    validationSchema: pipelineValidationSchema,
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
            Create Pipeline
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<RecruiterInterface>
            formik={formik}
            name={'recruiter_id'}
            label={'Select Recruiter'}
            placeholder={'Select Recruiter'}
            fetcher={getRecruiters}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'pipeline',
  operation: AccessOperationEnum.CREATE,
})(PipelineCreatePage);
