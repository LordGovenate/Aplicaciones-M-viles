import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const STORAGE_KEYS = {
  USERS: '@cache/users',
  PREFS: '@prefs/app',
};

const UserCard = ({ user, mostrarEmails }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{user.name}</Text>
    {mostrarEmails ? <Text>{user.email}</Text> : null}
    <Text>{user.phone}</Text>
    <Text>{user.username}</Text>
    {user.address ? (
      <>
        <Text>{user.address.street}</Text>
        <Text>{user.address.suite}</Text>
        <Text>{user.address.city}</Text>
      </>
    ) : null}
  </View>
);

export default function App() {
  const [users, setUsers] = useState([]);
  const [mostrarEmails, setMostrarEmails] = useState(true);
  const [origen, setOrigen] = useState(''); // cache o API

  // preferencias
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.PREFS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.mostrarEmails === 'boolean') {
            setMostrarEmails(parsed.mostrarEmails);
          }
        }
      } catch {
      }
    })();
  }, []);

  // guardar preferencia
  const onToggleEmails = async (value) => {
    setMostrarEmails(value);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREFS,
        JSON.stringify({ mostrarEmails: value })
      );
    } catch {
      Alert.alert('No se pudo guardar tu preferencia', 'Intenta de nuevo.');
    }
  };

  // carga api sinon cache
  useEffect(() => {
    (async () => {
      try {
        const net = await NetInfo.fetch();
        if (net.isConnected) {
          const resp = await fetch('https://jsonplaceholder.typicode.com/users');
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          const data = await resp.json();
          setUsers(data);
          setOrigen('API');
          try {
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
          } catch {
            Alert.alert(
              'No se pudo guardar la data localmente',
              'La app funcionará, pero sin internet no habrá datos actualizados.'
            );
          }
          return;
        }
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        if (raw) {
          setUsers(JSON.parse(raw));
          setOrigen('Caché');
        } else {
          Alert.alert(
            'Sin datos y sin conexión',
            'Conéctate a internet y abre la app de nuevo.'
          );
        }
      } catch {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        if (raw) {
          setUsers(JSON.parse(raw));
          setOrigen('Caché');
        } else {
          Alert.alert(
            'Sin datos y sin conexión',
            'Conéctate a internet y abre la app de nuevo.'
          );
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>

      <View style={styles.prefRow}>
        <Text style={styles.prefLabel}>Mostrar emails</Text>
        <Switch value={mostrarEmails} onValueChange={onToggleEmails} />
      </View>

      {origen ? <Text style={styles.source}>Origen: {origen}</Text> : null}

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <UserCard user={item} mostrarEmails={mostrarEmails} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#b5b6daff',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  prefLabel: { fontSize: 16, fontWeight: '600' },
  source: { marginBottom: 8, opacity: 0.7 },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4b4646ff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});
