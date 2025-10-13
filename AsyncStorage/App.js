import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList 
} from 'react-native';

const UserCard = ({ user }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{user.name}</Text>
    <Text>{user.email}</Text>
    <Text>{user.phone}</Text>
    <Text>{user.username}</Text>
    <Text>{user.address.street}</Text>
    <Text>{user.address.suite}</Text>
    <Text>{user.address.city}</Text>
  </View>
);

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserCard user={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#b5b6daff'
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4b4646ff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  }
});
