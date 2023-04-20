import CaptionCarousel from "./CaptionCarousel";
import "./LandingPage.css";
import Search from "./Search";
import Info1 from "./Info1";
import TimeContainer from "./TimeContainer";
import ImageFooter from "./ImageFooter";
import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import mydata from "./data";
import moment from "moment-timezone";
import Cookies from "universal-cookie";

function LandingPage() {
  const [day, setDay] = useState("Today");
  //const [pref, set_pref] = useState("Casual");
  const [pref, set_pref] = useState({
    preference: "Casual",
    pref_id: 3,
  });
  const [style, setStyle] = useState({
    feel: "Cold",
    feel_id: 6,
  });
  const [weather_data, set_weather_data] = useState(null);
  //const [clothes_data, set_clothes_data] = useState(null);
  const [act_data, set_act_data] = useState(mydata);
  const [send_search, set_send_search] = useState(act_data[0]);
  const [searchip, setSearchip] = useState(0);
  const today = new Date();
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [hourlyInfo, set_hourly_info] = useState([]);
  const [weekly_data, set_weekly_data] = useState([]);
  const [recommend_data, set_recommend_info] = useState([]);
  const [timezone_id, set_timezone] = useState("");
  const [loc_id, set_location_id] = useState("");
  const [recommDay, set_recomm_day] = useState("Today");
  const [timeSelected, set_time_selected] = useState("");
  const [dsearch, dataHourlyInSearch] = useState({
    Temperature: "",
    Alert: "",
    Forecast: "",
    ApparentTemp: "",
    PrecipitationPotential: "",
    wind: "",
    windDire: "",
  });
  let curr_day_idx = today.getDay();
  let apparentTemperature = 0;
  // const [locationVals, location_Data] = useState({
  //   location_id:'',
  //   postal_code :'',
  //   city:'',
  //   state:'',
  //   latitude:'',
  //   longitude:'',
  //   isAvailable : ''
  // });
  const day_list = [];
  // Create an array to store the next 6 dates
  const nextDates = [];
  day_list.push(weekday[curr_day_idx]);
  let temp1 = (curr_day_idx + 1) % 7;

  while (temp1 !== curr_day_idx) {
    day_list.push(weekday[temp1]);
    temp1 = (temp1 + 1) % 7;
  }

  localStorage.setItem("searchip", 0);

  useEffect(() => {
    const cookies = new Cookies();
    const longitude = cookies.get("longitude");
    const latitude = cookies.get("latitude");
    if (typeof longitude != "undefined" && typeof latitude != "undefined") {
      cookies.remove("latitude");
      cookies.remove("longitude");
    }
    window.addEventListener("storage", () => {
      setDay(localStorage.getItem("day"));
      set_recomm_day(localStorage.getItem("day"));
      //setStyle(localStorage.getItem("style"));
      setSearchip(localStorage.getItem("searchip"));
      // alert(localStorage.getItem("searchip"));
      //set_pref({localStorage.getItem("pref"))
    });
  }, [searchip]);

  useEffect(() => {
    get_data_for_info1();
  }, [searchip]);

  useEffect(() => {
    send_info_search();
  }, [day]);

  async function get_data_for_info1(event) {
    try {
      let res = await axios.get(
        "http://localhost:4000/weatherAPI/getWeatherData/" + searchip
      );
      set_weather_data(res.data);
      res.data.sort(function (a, b) {
        return day_list.indexOf(a.day) - day_list.indexOf(b.day);
      });
      set_act_data(res.data);
      if (res.data.length === 0) {
        set_act_data(mydata);
      }
    } catch (err) {
      console.log(err);
    }
  }

  window.addEventListener("storage", get_data_for_info1);
  const curr_hour = today.getHours();
  const time_list = [];
  const curr_str = curr_hour.toString();
  if (curr_str.length === 1) {
    time_list.push("0" + curr_str);
  } else time_list.push(curr_str);
  let temp = (curr_hour + 1) % 24;
  while (temp !== curr_hour) {
    var tempstr = temp.toString();
    if (tempstr.length === 1) {
      tempstr = "0" + tempstr;
    }
    time_list.push(tempstr);
    temp = (temp + 1) % 24;
  }

  //sending data to search.js
  //day
  function send_info_search() {
    if (localStorage.getItem("day") === "Today") {
      set_send_search(act_data[0]);
    }
    for (let i = 0; i < 7; i++) {
      let temp = localStorage.getItem("day");
      if (temp === act_data[i].day) {
        set_send_search(act_data[i]);
      }
    }
  }
  //for clothes
  useEffect(() => {
    //get_clothes_data();
    const getHourlyData = async () => {
      try {
        let res = await axios.get(
          "http://localhost:4000/weatherAPI/getWeatherDataHourly?id=1&tz=America/New_York&date=2023-04-09&day=today"
        );
        //console.log(res.data)
        set_hourly_info(res.data);
        apparentTemperature = res.data[0].ApparentTemp;
        getrecommends(apparentTemperature, 3);
      } catch (err) {
        console.log(err);
      }
    };
    const getWeeklyData = async () => {
      set_weekly_data([]);
      let finalResult = [];
      let timezone = "America/New_York";
      const currentDate = moment().tz(timezone); // Replace "Your_Timezone" with the desired timezone

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
        //}
        // for (let i = 0; i <= 6; i++) {
        try {
          let res = [];
          res = await axios.get(
            "http://localhost:4000/weatherAPI/getWeatherDataWeekly?id=1&tz=America/New_York&date=" +
              formattedDate
          );
          //set_weekly_data(res.data);
          res.data[0].date = formattedDate;
          res.data[0].day = dayOfWeek;
          finalResult.push(res.data);
          //set_weekly_data((prevArray) => [...prevArray, res.data]);
        } catch (err) {
          console.log(err);
        }
      }
      set_weekly_data(finalResult);
    };
    const getrecommends = async (appTemp, prefid) => {
      set_recommend_info([]);
      try {
        let res = await axios.get(
          "http://localhost:4000/recommendAPI/getRecommendations?apparentTemp=" +
            appTemp +
            "&prefId=" +
            prefid
        );
        console.log("recommend");
        console.log(res.data);
        set_recommend_info(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getHourlyData();
    getWeeklyData();
  }, []);
  // async function get_clothes_data() {
  //   let tempday = day;
  //   if (day === "Today") {
  //     tempday = weekday[curr_day_idx];
  //   }
  //   try {
  //     let res = await axios.get("http://localhost:4000/clothAPI/getClothing/" + searchip + "/" + pref + "/" + tempday);
  //     set_clothes_data(res.data);

  //     if (res.data === "EMPTY") {
  //       set_clothes_data(null)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  const updateCount = (newCount) => {
    set_recomm_day(newCount);
  };
  // const handleLocChange = (newLocData) => {
  //   location_Data(newLocData);
  //   // Do something with data1
  // };

  return (
    <ChakraProvider>
      <div className="Landing">
        {/* <Search day={day} setStyle={setStyle} setSearchip1={setSearchip} set_pref={set_pref} set_location_id = {set_location_id} set_recommend_info={set_recommend_info}
        send_search={send_search} act_data={act_data} set_weekly_data={set_weekly_data} set_hourly_info={set_hourly_info} locationVals={locationVals} /> */}
        <Search
          day={day}
          setStyle={setStyle}
          set_pref={set_pref}
          pref={pref}
          set_recommend_info={set_recommend_info}
          set_timezone={set_timezone}
          dsearch={dsearch}
          set_weekly_data={set_weekly_data}
          set_hourly_info={set_hourly_info}
          set_location_id={set_location_id}
          dataHourlyInSearch={dataHourlyInSearch}
        />
        {/* <Search day={day} setStyle={setStyle} setSearchip1={setSearchip} set_pref={set_pref} dataHourly={hourlyInfo} /> */}
        <CaptionCarousel
          day={day}
          style={style}
          setDay={setDay}
          pref={pref}
          timeSelected={timeSelected}
          recommDay={recommDay}
          recommend_data={recommend_data}
        />
        <TimeContainer
          set_time_selected={set_time_selected}
          dataHourlyInSearch={dataHourlyInSearch}
          hourlyInfo={hourlyInfo}
          set_recommend_info={set_recommend_info}
        />
        {/* <Info1 setDay={setDay}  day_list={day_list} act_data={act_data} weekly_data={weekly_data} recommDay = {recommDay}/> */}
        <Info1
          setDay={setDay}
          recommDay={recommDay}
          updateCount={updateCount}
          loc_id={loc_id}
          day_list={day_list}
          set_hourly_info={set_hourly_info}
          weekly_data={weekly_data}
          timezone_id={timezone_id}
        />
        <ImageFooter />
      </div>
    </ChakraProvider>
  );
}

export default LandingPage;
