import React, { useEffect, useState } from "react";
import {
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Text, Flex, Box, Image } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import Settings from "./Setting";
import "./Search.css";
import axios from "axios";
import Test from "./Test";
import Cookies from "universal-cookie";
import moment from "moment-timezone";

const Search = ({
  props,
  setStyle,
  set_pref,
  set_timezone,
  set_hourly_info,
  set_weekly_data,
  set_location_id,
  pref,
  dataHourlyInSearch,
  dsearch,
  set_recommend_info,
}) => {
  let timeZoneId = "";
  const [postal_code, postalCodeData] = useState("");
  const [yesshowdata, setyesshowdata] = useState(false);
  const togglekrady = () => {
    setyesshowdata(!yesshowdata);
  };
  //     const [dsearch,dataHourlyInSearch] = useState({
  //         Temperature : "",
  //         Alert:"",
  //         Forecast:"",
  //         ApparentTemp:"",
  //         PrecipitationPotential : "",
  //         wind:"",
  //         windDire:""
  // });
  const nextDates = [];
  // const [locationVals, location_Data] = useState({
  //     location_id:'',
  //     postal_code :'',
  //     city:'',
  //     state:'',
  //     latitude:'',
  //     longitude:'',
  //     isAvailable : ''
  //   });
  const [valueFromChild, setValueFromChild] = useState({
    postalCaode: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    country: "",
    tz: "",
    IsAvailable: false,
  });

  // Callback function to receive value from child component
  const handleValueFromChild = (value) => {
    setValueFromChild(value);
    checkifDataExists(value);
  };
  const checkifDataExists = async (valuedData) => {
    try {
      let res = [];
      //   console.log("asdf" + valuedData.longitude);
      if (valuedData.postalCaode === "")
        res = await axios.get(
          "http://localhost:4000/locationAPI/checkLocation?city=" +
            valuedData.city
        );
      else
        res = await axios.get(
          "http://localhost:4000/locationAPI/checkLocationPostal?postal=" +
            valuedData.postalCaode
        );
      if (res.data.message == "city does not exist") {
        // onLocChange({
        //     ...locationVals,
        //     city:valuedData.city,
        //     latitude:valuedData.latitude,
        //     longitude:valuedData.longitude
        //   });
        set_location_id(0);
        console.log("citydoesnot");
        postalCodeData("");
        await getGoogleTimeZone(valuedData.latitude, valuedData.longitude);
        const cookies = new Cookies();
        cookies.set("longitude", valuedData.longitude, { path: "/" });
        cookies.set("latitude", valuedData.latitude, { path: "/" });

        await getHourlyData(0);
        await getWeeklyData(0);
      } else {
        // onLocChange({
        //     ...locationVals,
        //     location_id:res.data.location_id,
        //     postal_code :res.data.postal_code,
        //     city:res.data.city,
        //     state:res.data.state,
        //     latitude:res.data.latitude,
        //     longitude:res.data.longitude,
        //     isAvailable : res.data.isAvailable
        //   });
        set_location_id(res.data.location_id);
        console.log("cityexists");
        postalCodeData(res.data.postal_code);
        console.log(postal_code);
        await getGoogleTimeZone(res.data.latitude, res.data.longitude);
        await getHourlyData(res.data.location_id);
        await getWeeklyData(res.data.location_id);
      }
    } catch (err) {
      // else{
      //     let res = await axios.get("http://localhost:4000/locationAPI/checkLocationPostal?postal="+valuedData.postalCaode);
      //     //props.set_location_id(res.data.location_id);
      //     console.log("postal data")
      //     console.log(res.data)
      //     // onLocChange({
      //     //     ...locationVals,
      //     //     location_id:res.data.location_id,
      //     //     postal_code :res.data.postal_code,
      //     //     city:res.data.city,
      //     //     state:res.data.state,
      //     //     latitude:valuedData.latitude,
      //     //     longitude:valuedData.longitude,
      //     //     isAvailable : res.data.isAvailable
      //     //   });
      //       console.log("locs")
      //       //console.log(locationVals)
      //       await getGoogleTimeZone(valuedData.latitude,valuedData.longitude);
      //       await getHourlyData(res.data.location_id);
      //       await getWeeklyData(res.data.location_id);
      // }
      console.log(err);
    }
  };
  const getHourlyData = async (locid) => {
    console.log("in hourly");
    try {
      let res = await axios.get(
        "http://localhost:4000/weatherAPI/getWeatherDataHourly?id=" +
          locid +
          "&tz=" +
          timeZoneId +
          "&date=2023-04-10&day=today"
      );
      //console.log(res.data)
      if (res.data.length > 0) {
        dataHourlyInSearch({
          Temperature: res.data[0].Temperature,
          Forecast: res.data[0].Forecast,
          ApparentTemp: res.data[0].ApparentTemp,
          PrecipitationPotential: res.data[0].PrecipitationPotential,
          wind: res.data[0].SurfaceWind,
          windDire: res.data[0].WindDir,
        });
        set_hourly_info(res.data);
      } else {
        set_hourly_info([]);
        dataHourlyInSearch([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getWeeklyData = async (locid) => {
    set_weekly_data([]);
    if (locid != 0) {
      let finalResult = [];
      //let timezone = 'America/New_York';
      const currentDate = moment().tz(timeZoneId); // Replace "Your_Timezone" with the desired timezone

      // Loop to get the next 6 dates
      for (let i = 1; i <= 6; i++) {
        // Add i days to the current date to get the next date
        const nextDate = moment(currentDate).add(i, "days");

        // Format the next date in "mm-dd-yyyy" format
        const formattedDate = nextDate.format("YYYY-MM-DD");

        // Get the day of the week for the next date
        const dayOfWeek = nextDate.format("dddd");

        // Push the formatted date and day of the week to the nextDates array
        nextDates.push({ date: formattedDate, day: dayOfWeek });
        try {
          let res = [];
          res = await axios.get(
            "http://localhost:4000/weatherAPI/getWeatherDataWeekly?id=" +
              locid +
              "&tz=" +
              timeZoneId +
              "&date=" +
              formattedDate
          );
          //set_weekly_data(res.data);
          if (res.data.length > 0) {
            res.data[0].date = formattedDate;
            res.data[0].day = dayOfWeek;
            finalResult.push(res.data);
          }
          //set_weekly_data((prevArray) => [...prevArray, res.data]);
        } catch (err) {
          console.log(err);
        }
      }
      set_weekly_data(finalResult);
    }
  };
  const getGoogleTimeZone = async (latitude, longitude, apiKey) => {
    try {
      apiKey = "AIzaSyAKvpQHMJ5tFlPqszuQ-cm96wBXmIefsbY";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(
          Date.now() / 1000
        )}&key=${apiKey}`
      );
      timeZoneId = response.data.timeZoneId;
      set_timezone(timeZoneId);
      // Handle timezone data as needed
      console.log("Timezone ID:", timeZoneId);
    } catch (error) {
      console.error("Error getting timezone:", error);
    }
  };
  //const hourlyInfo = props.hourlyInfo
  // const [inputs, setInputs] = useState({
  //     searchip: "",
  // });
  // const [weather_data, set_weather_data] = useState(null);
  // const handleChange = (e) => {
  //     setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };
  // const today = new Date();
  // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // let curr_day_idx = today.getDay();
  // const day_list = []
  // day_list.push(weekday[curr_day_idx])
  // let temp1 = (curr_day_idx + 1) % 7;

  // while (temp1 !== curr_day_idx) {
  //     day_list.push(weekday[temp1]);
  //     temp1 = (temp1 + 1) % 7;
  // }
  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     localStorage.setItem("searchip", inputs.searchip);
  //     props.setSearchip1(inputs.searchip);
  //     try {
  //         let res = await axios.get("http://localhost:4000/weatherAPI/getWeatherData/" + inputs.searchip);
  //         res.data.sort(function (a, b) {
  //             return day_list.indexOf(a.day) - day_list.indexOf(b.day);
  //         });
  //         set_weather_data(res.data[0])
  //     } catch (err) {
  //         console.log(err)
  //     }
  // };

  //const [send_search, set_send_search] = useState(props.act_data[0]);

  //useEffect(() => {
  //let day = localStorage.getItem("day");
  // for (let i = 0; i < 7; i++) {
  //     if (day === "Today") {
  //         set_send_search(props.act_data[0]);
  //         return;
  //     }
  //     let temp = weekday[today.getDay()];
  //     if (temp === props.act_data[i].day) {
  //         set_send_search(props.act_data[i]);
  //     }
  // }
  //}, [])
  return (
    <div className="searchdiv">
      <Settings
        position="absolute"
        top="0"
        right="0"
        setStyle={setStyle}
        pref={pref}
        set_pref={set_pref}
        set_recommend_info={set_recommend_info}
      />
      {/* <Settings position="absolute" top="0" right="0" setStyle={props.setStyle} set_pref={props.set_pref} /> */}
      {/* <Flex alignItems={"center"} justifyContent="center" pt="4vh" width={"40vw"} margin="auto">
                <InputGroup size='lg'>
                    <Input name="searchip" fontFamily={"Karma"} placeholder="Enter your postal code / city" h={"5vh"} onChange={handleChange} background="rgba(255,255,255,0.6)" color="black" />
                    <InputRightAddon children={<Button onClick={handleSubmit} ><Search2Icon width={"-moz-max-content"} /></Button>} h={"5vh"} />
                </InputGroup>
            </Flex> */}
      <Test onValueChange={handleValueFromChild}></Test>
      <Text
        textAlign={"center"}
        fontSize="3xl"
        color={"white"}
        mt={"1vh"}
        fontFamily={"Karma"}
      >
        {valueFromChild.city}({postal_code})
      </Text>
      <Grid
        templateColumns="repeat(2, 1fr)"
        marginTop={"1vh"}
        display={"flex"}
        flexWrap="wrap"
        justifyContent={"space-around"}
      >
        <GridItem mb="2vh">
          <Box p={4}>
            <Box px={2} py={1} color="black" mb={2} className="text_bkg_box">
              <div className="startcontimg">
                <Image
                  src={require("./ImagesForProj/temp_main.png")}
                  alt="op"
                  h="4vh"
                />
                <Text
                  fontSize={"3xl"}
                  fontFamily={"Karma"}
                  fontWeight="medium"
                  textAlign="center"
                >
                  {/* {(props.send_search.temperature !== '15' && props.send_search.temperature) || (weather_data && weather_data.temperature) || (18)} ° F */}
                  {/* {props.set_hourly_info[0].Temperature}° F */}
                  {dsearch.Temperature}° F
                </Text>
              </div>
            </Box>
          </Box>
        </GridItem>
        <GridItem mb="2vh">
          <Box p={4}>
            <Box px={2} py={1} color="black" mb={2} className="text_bkg_box">
              <div className="startcontimg">
                <Image
                  src={require("./ImagesForProj/cloudy.png")}
                  alt="op"
                  h="4vh"
                />
                <Text
                  fontSize={"3xl"}
                  fontFamily={"Karma"}
                  fontWeight="medium"
                  textAlign="center"
                >
                  {/* {(props.send_search.discription !== "Cloudy" && props.send_search.discription) || (weather_data && weather_data.discription)
                                        || ("Sunny")
                                    } */}
                  {dsearch.Forecast}
                </Text>
              </div>
            </Box>
          </Box>
        </GridItem>
        <GridItem mb="2vh">
          <Box p={4}>
            <Box px={2} py={1} color="black" mb={2} className="text_bkg_box">
              <div className="startcontimg">
                <Image
                  src={require("./ImagesForProj/wind_main.png")}
                  alt="op"
                  h="4vh"
                />
                <Text
                  fontSize={"3xl"}
                  fontFamily={"Karma"}
                  fontWeight="medium"
                  textAlign="center"
                >
                  {dsearch.wind} mph {dsearch.windDire}
                  {/* {(props.send_search.surface_wind != "10" && props.send_search.surface_wind) || (weather_data && weather_data.surface_wind) || (10)}
                                    mph {(props.send_search.wind_direction !== "WS" && props.send_search.wind_direction) || (weather_data && weather_data.wind_direction) || ("NW")} */}
                </Text>
              </div>
            </Box>
          </Box>
        </GridItem>
        <GridItem mb="2vh">
          <Box p={4}>
            <Box px={2} py={1} color="black" mb={2} className="text_bkg_box">
              <div className="startcontimg">
                <Image
                  src={require("./ImagesForProj/feelslike_main.png")}
                  alt="op"
                  h="4vh"
                />
                <Text
                  fontSize={"3xl"}
                  fontFamily={"Karma"}
                  fontWeight="medium"
                  textAlign="center"
                >
                  {dsearch.ApparentTemp}° F
                  {/* {(props.send_search.feels_like !== "15" && props.send_search.feels_like) || (weather_data && weather_data.feels_like) || (!weather_data && 13)}° F */}
                </Text>
              </div>
            </Box>
          </Box>
        </GridItem>
        <GridItem mb="2vh">
          <Box p={4}>
            <Box px={2} py={1} color="black" mb={2} className="text_bkg_box">
              <div className="startcontimg">
                <Image
                  src={require("./ImagesForProj/snow.png")}
                  alt="op"
                  h="4vh"
                />
                <Text
                  fontSize={"3xl"}
                  fontFamily={"Karma"}
                  fontWeight="medium"
                  textAlign="center"
                >
                  {/* 8% High Chance Of Rain */}
                  {dsearch.PrecipitationPotential} %
                </Text>
              </div>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Search;
