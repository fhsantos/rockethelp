import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { VStack, Text, HStack, useTheme, ScrollView } from "native-base";
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import{ useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { dateFormat } from '../utils/firestoreDateFormat';
import { OrderDTO } from "../DTOs/OrderDTO";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { OrderPropes } from "../components/Orders";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderPropes & {
  description: string;
  solution: string;
  closed: string;
}
export function Details({}) {
  const navigator = useNavigation();
  const { colors} = useTheme();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState('');
  const { orderId } = route.params as RouteParams;

function handleOrderClose() {
  if(!solution) {
    return Alert.alert('Solicitação', 'Informe a solução.');
  }
  firestore().collection<OrderDTO>('orders')
  .doc(orderId)
  .update({
    status: 'closed',
    solution,
    closed_at: firestore.FieldValue.serverTimestamp()
  }).then(resp => {
    Alert.alert('Solicitação', 'Solicitação Encerrada.');
    navigator.goBack();
  }).catch(error => {
    console.log(error);
    Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação.');
  });
}

  useEffect(() => {
    firestore().collection<OrderDTO>('orders')
    .doc(orderId).get().then(doc => {
      const {patrimony, description, status, solution, created_at, closed_at} = doc.data();

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed: closed_at ? dateFormat(closed_at) : null
      });

      setIsLoading(false);
    }).catch(error => {
      console.log(error);
      setIsLoading(false);
      return Alert.alert('Detalhe', 'Resgisto não encontrado.');
    });
  },[]);

  if(isLoading) {
    <Loading/>
  }
  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Solicitação"/>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]}/>
            : <Hourglass size={22} color={colors.secondary[700]}/>
        }
        <Text fontSize="sm" color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2} textTransform="uppercase">
            {order.status === 'closed' ? 'Finalizado' : 'Em Abdamento'}
        </Text>

      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails title="equipamento" icon={DesktopTower}
          description={order.patrimony}
        />

        <CardDetails title="descrição do problema" icon={ClipboardText}
          description={order.description}
          footer={`Registrado em ${order.when}`}/>  

        <CardDetails title="solução" icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}` }>

            {
              order.status === 'open' && 
              <Input placeholder="Descrição da solução"
                onChangeText={setSolution}
                textAlignVertical="top"
                multiline
                h={24}
              />
            }
        </CardDetails> 
      </ScrollView>

      {
        order.status === 'open' && 
        <Button title="Encerrar Solicitação"
        m={5}
        onPress={handleOrderClose}/>
      }
    </VStack>
  );
}