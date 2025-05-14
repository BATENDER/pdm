import { View, Pressable, Text, Image } from 'react-native';
import PagerVier from 'react-native-pager-view';

export function Banner() {
 return (
   <View className='w-full h-36 rounded-2xl mt-5 mb-4'>
        <PagerVier style={{ flex: 1 }} initialPage={0} pageMargin={14}>
            <Pressable className='w-full h-36 rounded-2xl' key='1' onPress={ () => console.log('Clicou no banner 1') }>
                <Text className='w-full h-36 text-center'>Imagem 01</Text>
                {/* <Image
                    source={require('../../assets/img.png')} 
                    className='w-full h-36 rounded-2xl'
                /> */}
            </Pressable>
        </PagerVier>
   </View>
  );
}