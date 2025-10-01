import { StyleSheet, Text, View } from 'react-native';

export default function NuevoTabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tab nuevo</Text>
      <Text style={styles.sutitulo}>Con otro estilo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  sutitulo: {
    fontSize: 20,
    color: 'gray',
    marginTop: 10,
  },
});