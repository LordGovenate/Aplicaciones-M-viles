import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const validarFormulario = () => {
    if (!nombre || !email || !password || !fechaNacimiento) {
      Alert.alert(
        "Error",
        "Todos los campos son obligatorios",
        [{ text: "OK" }]
      );
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Error",
        "El formato del email no es válido",
        [{ text: "OK" }]
      );
      return;
    }

    // Validar fecha de nacimiento (formato DD/MM/AAAA)
    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;
    if (!fechaRegex.test(fechaNacimiento)) {
      Alert.alert(
        "Error",
        "El formato de fecha debe ser DD/MM/AAAA",
        [{ text: "OK" }]
      );
      return;
    }

    // Si todo está correcto
    Alert.alert(
      "Éxito",
      "Registro completado correctamente",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa tus datos</Text>
      <View style={styles.inputview}>
        <TextInput 
          style={styles.input} 
          placeholder='Nombre completo' 
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Email' 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder='Contraseña' 
          secureTextEntry={true} 
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Fecha de nacimiento (DD/MM/AAAA)' 
          placeholderTextColor="#666"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
        />
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={validarFormulario}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputview: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    fontSize: 16,
    shadowColor: '#000',
  },
  button: {
    backgroundColor: '#2d5483ff',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    shadowColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
