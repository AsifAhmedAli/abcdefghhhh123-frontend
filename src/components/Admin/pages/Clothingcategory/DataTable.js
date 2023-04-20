import React, { useState,useEffect } from "react";

import {
  Tooltip,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  // CircularProgress
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MUIDataTable from "mui-datatables";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function DataTable({ tableData, fetchRecord }) {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [toastMessge, setToastMessge] = useState();
  const [open, setOpen] = useState(false);
  const [openItemDialogue, setOpenItemDialogue] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [updateRecordModal, setUpdateRecordModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [data, setData] = useState(tableData);
  const [activeIndex, setActiveIndex] = useState();
  const [updateAbleId, setUpdateAbleId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [values, setValues] = React.useState({
    categoryName: "",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    const dataToAdd = {
      categoryName: values.categoryName,
    };
    await fetch("http://localhost:4000/clothCatAPI/addClothingCategory", {
      method: "POST",
      body: JSON.stringify({
        category_name: values.categoryName,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    });
    fetchRecord();
    const newDataArray = [...data, dataToAdd];
    setData(newDataArray);
    setOpenAlert(true);
    setToastMessge("New Record Added Successfully!");
    setRecordModal(false);
    setValues({
      categoryName: "",
    });
  };
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const columns = [
    {
      label: "ID",
      name: "id",
      options: {
        display: false,
        filter: false,
        sort: false,
      },
    },
    {
      label: "Category Name",
      name: "categoryName",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      label: "ACTIONS",
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Tooltip title="Edit Item" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => updateRecord(dataIndex, data[dataIndex].id)}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Item" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleClickOpen(data[dataIndex].id)}
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    },
  ];

  const options = {
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    filterType: "dropdown",
    responsive: "vertical",
    selectableRowsHeader: false,
    selectableRows: "none",
    onColumnSortChange: (changedColumn, direction) =>
      console.log("changedColumn: ", changedColumn, "direction: ", direction),
    onChangeRowsPerPage: (numberOfRows) =>
      console.log("numberOfRows: ", numberOfRows),
    onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
    onRowsDelete: () => {
      setOpen(true);
    },
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      const filteredData = rowsSelected.map((a) =>
        data.filter((record, index) => index === a)
      );
      const ids = filteredData.map((a) => a[0].id);
      setSelectedRows(ids);
    },
  };

  // Delete Modal
  const handleClickOpen = (id) => {
    setOpenItemDialogue(true);
    setItemId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleItemDialogueClose = () => {
    setOpen(false);
  };
  const confirmDelete = () => {
    fetch(
      `http://localhost:4000/clothCatAPI/deleteClothingCategory/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      }
    ).then(() => console.log("Delete successful"));
    fetchRecord();
    const filteredDataArray = data.filter((item) => item.id !== itemId);
    setData(filteredDataArray);
    setOpenAlert(true);
    setToastMessge("Deleted Successfully!");
    setOpenItemDialogue(false);
  };
  const confirmDeleteBulk = () => {
    setOpenAlert(true);
    const filteredDataArray = data.filter(
      (item) => !selectedRows.includes(item.id)
    );
    setData(filteredDataArray);
    setToastMessge("Deleted Successfully!");
    setOpen(false);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const updateRecord = (id, catId) => {
    setUpdateAbleId(catId);
    setActiveIndex(id);
    setValues(data[id]);
    setUpdateRecordModal(true);
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    await fetch("http://localhost:4000/clothCatAPI/editClothCategory", {
      method: "PUT",
      body: JSON.stringify({
        clothing_category_id: updateAbleId,
        category_name: values.categoryName,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    });
    fetchRecord();
    const dataToUpdate = [...data];
    dataToUpdate[activeIndex] = values;
    setData(dataToUpdate);
    setUpdateRecordModal(false);
    setValues({
      categoryName: "",
    });
  };

  const vertical = "bottom";
  const horizontal = "right";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
          p: 2,
        }}
      >
        <Button
          sx={{
            py: "10px",
            backgroundColor: "#000000",
          }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => setRecordModal(true)}
        >
          Add Category
        </Button>
      </Box>
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
      />
      {/* Toast */}
      <Box>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openAlert}
          autoHideDuration={1300}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {toastMessge && toastMessge}
          </Alert>
        </Snackbar>
      </Box>
      {/* Add New Record Popup */}
      <Dialog
        open={recordModal}
        onClose={() => setRecordModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add a new Category"}
        </DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-categoryName">
                Category Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-categoryName"
                value={values.categoryName}
                onChange={handleChange("categoryName")}
                label="Category Name"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={() => setRecordModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Update  Record Popup */}
      <Dialog
        open={updateRecordModal}
        onClose={() => setUpdateRecordModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Category"}</DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-categoryName">
                Category Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-categoryName"
                value={values.categoryName}
                onChange={handleChange("categoryName")}
                label="Category Name"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={() => setUpdateRecordModal(false)}>Cancel</Button>
          <Button onClick={handleUpdate} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Popup */}
      <Dialog
        open={openItemDialogue}
        onClose={handleItemDialogueClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to permanently remove this item?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleItemDialogueClose}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Bulk Records Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to permanently remove these items?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmDeleteBulk} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DataTable;
