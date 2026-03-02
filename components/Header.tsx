
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import styled from "styled-components/native";
import { router} from "expo-router";
// import do icone de button
import AntDesign from '@expo/vector-icons/AntDesign';


type PropStyle = {
    insentTop: number
}

const WrapperHeader = styled.View<PropStyle>`
    padding-top: ${({insentTop} )=> insentTop}px;
    padding-left: 20px ;    
    padding-right: 20px ;

    flex-direction:row;
    justify-content:space-between;
    align-items:center;
`;

const HeaderButton = styled.TouchableOpacity``;
const HeaderImage = styled.Image`
    height:55px;
    width:55px;

`;

export default function Header ({title}){

    const insert = useSafeAreaInsets();
    const sourceImage= require("../assets/logo.png");

    return(
        <WrapperHeader insentTop={insert.top}>
            <HeaderImage    source={sourceImage}/>
            <HeaderButton onPress={()=> router.navigate('cadastro')}>
                    <AntDesign name="user-add" size={24} color="#cb245c" />
            </HeaderButton>

        </WrapperHeader>
    );
}
