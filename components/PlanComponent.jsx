import React from "react";
import styled from "styled-components/native";
import { Linking } from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";

const Card = styled.TouchableOpacity`
  width: 100%;
  border-radius: 14px;
  padding: 16px;
  background-color: ${(props) => props.theme?.colors?.surface || "#fff"};

  border: 1px dashed ${(props) => props.theme?.colors?.button || "#a33"};

  margin-bottom: 14px;

  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  elevation: 4;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme?.colors?.text || "#333"};
`;

const Description = styled.Text`
  margin-top: 4px;
  font-size: 15px;
  color: ${(props) => props.theme?.colors?.text || "#555"};
  opacity: 0.9;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  margin-left: 6px;
  color: ${(props) => props.theme?.colors?.text || "#444"};
`;

const LinkText = styled.Text`
  font-size: 14px;
  margin-left: 6px;
  color: ${(props) => props.theme?.colors?.primary || "#1e90ff"};
  text-decoration: underline;
`;

export default function LessonPlanCard({ data }) {
  let dateFormatted = null;
  let timeFormatted = null;

  if (data?.data) {
    const dateObj = data.data.toDate();
    dateFormatted = dateObj.toLocaleDateString("pt-BR");
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    timeFormatted = `${hours}:${minutes}`;
  }

  return (
    <Card>
      <Title>{data.titulo}</Title>
      <Description>{data.subtitulo}</Description>

      {/* Data */}
      {data.data && (
        <InfoRow>
          <MaterialIcons name="date-range" size={18} color="#666" />
          <InfoText>{dateFormatted}</InfoText>

          <Feather
            name="clock"
            size={18}
            color="#666"
            style={{ marginLeft: 14 }}
          />
          <InfoText>{timeFormatted}</InfoText>
        </InfoRow>
      )}

      {/* Endereço com link */}
      {data.link && data.endereco && (
        <InfoRow>
          <Ionicons name="location-outline" size={20} color="#666" />
          <LinkText
            onPress={() => {
              if (data.link) {
                Linking.openURL(data.link);
              }
            }}
          >
            {data.endereco}
          </LinkText>
        </InfoRow>
      )}
    </Card>
  );
}
