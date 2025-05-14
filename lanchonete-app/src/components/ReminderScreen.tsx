import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Reminder: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Reminder'>;

export default function ReminderScreen({ navigation }: Props) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl">Hora de tomar sua medicação!</Text>
      <Button title="Marcar como Administrado" onPress={() => navigation.goBack()} />
    </View>
  );
}
