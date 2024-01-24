// import React, { useState, useEffect } from 'react';
// import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import axios from 'axios';

// const TablePage = () => {
//   const [data, setData] = useState([]);

//   const token = localStorage.getItem('accessToken');

//   const columns = [
//     { field: 'id', headerName: 'S no.', width: 70 },
//     { field: 'firstName', headerName: 'First name', width: 130 },
//     { field: 'lastName', headerName: 'Last name', width: 130 },
//     {
//       field: 'age',
//       headerName: 'Age',
//       type: 'number',
//       width: 90,
//     },
//     {
//       field: 'fullName',
//       headerName: 'Full name',
//       description: 'This column has a value getter and is not sortable.',
//       sortable: false,
//       width: 160,
//       valueGetter: (params) =>
//         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//     },
//   ];
//   const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//   ];

//   useEffect(() => {
//     // Replace 'https://api.example.com/data' with the actual API endpoint
//     axios.get('http://127.0.0.1:3000/api/auth/userData', {
//       headers: {
//         accessToken: token
//       }
//     })
//       .then(response => {
//         setData(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, [token]); // Include 'token' in the dependency array to trigger a re-fetch when the token changes


//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//       />
//     </div>
//   );
// //   return (
// //     <Paper>
// //       <TableContainer>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>S NO.</TableCell>
// //               <TableCell>First Name</TableCell>
// //               <TableCell>Last Name</TableCell>
// //               <TableCell>City</TableCell> {/* Assuming 'city' is a property in your data */}
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {data.map((row, index) => (
// //               <TableRow key={index}>
// //                 <TableCell>{index + 1}</TableCell>
// //                 <TableCell>{row.firstName}</TableCell>
// //                 <TableCell>{row.lastName}</TableCell>
// //                 <TableCell>{row.city}</TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //     </Paper>
// //   );
// };

// export default TablePage;


import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const TablePage = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('accessToken');

  const columns = [
    { field: 'id', headerName: 'S no.', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 350,
      },
  ];

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/api/auth/userData', {
      headers: {
        accessToken: token,
      },
    })
      .then(response => {
        // Add a unique identifier to each row
        const rowsWithId = response.data.map((row, index) => ({ ...row, id: index }));
        setData(rowsWithId);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [token]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        pagination
      />
    </div>
  );
};

export default TablePage;
