import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Post from '../screens/Post';

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Post" component={Post} />
    </Stack.Navigator>
  );
}