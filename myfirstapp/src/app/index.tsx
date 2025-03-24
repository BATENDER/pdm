import { View, Text } from "react-native";
import '../../global.css';

export default function Index() {
    return (
        <View style={{ $$css: true, _: 'bg-slate-100 rounded-xl' }}>
            <Text style={{ $$css: true, _: 'text-8xl font-medium' }}> Hello World! </Text>
            <Text style={{ $$css: true, _: 'text-2xl antialised' }}> Hello World! </Text>
            <Text style={{ $$css: true, _: 'text-left' }}> Hello World! </Text>
        </View>
    )
}