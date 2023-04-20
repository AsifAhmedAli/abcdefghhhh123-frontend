import React, { useState } from "react";

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
function DataTable({ tableData }) {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [toastMessge, setToastMessge] = useState();
  const [open, setOpen] = useState(false);
  const [openItemDialogue, setOpenItemDialogue] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [updateRecordModal, setUpdateRecordModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [data, setData] = useState(tableData);
  const [activeIndex, setActiveIndex] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [values, setValues] = React.useState({
    prefCatType: "",
    preference: "",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    const dataToAdd = {
      prefCatType: values.prefCatType,
      preference: values.preference,
    };
    const newDataArray = [...data, dataToAdd];
    setData(newDataArray);
    setOpenAlert(true);
    setToastMessge("New Record Added Successfully!");
    setRecordModal(false);
    setValues({
      prefCatType: "",
      preference: "",
    });
  };

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
      label: "PrefCatType",
      name: "prefCatType",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: "Preference",
      name: "preference",
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
                  onClick={() => updateRecord(dataIndex)}
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
    responsive: "vertical",
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
    setOpenItemDialogue(false);
  };
  const confirmDelete = () => {
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

  const updateRecord = (id) => {
    setActiveIndex(id);
    setValues(data[id]);
    setUpdateRecordModal(true);
  };
  const handleUpdate = (event) => {
    event.preventDefault();
    const dataToUpdate = [...data];
    dataToUpdate[activeIndex] = values;
    setData(dataToUpdate);
    setUpdateRecordModal(false);
    setValues({
      prefCatType: "",
      preference: "",
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
          Add
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
        <DialogTitle id="alert-dialog-title">{"Add a new record "}</DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-prefCatType">
                PrefCatType
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-prefCatType"
                value={values.prefCatType}
                onChange={handleChange("prefCatType")}
                label="PrefCatType"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference">
                Preference
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-preference"
                value={values.preference}
                onChange={handleChange("preference")}
                label="Preference"
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
        <DialogTitle id="alert-dialog-title">{"Update Record"}</DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-prefCatType">
                PrefCatType
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-prefCatType"
                value={values.prefCatType}
                onChange={handleChange("prefCatType")}
                label="PrefCatType"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference">
                Preference
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-preference"
                value={values.preference}
                onChange={handleChange("preference")}
                label="Preference"
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
