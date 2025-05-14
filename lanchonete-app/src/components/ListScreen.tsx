import { View, ScrollView, Text } from 'react-native';
import MedicationItem from '../components/MedicationItem';

type Medication = {
  name: string;
  time: string;
};

export default function ListScreen() {
  const medications: Medication[] = [
    { name: 'Paracetamol', time: '08:00' },
    { name: 'Ibuprofeno', time: '12:00' },
  ];

  const markAsAdministered = (med: string) => {
    console.log(`${med} administrado!`);
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl mb-2">Medicações</Text>
      {medications.map((med, index) => (
        <MedicationItem
          key={index}
          name={med.name}
          onAdministered={() => markAsAdministered(med.name)}
        />
      ))}
    </ScrollView>
  );
}
