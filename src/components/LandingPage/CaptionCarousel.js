import React from 'react'
import { Text, Button, Image } from '@chakra-ui/react'
import "./CaptionCarousel.css"
const CaptionCarousel = (props) => {
  const { preference, preferenceId } = props.pref;
  function handleClick() {
    localStorage.setItem("day", "Today");
    props.setDay(localStorage.getItem("day"))
    console.log(props.day)
  }
  //let clothes_data = props.clothes_data;
  let setData = [];
  setData = props.recommend_data;
  console.log(setData)
  //let clothes_name = clothes_data !== null && clothes_data.split(",");
  //console.log(clothes_name)
  return (
    // <>
    //   {clothes_data === null ?
        <div className='cont' id="cont">
          <div>
            <Text pl={"2vh"} fontSize={"xl"} fontFamily={"Karma"} float={"left"} textAlign="center">
              {props.recommDay + "'s ("+props.timeSelected+") clothing suggestions for " + props.style.feel + " and " + preference + " preference"}
            </Text>
            <Button display={"block"} fontFamily={"Karma"} textAlign={"center"} bottom="0" bg="black" color={"white"} float={"right"} onClick={() => handleClick()}>Today's Recommends</Button>
          </div>
          <div className='containerX'>
          {setData.map((item,index) => (
                <div className='container1'>
                  <div className='container2'>
                    <img alt="NONE" src={item.clothing_image_path} className='imginslider'></img>
                    <Text fontSize={'xl'} textAlign={"none"} fontFamily={"Karma"} ml={'10px'} fontWeight={'bold'}>{item.Clothing_type}</Text>
                  </div>
              </div>
            ))}
          </div>
        </div>

        // :

        // <div id="cont">
        //   <Text fontSize={"2xl"} textAlign="center">
        //     {props.day + " suggestions for workout and running " + props.style + " " + props.pref + " preference"}
        //   </Text>
        //   <div className='received'>
        //     {clothes_name.map((item) => (

        //       item === "Heavy Top" ?
        //         <div className='received_items'><Image src={require('./ImagesForProj/sweater.png')} alt='op' h="30vh" display={"block"} margin={"auto"} /><Text>{item}</Text></div> : item === "Long-Sleeve" ?
        //           <div className='received_items'><Image src={require('./ImagesForProj/long-sleeve.png')} alt='op' h="30vh" display={"block"} margin={"auto"} /><Text>{item}</Text></div> : item === "Heavy Socks" ?
        //             <div className='received_items'><Image src={require('./ImagesForProj/socks.png')} alt='op' h="30vh" display={"block"} margin={"auto"} /><Text>{item}</Text></div> :
        //             <></>
        //     ))}
        //   </div>
        // </div>
     // }
    // </>
  )
}

export default CaptionCarousel
