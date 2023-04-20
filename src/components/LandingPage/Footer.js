import { Component } from "react";
import './footer.css';
import {
    Text
}
from "@chakra-ui/react";
class Footer extends Component{
    render(){
        return(
            <div className="footer">
                <Text color={"white"} position="absolute" right="2" fontSize={"xl"} mt="1vh">Feedback</Text>
            </div>
        );
    }
}
export default Footer;