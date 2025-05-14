import { View, Text, Image, TouchableOpacity } from 'react-native';

type MedicationItemProps = {
  name: string;
  onAdministered: () => void;
};

export default function MedicationItem({ name, onAdministered }: MedicationItemProps) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-300">
      <Text className="text-lg">{name}</Text>
      <TouchableOpacity onPress={onAdministered}>
        <Image source={require('../assets/pill.png')} className="w-10 h-10" />
      </TouchableOpacity>
    </View>
  );
}
