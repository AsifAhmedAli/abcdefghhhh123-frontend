import { Button, IconButton } from '@chakra-ui/react'
import { Center } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'
import { Icon } from '@chakra-ui/react'
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, HStack, Text } from '@chakra-ui/react'
import SliderMarkExample from "./SliderMarkExample"
import { useEffect, useState } from 'react'
import axios from "axios";
import "./Setting.css"
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Box
} from '@chakra-ui/react'
import {
    Tab,
    TabList,
    Tabs,
  } from "@chakra-ui/react";

const Settings = ({set_pref,setStyle,pref,set_recommend_info}) => {
    const [prefVals, prefValsFromDb] = useState([]);
    const [sliderValue, setSliderValue] = useState(50)

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }
    //localStorage.setItem("pref", "casual");
    useEffect(() => {
        async function getpreferences() {
            try {
                let res = await axios.get("http://localhost:4000/prefAPI/getPreferenceSport");
                console.log(res.data)
                prefValsFromDb(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getpreferences();
    }, []);
    function handleClick(pref_data,pref_id) {
        //localStorage.setItem("pref", e)
        set_pref({
            preference : pref_data,
            pref_id:pref_id
        })
        //getrecommends(apptemp,prefid)
    }
    function handleChange(val) {
        setSliderValue(val)
        if (val <= 40) {
            setStyle({
                feel : "Normal",
                feel_id:6
            });
            localStorage.setItem("style", "Normal");
        }
        else if (val > 40 && val <= 70) {
            setStyle({
                feel : "Cold",
                feel_id:5
            });
            localStorage.setItem("style", "Cold");
        }
        else {
            setStyle({
                feel : "Warm",
                feel_id:4
            });
            localStorage.setItem("style", "Warm");
        }
        //getrecommends(apptemp,prefid)
        //props.setStyle(style)
    }
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
        <Popover >
            <PopoverTrigger>
                {/* <Button w={8} h={8} variant="link" position="absolute" right="5px" top="7px" colorScheme="#FFFFFF"> */}
                    <IconButton cursor={"pointer"} as={SettingsIcon} position="absolute" right="6px" top="12px" colorScheme="#FFFFFF" w={6} h={6} />
                {/* </Button> */}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontFamily={"Karma"} fontWeight={"600"} colorScheme="black" fontSize="lg">Please Select Your Preference</PopoverHeader>
                <PopoverBody>
                    {/* <div className='settings_pref'>
                        {prefVals.map((item) => (
                            <Button variant={"outline"} w={"40%"} colorScheme="black" border={"2px solid"} fontFamily={"Karma"} key={item.preference} margin="5px" h="40px" 
                            onClick={() => { handleClick(item.preference,item.preference_id) }}>
                                {item.preference}
                            </Button>
                        ))}
                    </div> */}
                    <Tabs variant='unstyled'>
                    <TabList>
                    {prefVals.map((item,index) => (
                        <div key={index}>
                            <Tab _selected={{ color: 'white', bg: 'black', outline : "2px solid black" }} onClick={() => { handleClick(item.preference,item.preference_id) }}
                            w={"100px"} outline={"2px solid"} mr={"10px"} fontFamily={"Karma"}>
                                {item.preference}</Tab>
                        </div>
                        ))}
                    </TabList>
                    </Tabs>
                    <Center>
                        <Text fontSize={"lg"} fontFamily="karma" mt="4vh" color={"black"}>
                            How do you feel?
                        </Text>
                    </Center>
                    <Box pb={2} mb="5vh">
                        <Slider aria-label='slider-ex-6' onChange={(val) => handleChange(val)}>
                            <SliderMark fontFamily={"karma"} fontSize={"md"} value={10} {...labelStyles} color="black">
                                Normal
                            </SliderMark>
                            <SliderMark fontFamily={"karma"} fontSize={"md"} value={50} {...labelStyles} color="black">
                                Cold
                            </SliderMark>
                            <SliderMark fontFamily={"karma"} fontSize={"md"} value={90} {...labelStyles} color="black">
                                Warm
                            </SliderMark>
                            {/* <SliderMark
                                value={sliderValue}
                                textAlign='center'
                                bg='blue.500'
                                color='white'
                                mt='-10'
                                ml='-5'
                                w='12'
                            >
                                {sliderValue}
                            </SliderMark> */}
                            <SliderTrack>
                                <SliderFilledTrack bg={'black'} />
                            </SliderTrack>
                            <SliderThumb outline={"2px solid black"} />
                        </Slider>
                    </Box>
                    {/* <SliderMarkExample setStyle={setStyle} /> */}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default Settings;