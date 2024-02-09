import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, TablePagination } from '@mui/material';
import axios from 'axios';
import './table.css'
const TablePage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = localStorage.getItem('accessToken');

  const columns = [
    // { id: 'id', label: 'S no.', minWidth: 70 },
    // { id: 'firstName', label: 'First name', minWidth: 130 },
    // { id: 'lastName', label: 'Last name', minWidth: 130 },
    { id: 'fullName', label: 'Full name'},
    { id: 'age', label: 'Age'},
    { id: 'email', label: 'Email' },
    { id: 'city', label: 'City'},
    { id: 'pinCode', label: 'Pin Code'},
    { id: 'location', label: 'Location'},
    { id: 'profession', label: 'Profession'},
    { id: 'project', label: 'Project'},
    { id: 'experience', label: 'Experience'},
    { id: 'projectDuration', label: 'Project Duration'},
    { id: 'profilePhoto', label: 'Profile Photo'},
    { id: 'documents', label: 'Documnets'},
  ];

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/api/auth/userData', {
      headers: {
        accessToken: token,
      },
    })
      .then(response => {
        // Add a unique identifier to each row
        const rowsWithId = response.data.map((row, index) => ({ ...row, id: index + 1 }));
        setData(rowsWithId);
        console.log(rowsWithId ,"ggggggggggggggggggggg")
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [token]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(row => {
    const { firstName, lastName, age, email } = row;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      firstName && firstName.toLowerCase().includes(lowerCaseQuery) ||
      lastName && lastName.toLowerCase().includes(lowerCaseQuery) ||
      age && age.toString().includes(lowerCaseQuery) ||
      email && email.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
        <div className="searchContainer">
      <TextField  className="searchBar"
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
      />
      </div>
      <TableContainer className="tableContainer">
        <Table className="table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} style={{ border: '1px solid #e0e0e0' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align} style={{ border: '1px solid #e0e0e0' }}>
                     {column.id === 'fullName' ? `${row.firstName} ${row.lastName}` :
                     column.id === 'location' ? `lat: ${row.location.lat} - lng: ${row.location.lng} ` :
                     column.id === 'projectDuration' ? `Start Date: ${row.projectDuration.startDate} - End Date: ${row.projectDuration.endDate}` :
                     column.id === 'documents' ? row.documents.join(' , ') :
                    row[column.id]}
                    {/* {row[column.id]} */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination className="pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TablePage;
