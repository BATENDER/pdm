import { View, Button, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  AddMedication: undefined;
  Schedule: undefined;
  Reminder: undefined;
  List: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 justify-center items-center space-y-4">
      <Text className="text-2xl font-bold">LembreMed</Text>
      <Button title="Adicionar Medicação" onPress={() => navigation.navigate('AddMedication')} />
      <Button title="Agendar Horários" onPress={() => navigation.navigate('Schedule')} />
      <Button title="Ver Lista" onPress={() => navigation.navigate('List')} />
    </View>
  );
}
