import React, { useState } from 'react';
import { styled } from '@mui/system';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Container,
} from '@mui/material';

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme => theme.spacing(3),
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme => theme.spacing(2),
});

const useStyles = styled('div')({
  width: '100%',
});

const steps = ['Step 1', 'Step 2', 'Step 3'];

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (fieldName) => (event) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <TextField
            label="Field 1"
            value={formData.field1}
            onChange={handleInputChange('field1')}
          />
        );
      case 1:
        return (
          <TextField
            label="Field 2"
            value={formData.field2}
            onChange={handleInputChange('field2')}
          />
        );
      case 2:
        return (
          <TextField
            label="Field 3"
            value={formData.field3}
            onChange={handleInputChange('field3')}
          />
        );
      default:
        return 'Unknown stepIndex';
    }
  };

  return (
    <Container className={useStyles}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <FormContainer>
        <Typography variant="h6">{steps[activeStep]}</Typography>
        {getStepContent(activeStep)}
        <ButtonContainer>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="contained"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </Container>
  );
};

export default MultiStepForm;
