// App.js
import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/signUp';
import TablePage from './pages/user';
import MultiStepForm from './pages/userForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/tablePage' element={<TablePage/>}/>
        <Route path='/userForm' element={<MultiStepForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;
