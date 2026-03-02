
import {Stack} from 'expo-router';
import Header from '../components/Header';


export default function RootLayout (){
    return (      
        <Stack>
            <Stack.Screen name='index' options={{ title: 'home', header: ({options})=> <Header title={options.title} />}}/>
            <Stack.Screen name='cadastro' options={{ title: '', }}/>
            <Stack.Screen name='usuario' options={{ title: 'usuário', headerShown: false}}/>

        </Stack>
    )
}