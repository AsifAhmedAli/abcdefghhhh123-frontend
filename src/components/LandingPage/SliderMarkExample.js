import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
    Box
} from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
export default function SliderMarkExample(props) {
    const [sliderValue, setSliderValue] = useState(50)

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }
    const [style, setStyle1] = useState("Normal")

    function handleChange(val) {
        setSliderValue(val)
        if (val <= 40) {
            setStyle1("Normal")
        }
        else if (val > 40 && val <= 70) {
            setStyle1("Cold")
        }
        else {
            setStyle1("Warm")
        }
        localStorage.setItem("style", style);
        props.setStyle(style)
    }
    return (
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
    )
}