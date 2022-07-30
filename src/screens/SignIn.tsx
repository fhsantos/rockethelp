import { Heading, useTheme, VStack, Icon } from 'native-base';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Envelope, Key, User } from 'phosphor-react-native';
import { useState } from 'react';

import Logo from '../assets/images/logo_primary.svg';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SignIn() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(username, password);
    if(!username || !password){
      return Alert. alert('Entrar', 'Informe e-mail e senha');
    }
    setIsLoading(true);
    auth().signInWithEmailAndPassword(username, password)
    .then(response => {
      
    })
    .catch((error)=> {
      console.log(error);
      setIsLoading(false);
      if(error.code === 'auth/invalid-email'){
        return Alert. alert('Entrar', 'E-mail inválido!');
      }
      if(error.code === 'auth/wrong-password'){
        return Alert. alert('Entrar', 'E-mail e/ou senha inválido!');
      }
      if(error.code === 'auth/user-not-found'){
        return Alert. alert('Entrar', 'E-mail e/ou senha inválido!');
      }
    });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo/>
      <Heading color="gray.100" fontSize="xl"mt={20} mb={6}>Acesse sua conta</Heading>
      <Input placeholder="E-mail" mb={4} InputLeftElement={<Icon as={<User color={colors.green[300]}/>} ml={4}/>}
        onChangeText={setUserName}/>
      <Input placeholder="Senha" mb={8} InputLeftElement={<Icon as={<Key color={colors.green[300]}/>} ml={4}/>}
        secureTextEntry onChangeText={setPassword}/>

      <Button title="Entrar" w="full" onPress={handleLogin} isLoading={isLoading}/>
    </VStack>
  );
}