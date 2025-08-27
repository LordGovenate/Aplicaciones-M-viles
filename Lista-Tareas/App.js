import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  const [name, setName] = React.useState('');
  const [tasks, setTasks] = React.useState([]);

  function addTask(name) {
    if (!name.trim()) return;
    setTasks([...tasks, name]);
    setName('');
  }

  function removeTask(indexToRemove) {
    setTasks(tasks.filter((_, i) => i !== indexToRemove));
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.cajaTitulo}>
        <Text style={styles.textoTitulo}>Lista de tareas en React Native!</Text>
      </View>

      <View style={styles.cajaInput}>
        <TextInput
          style={styles.cuadroTexto}
          value={name}
          placeholder="Escribe tu tarea aquí..."
          onChangeText={setName}
          returnKeyType="done"
          onSubmitEditing={() => addTask(name)}
        />
        <TouchableOpacity style={styles.botonAgregar} onPress={() => addTask(name)}>
          <Text style={styles.textoBoton}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cajaLista}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.filaTarea}>
            <View style={styles.tarjetaTarea}>
              <Text style={styles.textoTarea}>{task}</Text>
            </View>

            <TouchableOpacity
              style={styles.botonBorrar}
              onPress={() => removeTask(index)}
            >
              <Text style={styles.textoBorrar}>Borrar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#31EC56',
    alignItems: 'center',
    paddingTop: 50,
  },
  cajaTitulo: {
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: 5,
    height: 50,
    width: '80%',
  },
  textoTitulo: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '700',
  },
  cajaInput: {
    flexDirection: 'row',
    marginTop: 20,
    width: '95%',
    alignItems: 'center',
  },
  cuadroTexto: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    fontSize: 16,
    color: '#000',
  },
  botonAgregar: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
  },
  cajaLista: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: '95%',
    flex: 1,
  },
  filaTarea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tarjetaTarea: {
    flex: 1,
    backgroundColor: '#ED145B',
    borderWidth: 2,
    borderColor: '#E756B2',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  textoTarea: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  botonBorrar: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBorrar: {
    color: '#fff',
    fontWeight: '700',
  },
});