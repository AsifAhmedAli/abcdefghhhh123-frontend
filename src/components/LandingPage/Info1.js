import React, { useEffect, useState } from 'react'
import Info1Container from './Info1Container';
import axios from "axios";
import { Image } from '@chakra-ui/react'
import { Button, Text } from '@chakra-ui/react'

import {
    Box,
    Img,
    useColorModeValue,
} from '@chakra-ui/react';

const Info1 = ({weekly_data,updateCount,timezone_id,set_hourly_info,loc_id}) => {
    //const day_list = props.day_list;
    //const data2=props.set_recomm_day;
    const data = weekly_data;
    //console.log("dt"+data2)
    console.log("tz"+timezone_id)
    console.log(loc_id)
    function handleClick(day,date) {
        console.log(date)
        updateCount(day);
        localStorage.setItem("day", day);
        getHourlyData(loc_id,date)
        //props.set_recomm_day(day)
        // var date = new Date();
        // var currday = date.getDay();
        // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // props.setDay(day);
        // if (weekday[currday] === day) {
        //     localStorage.setItem("day", "Today");
        //     props.setDay("Today")
        // }
        const element = document.getElementById('cont');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    const getHourlyData= async(locid,dateWeekly)=>{
        try {
          let res = await axios.get("http://localhost:4000/weatherAPI/getWeatherDataHourly?id="+locid+"&tz="+timezone_id+"&date="+dateWeekly+"&day=other");
          //console.log(res.data)
          if(res.data.length > 0){
            console.log(res.data)
            set_hourly_info(res.data);
          }
          else{
            set_hourly_info([]);
          }
        } catch (err) {
          console.log(err)
        }
      }
    // const getrecommends = async(appTemp,prefid) => {
    // set_recommend_info([]);
    // try {
    //     let res = await axios.get("http://localhost:4000/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&prefId="+prefid);
    //     console.log("recommend")
    //     console.log(res.data)
    //     set_recommend_info(res.data);
    // } catch (err) {
    //     console.log(err)
    // }
    // }
    return (
        <div className='timediv'>
            {/* <Info1Container day="Today" setDay={props.setDay} weather_data={props.act_data[0]} />
            <Info1Container day={day_list[1]} setDay={props.setDay} weather_data={props.act_data[1]} />
            <Info1Container day={day_list[2]} setDay={props.setDay} weather_data={props.act_data[2]} />
            <Info1Container day={day_list[3]} setDay={props.setDay} weather_data={props.act_data[3]} />
            <Info1Container day={day_list[4]} setDay={props.setDay} weather_data={props.act_data[4]} />
            <Info1Container day={day_list[5]} setDay={props.setDay} weather_data={props.act_data[5]} />
            <Info1Container day={day_list[6]} setDay={props.setDay} weather_data={props.act_data[6]} /> */}
            {data.map((item,index) => (
                // <Info1Container key = {index} setDay={props.setDay} set_recomm_day={props.set_recomm_day} weekly_data={item} />
                <Box key={index}
            // w="280px"
            mx="0vw"
            margin={"10px"}
            bg = {"#EFEFEF"}
            // bg={props.day === "Today" ? 'gray.500' : checkday() ? "gray.200" : "white"}
            // border={'1px'}
            // borderColor="black"
            >
            <div className='infocont'>
                <div className = 'infoDiv'>
                    <Box p={1}>
                        <Box
                            px={2}
                            py={1}
                            color="black"
                            // mb={2}
                            >
                            <Text fontFamily={"Karma"} fontSize={'xl'} fontWeight="bold" textAlign="center">
                                {item[0].day}
                            </Text>
                        </Box>
                    </Box>
                    <Text fontFamily={"Karma"} marginLeft={"1vw"}>Min Temp: {item[0].min_temp}° F</Text>
                    <Text fontFamily={"Karma"} marginLeft={"1vw"}>Max Temp: {item[0].max_temp}° F</Text>
                    <Text fontFamily={"Karma"} marginLeft={"1vw"}>Wind: {item[0].avg_SurfaceWind}</Text>
                </div>
                <div className='infoImgDiv'>
                    <Image float={"left"} src={require('./ImagesForProj/snow.png')} alt='op' h="4vh" />
                    <Text float={"left"} fontFamily={"Karma"}>{item[0].forecast}</Text>
                </div>
            </div>
            <Button bottom="0" width={"100%"} variant="solid" colorScheme={"black"} bg="black" 
                onClick={() => handleClick(item[0].day,item[0].date)}
            >
                <Text fontFamily={"Karma"} textAlign={"center"} bottom="0" bg="black" color="white" w="90%" m="auto">{item[0].day} recommends</Text>
            </Button>
        </Box>
            ))}
        </div>
    )
}

export default Info1
