import { View, TextInput, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Schedule: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Schedule'>;

export default function ScheduleScreen({ navigation }: Props) {
  return (
    <View className="flex-1 p-4">
      <TextInput
        className="border p-2 mb-4"
        placeholder="Ex: 08:00, 12:00, 18:00"
      />
      <Button title="Salvar Horários" onPress={() => navigation.goBack()} />
    </View>
  );
}
