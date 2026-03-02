
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { ScrollView } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import styled from "styled-components/native";
import { SafeAreaView} from 'react-native-safe-area-context'
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Timestamp } from "firebase/firestore";

import SwitchComponent from "../components/Switch";



export default function Cadastro() {

  const params = useLocalSearchParams();
  const navigate = useNavigation();
  const WEEKS = [1, 2, 3, 4];
  const [selectedWeek, setSelectedWeek] = useState(WEEKS[WEEKS.length - 1]);
  const [switchValue, setSwitchValue] = useState(false);

  const { id, week } = params;
  const isEditing = !!(id && week);

  const hanfleChangeSwitch = (value)=> {
    if(value) alert("Inserir plano de Ala");
    setSwitchValue(value);
    
  }

  useLayoutEffect(()=>{
    navigate.setOptions({
      headerLeft: ()=> <Title>{isEditing ? "Editar Cadastro" : "Novo Cadastro"}</Title>,
      headerRight: ()=><SwitchComponent onSend={hanfleChangeSwitch} />,
    })
  },[isEditing, navigate])


  useEffect(() => {
    const getUser = async () => {
      if (isEditing) {
        const docRef = doc(db, `semana ${week}`, id as string);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          const planosDeAlaComDatas = (data.planoDeAla || []).map(plano => {
            const planoData = plano.data instanceof Timestamp ? plano.data.toDate() : null;
            return {
              ...plano,
              data: planoData ? planoData.toLocaleDateString('pt-BR') : '',
              hora: planoData ? planoData.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
              timestamp: plano.timestamp instanceof Timestamp ? plano.timestamp.toDate() : new Date(),
            };
          });

          const batismoDate = data.dataDeBatismo instanceof Timestamp ? data.dataDeBatismo.toDate() : null;

          // Mescla os dados do Firestore com o estado inicial para garantir que todas as chaves existam.
          setForm(prevForm => ({
            nome: data.nome || prevForm.nome,
            dificuldade: data.dificuldade || prevForm.dificuldade,
            descricao: data.descricao || prevForm.descricao,
            organizacao: data.organizacao || prevForm.organizacao,
            endereco: data.endereco || prevForm.endereco,
            idade: data.idade || prevForm.idade,
            planoDeAla: planosDeAlaComDatas.length > 0 ? planosDeAlaComDatas : prevForm.planoDeAla,
            dataDeBatismo: batismoDate ? batismoDate.toLocaleDateString('pt-BR') : '',
            horaDeBatismo: batismoDate ? batismoDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
          }));

        } 
      }
    };

    getUser();
  }, [id, week, isEditing]);

  const [form, setForm] = useState({
    nome: "",
    dataDeBatismo: "",
    horaDeBatismo: "",
    dificuldade: "",
    descricao: "",
    organizacao: "",
    endereco: "",
    idade: 0,    planoDeAla: [{
      titulo: "",
      subtitulo: "",
      data:  "",
      hora: "",
      endereco: "",
      link: "",
    }]
  });

  const handleChange = useCallback((key: keyof typeof form, value: string) => {
    if (key === 'idade') {
        setForm((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  const handlePlanoDeAlaChange = useCallback((index: number, key: keyof typeof form.planoDeAla[0], value: string) => {
    setForm((prev) => {
      const newPlanoDeAla = [...prev.planoDeAla];
      newPlanoDeAla[index] = { ...newPlanoDeAla[index], [key]: value };
      return { ...prev, planoDeAla: newPlanoDeAla };
    });
  }, []);
  
  
  const handleSubmit = async () => {
    const parseDateAndTime = (dateStr: string, timeStr: string): Date => {
      const dateParts = dateStr.split('/');
      const timeParts = timeStr.split(':');

      if (dateParts.length === 3 && timeParts.length >= 2) {
        const [day, month, year] = dateParts.map(Number);
        const [hour, minute] = timeParts.map(Number);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hour) && !isNaN(minute) && year > 1000) {
          return new Date(year, month - 1, day, hour, minute);
        }
      }
      return new Date(); // Retorna data atual se a string for inválida
    };

    const dataToSend = {
      ...form,
      dataDeBatismo: parseDateAndTime(form.dataDeBatismo, form.horaDeBatismo),
      planoDeAla: form.planoDeAla.map(plano => {
        const { hora, ...rest } = plano; // Remove 'hora' do objeto final
        return {
          ...rest,
          data: parseDateAndTime(plano.data, plano.hora),
          timestamp: new Date(), // Garante um timestamp de criação/atualização
        };
      })
    };
    delete dataToSend.horaDeBatismo; // Remove o campo auxiliar

    // Limpa o array de planos se o switch estiver desligado
    if (!switchValue) {
      dataToSend.planoDeAla = [];
    };

    try {
      if (isEditing) {
        const docRef = doc(db, `semana ${week}`, id as string);
        await updateDoc(docRef, dataToSend);
      } else {
        // Adiciona um novo documento (ex: sempre na semana 3 como no seu código original)
        // Você pode tornar a semana dinâmica também se precisar
        await addDoc(collection(db, `semana ${selectedWeek}`), dataToSend);
      }
      router.back();
    } catch (error) {
      console.log("Erro ao salvar:", error);
    }
  };

  return (
    <Container>
      {/* O Título foi removido daqui porque agora é gerenciado pelo useLayoutEffect no cabeçalho */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <ContainerButton>
              {WEEKS.map((week) => (
                <ButtonSeled key={week} isSelected={selectedWeek === week} onPress={() => setSelectedWeek(week)}>
                  <ButtonSeledText isSelected={selectedWeek === week}>
                    Semana {week}
                  </ButtonSeledText> 
                </ButtonSeled>
              ))}
            </ContainerButton>
        {/* Nome */}
        <Input
          placeholder="Nome completo"
          value={form.nome}
          onChangeText={(v) => handleChange("nome", v)}
        />
        
        <Input
            placeholder="Idade da Pessoa"
            value={form.idade.toString()}
            keyboardType="numeric"
            onChangeText={(v) => handleChange("idade", v)}
        />

        <Row>
            <InputContainer flex={2}>
                <Input
                    keyboardType="numbers-and-punctuation"
                    placeholder="Data de batismo"
                    value={form.dataDeBatismo}
                    onChangeText={(v) => handleChange('dataDeBatismo', v)}
                />
            </InputContainer>
            <InputContainer flex={1}>
                <Input
                    placeholder="Hora (HH:mm)"
                    value={form.horaDeBatismo}
                    onChangeText={(v) => handleChange('horaDeBatismo', v)}
                />
            </InputContainer>
        </Row>

        {/* Texto longo */}
        <TextArea
          placeholder="Dificuldade (responsabilidade espiritual)"
          multiline
          value={form.dificuldade}
          onChangeText={(v) => handleChange("dificuldade", v)}
        />

        <TextArea
          placeholder="Notas"
          multiline
          value={form.descricao}
          onChangeText={(v) => handleChange("descricao", v)}
        />

        {/* Organização */}
        <Input
          placeholder="Organização (ex: Jovens, Primária, Sacerdócio)"
          value={form.organizacao}
          onChangeText={(v) => handleChange("organizacao", v)}
        />

        {/* Endereço */}
        <Input
            placeholder="Endereço completo"
            value={form.endereco}
            onChangeText={(v) => handleChange("endereco", v)}
        />

      { switchValue && form.planoDeAla[0] && (<>
        <Input
            placeholder="Digite um Título"
            value={form.planoDeAla[0]?.titulo}
            onChangeText={(v) => handlePlanoDeAlaChange(0, "titulo", v)}
        />

        <TextArea
            multiline
            placeholder="Digite um Subtítulo"
            value={form.planoDeAla[0]?.subtitulo}
            onChangeText={(v) => handlePlanoDeAlaChange(0, "subtitulo", v)}
        />

        <Row>
            <InputContainer flex={2}>
                <Input
                    placeholder="Data do Evento"
                    value={form.planoDeAla[0]?.data}
                    onChangeText={(v) => handlePlanoDeAlaChange(0, "data", v)}
                />
            </InputContainer>
            <InputContainer flex={1}>
                <Input
                    placeholder="Hora (HH:mm)"
                    value={form.planoDeAla[0]?.hora}
                    onChangeText={(v) => handlePlanoDeAlaChange(0, "hora", v)}
                />
            </InputContainer>
        </Row>

        <Input
            placeholder="Endereço do Evento"
            value={form.planoDeAla[0]?.endereco}
            onChangeText={(v) => handlePlanoDeAlaChange(0, "endereco", v)}
        />

        <Input
            placeholder="Link Localização"
            value={form.planoDeAla[0]?.link}
            onChangeText={(v) => handlePlanoDeAlaChange(0, "link", v)}
        />
      </>)
      }

        <SubmitButton onPress={handleSubmit} >
          <ButtonText>{isEditing ? "Atualizar" : "Salvar Cadastro"}</ButtonText>
        </SubmitButton>

        <Spacer />
      </ScrollView>
    </Container>
  );
}

/* ----------------------------------------
   ESTILOS COM STYLED-COMPONENTS
----------------------------------------- */

const Container = styled(SafeAreaView)`
  flex: 1;
  padding: 20px;
  background-color: #f7f7f7;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const InputContainer = styled.View<{ flex: number }>`
  flex: ${({ flex }) => flex};
`;

const Input = styled.TextInput`
  width: 100%;
  height: 55px;
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  border-width: 1px;
  border-color: #ddd;
`;

const TextArea = styled.TextInput`
  width: 100%;
  min-height: 100px;
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  border-width: 1px;
  border-color: #ddd;
  text-align-vertical: top;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 100%;
  height: 55px;
  background-color: #cb245c;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const Spacer = styled.View`
  height: 40px;
`;



const ContainerButton = styled.View`
    flex-direction:row;
    gap:6px;
    margin:0px 0px 20px 0px ;    
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
  font-size: 11px;
`;
