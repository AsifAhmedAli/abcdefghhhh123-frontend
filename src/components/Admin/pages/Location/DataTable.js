import React, { useState, useEffect } from "react";
import Autocomplete  from "react-google-autocomplete";

import {
  Tooltip,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Switch,
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
const axios = require("axios");
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
  const [updateAbleId, setUpdateAbleId] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [postalCodeData, setPostalCodeData] = useState([]);
  const [byZipCode, setByZipCode] = useState(false);
  const [zipCodeData, setzipCodeData] = useState([]);
  const [values, setValues] = React.useState({
    postalCaode: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    country: "",
    IsAvailable: false,
  });

  const handleChange = (prop) => (event) => {
    if (prop === "IsAvailable") {
      setValues({ ...values, [prop]: event.target.checked });
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const handleSubmit = async () => {
    const dataToAdd = {
      postalCaode:  values.postalCaode,
      latitude: values.latitude || zipCodeData[0].latitude,
      longitude: values.longitude || zipCodeData[0].longitude,
      city: values.city || zipCodeData[0]['place name'],
      state: values.state || zipCodeData[0].state,
      IsAvailable: values.IsAvailable === false || values.IsAvailable === undefined ? 'No' : 'Yes',
    };
    const dataByLocation = postalCodeData && postalCodeData?.length > 0 && postalCodeData.map(a => ({
      postal_code:  a['post code'],
      latitude: a.latitude, 
      longitude: a.longitude,
      city: a['place name'],
      state: values.state,
      isAvailable: values.IsAvailable === false || values.IsAvailable === undefined ? 'No' : 'Yes',
    }))
    const dataByPostalCode = {
      postal_code:  values.postalCaode,
      latitude: values.latitude || zipCodeData[0] && zipCodeData[0].latitude,
      longitude: values.longitude || zipCodeData[0] && zipCodeData[0].longitude,
      city: values.city || zipCodeData[0] && zipCodeData[0]['place name'],
      state: values.state || zipCodeData[0] && zipCodeData[0].state,
      isAvailable: values.IsAvailable === false || values.IsAvailable === undefined ? 'No' : 'Yes',
    }
    console.log(values.IsAvailable,"")
console.log(values.IsAvailable === false ? 'No' : 'Yes',"")
    await fetch("http://localhost:4000/locationAPI/addLocation", {
      method: "POST",
      body: JSON.stringify(dataByLocation?.length > 0 ? dataByLocation : dataByPostalCode),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    });
    fetchRecord();
    const newDataArray = [...data, dataToAdd];
    setData(newDataArray);
    setPostalCodeData([])
    setOpenAlert(true);
    setToastMessge("New Record Added Successfully!");
    setRecordModal(false);
    setValues({
      postalCaode: "",
      latitude: "",
      longitude: "",
      city: "",
      state: "",
      IsAvailable: false,
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
      label: "Postal Code",
      name: "postalCaode",
      options: {
        filter: true,
        sort: false,
        // customBodyRenderLite: (dataIndex) => {
        //   return (
        //     <Box
        //       sx={{
        //         display: "flex",
        //         maxWidth:'300px',
        //         overflow:'auto'
        //       }}
        //     >
        //       {data[dataIndex].postalCaode}
        //     </Box>
        //   );
        // },
      },
    },
    {
      label: "Latitude",
      name: "latitude",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: "Longitude",
      name: "longitude",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      label: "City",
      name: "city",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      label: "State",
      name: "state",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      label: "Is Available",
      name: "IsAvailable",
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
              {data[dataIndex].IsAvailable}
            </Box>
          );
        },
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
    setOpenItemDialogue(false);
  };
  useEffect(() => {
    setData(tableData);
  }, [tableData]);
  
  const confirmDelete = () => {
    fetch(`http://localhost:4000/locationAPI/deleteLocation/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    }).then(() => console.log("Delete successful"));
 
 
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
    await fetch("http://localhost:4000/locationAPI/editLocation", {
      method: "PUT",
      body: JSON.stringify({
        location_id: updateAbleId,
        isAvailable: values.IsAvailable === false ? 'No' : 'Yes',
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    });
 
    const dataToUpdate = [...data];
    dataToUpdate[activeIndex] = values;
    setData(dataToUpdate);
    setUpdateRecordModal(false);
    setValues({
      postalCaode: "",
      latitude: "",
      longitude: "",
      city: "",
      state: "",
      IsAvailable: false,
    });
    fetchRecord();
  };
useEffect(() => {
  if(!byZipCode){
    if(values.country !== '' && values.state !== '' && values.city !== ''){
      fetch(`https://community-zippopotamus.p.rapidapi.com/${values.country}/${values.state}/${values.city}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '9c04a9f33emshe7e6073d64b000fp13bc0fjsn009b1b772cff',
          'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
        },
      })
        .then(response => response.json())
        .then(response =>  setPostalCodeData(response?.places))
        .catch(err => console.error(err));
    }
  }else if(values.postalCaode !== ''){
    fetch(`https://community-zippopotamus.p.rapidapi.com/us/${values.postalCaode}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '9c04a9f33emshe7e6073d64b000fp13bc0fjsn009b1b772cff',
        'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
      },
    })
      .then(response => response.json())
      .then(response =>  setzipCodeData(response?.places))
      .catch(err => console.error(err));
  }



}, [values.country,values.city, values.state, values.postalCaode])

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
          Add Location
        </Button>
      </Box>
      {tableData.length > 0 && 
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
      />
    }
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
        <DialogTitle id="alert-dialog-title">{"Add a new record"}</DialogTitle>
      
        <Grid container spacing={2} px="20px">
        <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="outlined-adornment-IsAvailable">
             {!byZipCode ? "Search By Postal Code" : "Search by location"} 
            </InputLabel>
            <Switch
              checked={byZipCode}
              onChange={(e) => setByZipCode(e.target.checked)}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              {!byZipCode ? 
              <Autocomplete
                style={{ width: "100%", height: "52px", padding: "0px 16px" }}
                apiKey={"AIzaSyAKvpQHMJ5tFlPqszuQ-cm96wBXmIefsbY"}
                types={["(regions)", "postal_code"]}
                onPlaceSelected={(place) => {
               const { address_components } = place;
                  let city = "";
                  let state = "";
                  let country = "";

                  address_components.forEach((component) => {
                    const types = component.types;

                    if (types.includes("locality")) {
                      city = component.short_name;
                    }

                    if (types.includes("administrative_area_level_1")) {
                      state = component.short_name;
                    }

                    if (types.includes("country")) {
                      country = component.short_name;
                    }
                  });

                  setValues({
                    city: city,
                    state: state,
                    country:country,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                  });
                }}
              />
              :
         
              <FormControl fullWidth sx={{ marginBottom: "10px" }}>
                <InputLabel htmlFor="outlined-adornment-postalCaode">Postal Code</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-postalCaode"
                  value={values.postalCaode}
                  onChange={handleChange("postalCaode")}
                  label="Postal Code"
                  sx={{
                    width: "100%",
                  }}
                />
              </FormControl>
         
}
            </FormControl>
            
          </Grid>

          <Grid item xs={12} sm={12}>
            <InputLabel htmlFor="outlined-adornment-IsAvailable">
              IsAvailable
            </InputLabel>
            <Switch
              checked={values.IsAvailable}
              onChange={handleChange("IsAvailable")}
              color="primary"
            />
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
        sx={{
          minWidth:'400px'
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Update Record"}</DialogTitle>
        <Grid container spacing={2} px="20px"   sx={{
          minWidth:'400px'
        }}>
{/*         
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-latitude">
                Latitude
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-latitude"
                value={values.latitude}
                onChange={handleChange("latitude")}
                label="Latitude"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-longitude">
                Longitude
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-longitude"
                value={values.longitude}
                onChange={handleChange("longitude")}
                label="Longitude"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-city">City</InputLabel>
              <OutlinedInput
                id="outlined-adornment-city"
                value={values.city}
                onChange={handleChange("city")}
                label="City"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-state">State</InputLabel>
              <OutlinedInput
                id="outlined-adornment-state"
                value={values.state}
                onChange={handleChange("state")}
                label="State"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="outlined-adornment-IsAvailable">
              IsAvailable
            </InputLabel>
            <Switch
              checked={values.IsAvailable === 'No' ? false : true }
              onChange={handleChange("IsAvailable")}
              color="primary"
            />
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
