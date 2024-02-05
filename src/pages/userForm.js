import React, { useState } from 'react';
import { styled } from '@mui/system';
import axios from 'axios';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Container,
  Paper,
  Box
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import DateRange from '../components/dateRangePicker';
import { formattedDate } from '../components/dateFormat';
import MapComponent from '../components/maps';
import SearchLocationInput from '../components/googleLocation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: `${theme.spacing(1)} 0`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const steps = ['Personal Details', 'Professional Details', 'Upload Documents'];

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [dateRange, setDateRange] = useState(false);
  const [skipped, setSkipped] = useState(new Set());
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const [selectedLocation, setSelectedLocation]=useState({
    lat:28.7041,
    lng:77.1025
  });
  const [formData, setFormData] = useState({
    // Initial form data state
    firstName: '',
    lastName: '',
    age: '',
    city: '',
    pinCode: '',
    // location: {
    //     lat:28.7041,
    //     lng:77.1025
    //   },
    // Step 2: Professional Details
    profession: '',
    experience: '',
    project: '',
    // projectDate: '',
    projectDuration: {
        startDate: formattedDate(new Date()),
        endDate:formattedDate(new Date()),
      },
    // Step 3: Profile Photo and Documents
    profilePhoto: '',
    documents: [],
  });
  console.log("ddddddddddddddddddd", formData.projectDuration)

  const isFormFilled = () => {
    switch (activeStep) {
      case 0:
        return formData.firstName !== '' &&
               formData.lastName !== '' &&
               formData.age !== '' &&
               formData.city !== '' &&
               formData.pinCode !== '' &&
               formData.location !== '';
      case 1:
        return formData.profession !== '' &&
               formData.experience !== '' &&
               formData.project !== '' &&
               formData.projectDuration !== '';
      case 2:
        return formData.profilePhoto !== null &&
               formData.documents.length > 0;
      default:
        return false;
    }
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleProjectDuration =() =>{
    setDateRange(true)
  };


  const handleInputChange = (fieldName) => (event) => {
    if (fieldName === 'projectDuration') {
      setDateRange(true);
    }
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const handleDateChange = (startDate,endDate) => {
    console.log(startDate,endDate,"newvalue")
    setFormData({
        ...formData,
        projectDuration: {
          startDate: startDate,
          endDate: endDate,
        },
      });
  };
console.log(formData,"formDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  const handleFileInputChange = (fieldName) => (event) => {
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", event.target.files)
    if (fieldName === 'documents') {
        // Get the list of files from the file input
        const fileList = event.target.files;
    
        // Convert the FileList to an array and update the formData state
        setFormData({
          ...formData,
          [fieldName]: event.target.files,
        });
      } else {
        // For single file inputs like profile photo
        setFormData({
          ...formData,
          [fieldName]: event.target.files[0],
        });
      }
  };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Make API call to post formData
//       const response = await axios.put('http://127.0.0.1:3000/api/auth/userData', {
//         headers: {
//             accessToken: token,
//           },
//         body: JSON.stringify(formData),
//       });
//       const data = await response.json();
//       console.log('Data posted successfully:', data);
//     } catch (error) {
//       console.error('Error posting data:', error);
//     }
//   };
//   const handleFinish = () => {
//     (activeStep === steps.length - 1) ? handleSubmit() : handleNext()
//   };
const handleFinish = async () => {
    if (activeStep === steps.length - 1) {
      try {
        // Make API call to upload profile photo
        console.log(formData.profilePhoto,"single photo console")
        const profilePhotoFormData = new FormData();
        profilePhotoFormData.append('file', formData.profilePhoto);
        console.log(profilePhotoFormData,"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
        await axios.post(`http://127.0.0.1:3000/api/auth/upload/${userId}`, profilePhotoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            accessToken: token,
          },
        });
  
        // Make API call to upload documents
        const documentsFormData = new FormData();
        // documentsFormData.append('documents', formData.documents);
        // formData.documents.forEach((document) => {

        // });
        console.log(formData.documents,"frontEnd Multiple docs")
        for(let i=0;i<formData.documents.length;i++)
        {
            documentsFormData.append("files",formData.documents[i])
        }
        try {
            const response = await axios.post(`http://127.0.0.1:3000/api/auth/documents/${userId}`,documentsFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    accessToken: token,
                },
            });
            console.log('Files uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
            // Handle error appropriately
        }
        const userFormPayload={...formData}
        userFormPayload.profilePhoto=formData.profilePhoto.name
        userFormPayload.location = selectedLocation
        let fileArray= []
        
        fileArray=Object.keys(formData.documents).map(item=>formData.documents[item].name)
        userFormPayload.documents=fileArray
  
        // Make API call to submit form data
        await axios.put('http://127.0.0.1:3000/api/auth/userFormData', userFormPayload, {
          headers: {
            'Content-Type': 'application/json',
            accessToken: token,
          },
        });
  
        console.log('Profile photo, documents, and form data submitted successfully.');
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      handleNext(); // Proceed to the next step
    }
  };
  console.log(formData.projectDuration.startDate,"dateeeeeeeeeeeeeeeeeeeeeeeeeeee")

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
            <>
                       <StyledTextField
                          label="First Name"
                          fullWidth
                          value={formData.firstName}
                          onChange={handleInputChange('firstName')}
                        />
                        <StyledTextField
                          label="Last Name"
                          fullWidth
                          value={formData.lastName}
                          onChange={handleInputChange('lastName')}
                        />
                        <StyledTextField
                          label="Age"
                          fullWidth
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange('age')}
                        />
                        <StyledTextField
                          label="City"
                          fullWidth
                          value={formData.city}
                          onChange={handleInputChange('city')}
                        />
                        <StyledTextField
                          label="Pin Code"
                          fullWidth
                          value={formData.pinCode}
                          onChange={handleInputChange('pinCode')}
                        />
                        {/* <StyledTextField
                          label="Location"
                          fullWidth
                          value={formData.location}
                          onChange={handleInputChange('location')}
                        /> */}
                          <SearchLocationInput setSelectedLocation={setSelectedLocation}/>
                           <MapComponent selectedLocation={selectedLocation}/>
                        </>
        );
      case 1:
        return (
          <>
            {/* Step 2: Professional Details */}
            <StyledTextField
              label="Profession"
              fullWidth
              value={formData.profession}
              onChange={handleInputChange('profession')}
            />
            <StyledTextField
              label="Experience"
              fullWidth
              value={formData.experience}
              onChange={handleInputChange('experience')}
            />
             <StyledTextField
                          label="Project"
                          fullWidth
                          value={formData.project}
                          onChange={handleInputChange('project')}
                        />
                        <StyledTextField
                         label="Project Duration"
                         fullWidth
                         value={`${formData.projectDuration.startDate} - ${formData.projectDuration.endDate}`}
                        //  onChange={handleInputChange('projectDuration')}
                         onClick={() => handleProjectDuration()}
                         >
                           
             </StyledTextField>
             {dateRange && (<DateRange onDateChange={handleDateChange}/>)}
          </>
        );
      case 2:
        return (
          <>
            {/* Step 3: Profile Photo and Documents */}
            <input
              accept="image/*"
            //   style={{ display: 'none' }}
              id="profile-photo-input"
              type="file"
              name="file"
              onChange={handleFileInputChange('profilePhoto')}
            />
            <label htmlFor="profile-photo-input">
              <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                Upload Profile Photo
              </Button>
            </label>
            {/* Multiple file upload for documents */}
            <input
              accept="image/*, .pdf"
            //   style={{ display: 'none' }}
              id="documents-input"
              type="file"
              name="files"
              multiple
              onChange={handleFileInputChange('documents')}
            />
            <label htmlFor="documents-input">
              <Button variant="contained" component="span">
                Upload Documents
              </Button>
            </label>
          </>
        );
      default:
        return 'Unknown stepIndex';
    }
  };

  return (
    <Container maxWidth="md">
          <StyledPaper elevation={3}>
    <Box sx={{ mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <StyledForm>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <StyledButton
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="contained"
          >
            Back
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleFinish}
            disabled={!isFormFilled()}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </StyledButton>
        </Box>
      </StyledForm>
    </Box>
    </StyledPaper>
  </Container>
  );
};

export default MultiStepForm;

