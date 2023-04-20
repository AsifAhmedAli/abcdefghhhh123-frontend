import React, { useState } from 'react'
import {
    Input,
    Container,
    InputGroup,
    InputRightAddon,
    Button,
    filter,
    Tab,
    Center,
} from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    Heading,
    ButtonGroup,
    IconButton,
    useToast,
    Flex
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons';

const Search = () => {
    const [inputs, setInputs] = useState({
        searchip: "",
    });

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    console.log(inputs);
    return (
        <div className='searchdiv'>
            <Flex alignItems={"center"} justifyContent="center" pt="15vh" px="5vw">
                <InputGroup size='sm'>
                    <Input name="searchip" placeholder="Enter here" h={"8vh"} onChange={handleChange} bg="white"/>
                    <InputRightAddon children={<Button><Search2Icon width={"-moz-max-content"} /></Button>} h={"8vh"} />
                </InputGroup>
            </Flex>
        </div>
    )
}

export default Search
