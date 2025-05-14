import { View, TextInput, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'AddMedication'>;

export default function AddMedicationScreen({ navigation }: Props) {
  const [medicationName, setMedicationName] = useState('');

  const handleSave = () => {
    console.log(`Medicação adicionada: ${medicationName}`);
    navigation.goBack();
  };

  return (
    <View className="flex-1 p-4">
      <TextInput
        className="border p-2 mb-4"
        placeholder="Nome do medicamento"
        value={medicationName}
        onChangeText={setMedicationName}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}
