import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: theme.spacing(2),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
    width: '50%',
    maxWidth: '500px',
    backgroundColor: '#f5f5f5',
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    width: '50%',
    maxWidth: '500px',
  },
  formTitle: {
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  addButton: {
    marginLeft: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const FreeFormTableForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTableData([...tableData, formData]);
    setFormData({});
  };

  const handleTableDelete = (index) => {
    const newTableData = [...tableData];
    newTableData.splice(index, 1);
    setTableData(newTableData);
  };

  const handleTableClear = () => {
    setTableData([]);
  };

  const handleTableSubmit = async () => {
    try {
      const promises = tableData.map((data) =>
        axios.post('/api/tableData', data)
      );
      await Promise.all(promises);
      setTableData([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.formContainer} onSubmit={handleFormSubmit}>
        <Typography variant="h6" className={classes.formTitle}>
          Free Form
        </Typography>
        <TextField
          className={classes.formField}
          label="Name"
          name="name"
          value={formData.name || ''}
          onChange={handleFormChange}
        />
        <TextField
          className={classes.formField}
          label="Email"
          name="email"
          value={formData.email || ''}
          onChange={handleFormChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Add to Table
        </Button>
      </form>
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  name="name"
                  value={data.name}
                  onChange={(e) => handleTableChange(e, index)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="email"
                  value={data.email}
                  onChange={(e) => handleTableChange(e, index)}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleTableDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        className={classes.addButton}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddRow}
      >
        Add Row
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleTableClear}
      >
        Clear Table
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleTableSubmit}
      >
        Submit Table
      </Button>
    </TableContainer>
  </div>
  );
}