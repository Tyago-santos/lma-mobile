import { Text, Dimensions, TouchableOpacity, TouchableHighlight, Alert, View, FlatList} from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { SwipeListView } from 'react-native-swipe-list-view';

import LessonPlanCard from "./PlanComponent";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { router } from "expo-router";


// type DataItem = {
//     id: string;
//     nome: string;
//     idade: number;
//     organizacao: string;
// };

type EnableSwipe ={
  enableSwipe: boolean;
}

const ListHeader = styled.View<{width: number}>`
  flex-direction: row;
  justify-content: space-between;
  background-color: #f1f8ff;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  width:${({width})=> width - 40}px;

  `;
  
// padding: 10px;
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width:${({width})=> width- 40}px;
  align-items:center;
  align-text:center;
  `;
  // padding: 0px 10px;

const TableBody = styled.View`
  flex:1;
`;

const Slider = styled.ScrollView.attrs({
    horizontal: true,
    pagingEnabled:true,
    showsHorizontalScrollIndicator: false,
    scrollEventThrottle: 16,
    
    // contentContainerStyle:{
    //     paddingBottom: 120
    // },
    
})`


`;

const Page = styled.View`
  flex:1;
`;

// width: ${({ width }) => width - 40}px;
// --- Dados de Exemplo ---
const initialData = [
  { key: '1', text: 'Comprar pão' },
  { key: '2', text: 'Reunião às 10h' },
  { key: '3', text: 'Pagar conta de luz' },
  { key: '4', text: 'Academia' },
  { key: '5', text: 'Estudar React Native' },
];

// --- 🎨 DEFINIÇÃO DOS COMPONENTES ESTILIZADOS ---

// Estrutura principal
const Container = styled.View`
  flex: 1;
  background-color: #F5F5F5;
  padding-top: 50px;
`;

const Header = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
`;

// Linha da Frente (Visível)
const RowFront = styled(TouchableHighlight)<EnableSwipe>`
  align-items: center;
  background-color:${({enableSwipe}) => enableSwipe? "#fff": "#ddd"  } ;;
  border:1px dashed #cb245c;
  justify-content: center;
  height: 60px;
`;
  // padding-horizontal: 20px;
  // margin-horizontal: 10px;

const WrapperItem = styled.View`
  width:100%;
  height:100%;
  flex-direction:row;  
  justify-content:space-around;
  align-items:center;

`;

const ItemText = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 500;

`;

// Linha de Trás (Oculta)
const RowBack = styled.View`
  align-items: center;
  background-color: #DDD;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  `;
  // margin-horizontal: 10px;

const BackTextWhite = styled.Text`
  color: #FFF;
  font-weight: bold;
`;

// Botões de Ação (Base)
const BackButtonBase = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 75px;
`;

// Botão da ESQUERDA (Adicionar/Arquivar)
const BackLeftButton = styled(BackButtonBase)`
  background-color: #2ECC71; /* Verde */
  left: 0;
`;

// Botão da DIREITA (Excluir)
const BackRightButton = styled(BackButtonBase)`
  background-color: #E74C3C; /* Vermelho */
  right: 0;
`;

export default function SwiperComponent({ dataList, week }) {
    const cardList = dataList  ?.map((item) => (item.planoDeAla ? item.planoDeAla : []))
            .flat();



    const tableHead = ['Nome', 'Idade', 'Organização'];

    const [listData, setListData] = useState(initialData);
    const [enableSwipe, setEnableSwipe] = useState(true);

    const {width}  = Dimensions.get('window');


    const deleteRow = (rowKey) => {
      Alert.alert(
        "Confirmar Exclusão",
        "Você tem certeza que deseja excluir este item?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          { 
            text: "Excluir", 
            onPress: async () => {
              const docRef = doc(db, `semana ${week}`, rowKey);
              await deleteDoc(docRef);
            },
            style: "destructive"
          }
        ]
      );
    };

  // Função para arquivar (ação da ESQUERDA)
  const archiveRow = async (rowKey)  => {

    const docRef = await doc(db, 'semana '+ week, rowKey);
    router.navigate({
    pathname: "/cadastro",
    params: {
      id: rowKey,
      week: week
    }
});

    setEnableSwipe(true);
  };
  const handleActiveSwipe = ()=>{
    setEnableSwipe(false);
  }

  const handleGetData  = (id: string) => {
    if(!enableSwipe){
      setEnableSwipe(true);
      return;
    }
    router.navigate({
    pathname: "/usuario", // Assumindo que esta é a rota para VisualizacaoDados.jsx
    params: { 
        id:id , 
        week: week // Ou qualquer que seja o número da semana
    }
});

  
  }
  // 1. Renderiza a Linha da Frente (Conteúdo principal)
  const renderItem = (data, rowMap) => (
    <RowFront
      onLongPress={handleActiveSwipe}
      delayLongPress={300}
      enableSwipe={enableSwipe}
      onPress={()=> handleGetData(data.item.id)}
      underlayColor={'#DDD'} // Cor ao pressionar
    >
      <WrapperItem>
        <ItemText>{data.item.nome.split(' ')[0]}</ItemText>
        <ItemText>{data.item.organizacao}</ItemText>
        <ItemText>
          {data.item.dataDeBatismo?.toDate
            ? data.item.dataDeBatismo.toDate().toLocaleDateString('pt-br')
            : '-'}
        </ItemText>
      </WrapperItem>
    </RowFront>
  );

  // 2. Renderiza a Linha de Trás (Ações ocultas)
  const renderHiddenItem = (data, rowMap) => (
    <RowBack>
      {/* Botão da ESQUERDA (Aparece ao arrastar para a DIREITA) */}
      <BackLeftButton onPress={() => archiveRow(data.item.id)}>
          <BackTextWhite>Atualizar</BackTextWhite>
      </BackLeftButton>

      {/* Botão da DIREITA (Aparece ao arrastar para a ESQUERDA) */}
      <BackRightButton onPress={() => deleteRow(data.item.id)}>
        <BackTextWhite>Excluir</BackTextWhite>
      </BackRightButton>
    </RowBack>
  );

    return (
        <Slider scrollEnabled={enableSwipe}>
            {/* Página 1: Lista da Semana 1 */}
            <Page style={{width}} >
                    <SwipeListView
                        data={dataList}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                    //     ListHeaderComponent={() => (
                    //     <ListHeader width={width}>
                    //         {tableHead.map(header => <Text style={{ flex: 1, textAlign: 'center' }} key={header}>{header}</Text>)}
                    //     </ListHeader>
                    // )}
                        
                        // --- CONFIGURAÇÃO DE SWIPE DUPLO ---
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        
                        // Estilização
                        keyExtractor={(item, key) => item.id}
                        // contentContainerStyle={{ paddingBottom: 20 }}
                    />
            </Page>

            {/* Página 2: Conteúdo de exemplo */}
            <Page style={{width, paddingHorizontal: 20}}>
                  {
                    cardList && cardList.length > 0 &&  <FlatList
                        data={cardList}
                        keyExtractor={(item, i)=> item.id || i.toString()}
                        renderItem={({item})=>(
                            <LessonPlanCard data={item}/> 
                        )}
                        />
                  }                   
                    
            </Page>
        </Slider>
    );
}
