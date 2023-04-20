import React from 'react'
import {
    Button,
    Box,
    Text,
    Image
} from '@chakra-ui/react'
const TimeContainerInner = (props) => {
    let dateNow = props.time.Date_Time !== null && props.time.Date_Time.split(",");
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
      const handleButtonClick = () => {
        // Handle button click event here
        console.log("Button clicked!");
      };
    return (
        <div>
            <div>{finalDate}</div>
            <Box as="button" w="70px" bg='#EFEFEF' p={1} color='black' mx="0.2rem" onClick={handleButtonClick}>
                <Text fontFamily={"Karma"} textAlign={"center"}>
                    {formattedTime}
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
                    {props.time.Temperature}°F
                </Text>
            </Box>
        </div>
        
    )
}

export default TimeContainerInner
