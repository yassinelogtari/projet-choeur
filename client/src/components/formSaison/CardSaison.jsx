'use client'

import {
  Box,
  Center,
  useColorModeValue,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react'

import choeur from "../../img/choeur.jpg"
import "./cardSaison.css"


export default function CardSaison({seasonName}) {
  return (
    <Center py={12}>
      <Box
      className='box'
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
        className='box-img'
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'240px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${choeur})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={choeur}
            alt="#"
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text className='text' textTransform={'uppercase'}>
            {seasonName}
          </Text>
        </Stack>
      </Box>
    </Center>
  )
}