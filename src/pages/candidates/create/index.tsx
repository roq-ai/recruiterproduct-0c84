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
import { createCandidate } from 'apiSdk/candidates';
import { Error } from 'components/error';
import { candidateValidationSchema } from 'validationSchema/candidates';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RecruiterInterface } from 'interfaces/recruiter';
import { getRecruiters } from 'apiSdk/recruiters';
import { CandidateInterface } from 'interfaces/candidate';

function CandidateCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CandidateInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCandidate(values);
      resetForm();
      router.push('/candidates');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CandidateInterface>({
    initialValues: {
      name: '',
      job_role: '',
      function: '',
      industry: '',
      client: '',
      recruiter_id: (router.query.recruiter_id as string) ?? null,
    },
    validationSchema: candidateValidationSchema,
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
            Create Candidate
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
          <FormControl id="job_role" mb="4" isInvalid={!!formik.errors?.job_role}>
            <FormLabel>Job Role</FormLabel>
            <Input type="text" name="job_role" value={formik.values?.job_role} onChange={formik.handleChange} />
            {formik.errors.job_role && <FormErrorMessage>{formik.errors?.job_role}</FormErrorMessage>}
          </FormControl>
          <FormControl id="function" mb="4" isInvalid={!!formik.errors?.function}>
            <FormLabel>Function</FormLabel>
            <Input type="text" name="function" value={formik.values?.function} onChange={formik.handleChange} />
            {formik.errors.function && <FormErrorMessage>{formik.errors?.function}</FormErrorMessage>}
          </FormControl>
          <FormControl id="industry" mb="4" isInvalid={!!formik.errors?.industry}>
            <FormLabel>Industry</FormLabel>
            <Input type="text" name="industry" value={formik.values?.industry} onChange={formik.handleChange} />
            {formik.errors.industry && <FormErrorMessage>{formik.errors?.industry}</FormErrorMessage>}
          </FormControl>
          <FormControl id="client" mb="4" isInvalid={!!formik.errors?.client}>
            <FormLabel>Client</FormLabel>
            <Input type="text" name="client" value={formik.values?.client} onChange={formik.handleChange} />
            {formik.errors.client && <FormErrorMessage>{formik.errors?.client}</FormErrorMessage>}
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
  entity: 'candidate',
  operation: AccessOperationEnum.CREATE,
})(CandidateCreatePage);
