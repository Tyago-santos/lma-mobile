import React, { useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';







const SwitchComponent = ({onSend}) => {
  // 1. Defina o estado inicial do switch (false = desligado)
    const [isEnabled, setIsEnabled] = useState(false);

  // 2. Função que inverte o estado (true <-> false)
    const toggleSwitch = (e) => {
        setIsEnabled(previousState => !previousState)
        onSend(e);
    }

  return (
    <View style={styles.container}>
     
      <Switch
        trackColor={{ false: "#767577", true: "#767577" }} // Cor de fundo da trilha
        thumbColor={isEnabled ? "#cb245c" : "#f4f3f4"}    // Cor do botão (thumb)
        ios_backgroundColor="#3e3e3e"                     // Cor de fundo no iOS quando desligado
        onValueChange={toggleSwitch}                      // Função chamada ao interagir
        value={isEnabled}                                 // Valor atual (booleano)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  label: {
    fontSize: 16,
    marginRight: 20,
  }
});

export default SwitchComponent;