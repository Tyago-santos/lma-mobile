import { StatusBar,  } from 'expo-status-bar';
import styled from 'styled-components/native';
import { FlatList, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import SwiperCustomer from '../components/SwiperComponent';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';


const Container = styled(SafeAreaView)`
  width:100%;
  flex:1;    
`;



const ContainerButton = styled.View`
    flex-direction:row;
    gap:6px;
    margin-top:-30px;    
    padding:0px 0px 20px 20px; 
    
;
`;
const ButtonSeled = styled.Pressable<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => isSelected ? '#cb245c' : 'transparent'};
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${({ isSelected }) => !isSelected ? '#ddd' : 'transparent'};

  `;

const ButtonSeledText = styled.Text<{ isSelected: boolean }>`  
  color: ${({ isSelected }) => isSelected ? '#fff' : '#555'};
  font-weight: ${({ isSelected }) => isSelected ? 'bold' : 'normal'};
  font-size: 12px;
`;

const WEEKS = [1, 2, 3, 4];

export default function Index() {
  const [selectedWeek, setSelectedWeek] = useState(WEEKS[WEEKS.length - 1]);
  const [listUsers, setListUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getList() {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(
            collection(db, `semana ${selectedWeek}`),
        );
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setListUsers(data);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    getList();
  }, [selectedWeek]);


  return (
    <Container>
    <ContainerButton>
        {WEEKS.map((week) => (
          <ButtonSeled key={week} isSelected={selectedWeek === week} onPress={() => setSelectedWeek(week)}>
            <ButtonSeledText isSelected={selectedWeek === week}>
              Semana {week}
            </ButtonSeledText> 
          </ButtonSeled>
        ))}
      </ContainerButton>
        <SwiperCustomer week={selectedWeek} dataList={listUsers}/>
      </Container>
      
  );
}
