import React, { useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';

// ------------------------------------------------------
// Tipagem
// ------------------------------------------------------

type Field = {
    key: string;
    label: string;
    placeholder: string;
};

type DataInsertModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void;
    fields: Field[];
};

// ------------------------------------------------------
// Componente Principal
// ------------------------------------------------------

export default function DataInsertModal({ visible, onClose, onSubmit, fields = [] }: DataInsertModalProps) {
    const [formData, setFormData] = useState({});

    // Limpa o formulário sempre que o modal se torna visível
    useEffect(() => {
        if (visible) {
            setFormData({});
        }
    }, [visible]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <Wrapper onPress={onClose}>
                    <StyledBlur intensity={40} tint="dark">
                        <InnerPressable onPress={(e) => e.stopPropagation()}>
                            <Title>Inserir Novo Registro</Title>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Grid>
                                    {fields.map((field) => (
                                        <FieldBox key={field.key}>
                                            <FieldLabel>{field.label}</FieldLabel>
                                            <FieldInput
                                                placeholder={field.placeholder}
                                                placeholderTextColor="#ccc"
                                                value={formData[field.key] || ''}
                                                onChangeText={(value) =>
                                                    handleChange(field.key, value)
                                                }
                                            />
                                        </FieldBox>
                                    ))}
                                </Grid>

                                <SubmitButton onPress={handleSubmit}>
                                    <SubmitText>Salvar</SubmitText>
                                </SubmitButton>

                                <CancelButton onPress={onClose}>
                                    <CancelText>Cancelar</CancelText>
                                </CancelButton>
                            </ScrollView>
                        </InnerPressable>
                    </StyledBlur>
                </Wrapper>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ------------------------------------------------------
// Estilos (styled-components/native)
// ------------------------------------------------------

const Wrapper = styled.Pressable`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    padding: 20px;
`;

const StyledBlur = styled(BlurView)`
    width: 100%;
    border-radius: 20px;
    padding: 25px;
    overflow: hidden;
    max-height: 90%;
`;

const InnerPressable = styled.Pressable`
    /* Este componente impede que o toque no conteúdo do modal o feche */
`;

const Title = styled.Text`
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`;

const Grid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const FieldBox = styled.View`
    width: 48%;
    margin-bottom: 15px;
`;

const FieldLabel = styled.Text`
    color: #ddd;
    font-size: 14px;
    margin-bottom: 5px;
`;

const FieldInput = styled.TextInput`
    background-color: rgba(255, 255, 255, 0.1);
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    padding: 10px;
    color: #fff;
`;

const SubmitButton = styled.TouchableOpacity`
    background-color: #0066ff;
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
`;

const SubmitText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
`;

const CancelButton = styled.TouchableOpacity`
    margin-top: 10px;
    padding: 12px;
    border-radius: 10px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.4);
`;

const CancelText = styled.Text`
    text-align: center;
    color: #fff;
    font-size: 16px;
`;
