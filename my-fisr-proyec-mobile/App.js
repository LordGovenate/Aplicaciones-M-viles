import { Text, View, Image} from 'react-native';
import styles from './styles/styles';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Hola mundo</Text>
      </View>
      <View style={styles.boxImage}>
        <Text>Soy kevin</Text>
      </View>
      <View style={styles.boxImage}>
        <Image
          source={require('./assets/i.png')}
          style={{ width: 100, height: 100 }}
        />
        </View>
    </View>
  );
}
