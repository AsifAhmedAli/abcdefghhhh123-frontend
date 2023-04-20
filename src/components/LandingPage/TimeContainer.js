import React from 'react'
import TimeContainerInner from "./TimeContainerInner"
import {
    Button,
    Box,
    Text,
    Image
} from '@chakra-ui/react'
import axios from "axios";

const TimeContainer = ({hourlyInfo,set_recommend_info,set_time_selected,dataHourlyInSearch}) => {
    let mylist = hourlyInfo;
    console.log(mylist)
    for (let i = 0; i < mylist.length; i++) {
        //const element = mylist[i];
        let dateNow = mylist[i].Date_Time !== null && mylist[i].Date_Time.split(",");
        const givenDate = new Date(dateNow[0]);
        const dateLet = new Date(dateNow);
        // Get month and day from the given date
        const givenMonth = String(givenDate.getMonth() + 1).padStart(2, '0');
        const givenDay = String(givenDate.getDate()).padStart(2, '0');
        let finalDate = `${givenMonth}/${givenDay}`;
        const givenHour = dateLet.toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true
        });
        const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
        //set time in banner default the first one
        // if(i==0)
        //     set_time_selected(mylist[0].formattedTime)
        mylist[i].finalDate = finalDate;
        mylist[i].formattedTime = formattedTime;
    }
      const handleButtonClick = (hourData) => {
        // Handle button click event here
        console.log("Button clicked!");
        set_time_selected(hourData.formattedTime)
        dataHourlyInSearch({
            Temperature : hourData.Temperature,
            Forecast : hourData.Forecast,
            ApparentTemp : hourData.ApparentTemp,
            PrecipitationPotential : hourData.PrecipitationPotential,
            wind : hourData.SurfaceWind,
            windDire : hourData.WindDir
          })
        getrecommends(hourData.ApparentTemp,3);
      };
    const getrecommends = async(appTemp,prefid) => {
        try {
            let res = await axios.get("http://localhost:4000/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&prefId="+prefid);
            console.log("recommend")
            console.log(res.data)
            set_recommend_info(res.data);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className='timedivHour'>
            {mylist.map((item,index) => (
                // <TimeContainerInner key={item.Date_Time} time={item} index={index+1} />
                <div key={index}>
                    <Text fontFamily={"Karma"}>{item.finalDate}</Text>
                    <Box as="button" w="70px" bg='#EFEFEF' p={1} color='black' mx="0.2rem" onClick={() => handleButtonClick(item)}>
                        <Text fontFamily={"Karma"} textAlign={"center"}>
                            {item.formattedTime}
                        </Text>
                        <Image
                            boxSize='40px'
                            objectFit='cover'
                            src={require('./ImagesForProj/snow.png')}
                            //src={require('./ImagesForProj/'+{Forecast}+'.png')}
                            alt='Dan Abramov'
                            margin={"auto"}
                        />
                        <Text fontFamily={"Karma"} textAlign={"center"}>
                            {item.Temperature}°F
                        </Text>
                    </Box>
                </div>
            ))}
        </div>
    )
}

export default TimeContainer
