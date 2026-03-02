import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';

// --- Tipagem dos Dados (Para facilitar a leitura) ---
interface FormData {
    nome: string;
    dataDeBatismo: Date | null;
    dificuldade: string;
    descricao: string;
    organizacao: string;
    endereco: string;
    idade: number;
}

// Inicializa o estado com valores vazios/padrão
const initialFormState: FormData = {
    nome: "Carregando...",
    dataDeBatismo: null,
    dificuldade: "N/A",
    descricao: "N/A",
    organizacao: "N/A",
    endereco: "N/A",
    idade: 0,
};

export default function VisualizacaoDados() {
    const params = useLocalSearchParams();
    const { id, week } = params;
    const [data, setData] = useState<FormData>(initialFormState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id || !week) {
                setError("ID ou Semana não fornecidos.");
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, `semana ${week}`, id as string);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    const firestoreData = docSnapshot.data();

                    // Converte o Timestamp para Date object
                    const batismoDate = firestoreData.dataDeBatismo instanceof Timestamp 
                        ? firestoreData.dataDeBatismo.toDate() 
                        : null;

                    setData({
                        nome: firestoreData.nome || initialFormState.nome,
                        dificuldade: firestoreData.dificuldade || initialFormState.dificuldade,
                        descricao: firestoreData.descricao || initialFormState.descricao,
                        organizacao: firestoreData.organizacao || initialFormState.organizacao,
                        endereco: firestoreData.endereco || initialFormState.endereco,
                        idade: firestoreData.idade || initialFormState.idade,
                        dataDeBatismo: batismoDate,
                    });
                } else {
                    setError("Documento não encontrado.");
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError("Erro ao carregar dados do Firebase.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, week]);

    // --- Tratamento de Estados ---
    if (loading) {
        return (
            <LoadingContainer>
                <ActivityIndicator size="large" color="#cb245c" />
                <LoadingText>Carregando dados...</LoadingText>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <MaterialIcons name="error-outline" size={40} color="#FF5733" />
                <ErrorText>{error}</ErrorText>
            </ErrorContainer>
        );
    }
    
    // --- Formatação da Data ---
    const dataFormatada = data.dataDeBatismo 
        ? data.dataDeBatismo.toLocaleDateString('pt-BR') 
        : 'Data não registrada';

    // --- Componente de Exibição ---
    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Title>Detalhes do Cadastro</Title>

                {/* Nome e Idade */}
                <DataCard>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <DataRow label="Nome" value={data.nome} icon="person" />
                    <DataRow label="Idade" value={`${data.idade} anos`} icon="cake" />
                    <DataRow label="Data de Batismo" value={dataFormatada} icon="calendar-today" />
                </DataCard>

                {/* Detalhes da Organização */}
                <DataCard>
                    <CardTitle>Organização e Endereço</CardTitle>
                    <DataRow label="Organização" value={data.organizacao} icon="groups" />
                    <DataRow label="Endereço" value={data.endereco} icon="location-on" />
                </DataCard>

                {/* Dificuldade e Notas */}
                <DataCard>
                    <CardTitle>Detalhes Adicionais</CardTitle>
                    <LongDataRow label="Dificuldade/Responsabilidade Espiritual" value={data.dificuldade} icon="mood-bad" />
                    <LongDataRow label="Notas/Descrição" value={data.descricao} icon="notes" />
                </DataCard>

                <Spacer />
            </ScrollView>
        </Container>
    );
}

// =======================================================
// STYLED COMPONENTS (Reutilizando e Adaptando)
// =======================================================

// --- Componentes Reutilizados ---
const Container = styled(SafeAreaView)`
    flex: 1;
    padding: 20px;
    background-color: #f7f7f7;
`;

const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
`;

const Spacer = styled.View`
    height: 40px;
`;

// --- Novos Componentes de Visualização ---

const DataCard = styled.View`
    background-color: #FFF;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 15px;
    border-width: 1px;
    border-color: #eee;
`;

const CardTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #cb245c;
    margin-bottom: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #f0f0f0;
    padding-bottom: 5px;
`;

const Row = styled.View`
    flex-direction: row;
    align-items: center;
    padding-vertical: 8px;
`;

const IconStyled = styled(MaterialIcons)`
    margin-right: 12px;
`;

const TextContent = styled.View`
    flex: 1;
`;

const LabelText = styled.Text`
    font-size: 13px;
    color: #888;
    margin-bottom: 2px;
`;

const ValueText = styled.Text`
    font-size: 17px;
    color: #000;
    font-weight: 500;
`;

// --- Componentes para Estado de Carregamento/Erro ---

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #f7f7f7;
`;

const LoadingText = styled.Text`
    margin-top: 10px;
    font-size: 16px;
    color: #333;
`;

const ErrorContainer = styled(LoadingContainer)`
    background-color: #FFF;
    padding: 20px;
    text-align: center;
`;

const ErrorText = styled.Text`
    margin-top: 10px;
    font-size: 18px;
    color: #FF5733;
    font-weight: bold;
`;


// --- Componentes Auxiliares de Linha ---

const DataRow = ({ label, value, icon }: { label: string, value: string, icon: keyof typeof MaterialIcons.glyphMap }) => (
    <Row>
        <IconStyled name={icon} size={20} color="#cb245c" />
        <TextContent>
            <LabelText>{label}</LabelText>
            <ValueText>{value}</ValueText>
        </TextContent>
    </Row>
);

const LongDataRow = ({ label, value, icon }: { label: string, value: string, icon: keyof typeof MaterialIcons.glyphMap }) => (
    <View style={{ paddingVertical: 8 }}>
        <Row style={{ marginBottom: 5 }}>
            <IconStyled name={icon} size={20} color="#cb245c" style={{ alignSelf: 'flex-start', marginTop: 3 }} />
            <LabelText>{label}</LabelText>
        </Row>
        <ValueText style={{ marginLeft: 32, fontStyle: 'italic', color: '#555', lineHeight: 22 }}>{value}</ValueText>
    </View>
);