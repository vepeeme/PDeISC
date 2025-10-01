import { ScrollView, View, Text, Image, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [contador, setContador] = useState(0);
  const [textoIngresado, setTextoIngresado] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.texto}>Esto está escrito con un componente llamado Text y además está dentro de un contenedor con el componente View.</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo}/>
        <Text style={styles.texto}>Esta imagen local se muestra con el componente Image.</Text>
        <Image 
          source={{uri:'https://images.hdqwalls.com/download/son-goku-dragon-ball-super-anime-retina-display-5k-u1-2560x1440.jpg'}}
          style={styles.logo}
        />
        <Text style={styles.texto}>Esta imagen se importa desde internet.</Text>
      </View>

      <View style={styles.sectionContainer}>
        <TextInput 
          placeholder='Escribe algo aquí...' 
          style={styles.input}
          value={textoIngresado}
          onChangeText={setTextoIngresado}
        />
        <Text style={styles.texto}>Estás escribiendo: {textoIngresado}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Pressable 
          onPress={() => setContador(contador + 1)} 
          style={styles.button}>
          <Text style={styles.buttonText}>Presióname</Text>
        </Pressable>
        <Text style={styles.texto}>Has presionado el botón {contador} veces</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.texto}>El scroll vertical está hecho con un componente llamado ScrollView.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  texto: {
    color: 'black',
    fontSize: 16, 
    textAlign: 'center',
    marginTop: 10,
  },
  logo: {
    height: 250,
    width: 250,
    marginVertical: 10, 
    borderRadius: 50,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});