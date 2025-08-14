import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8d6e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#000000ff',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10, 
  },
  box: {
    width: 200,
    backgroundColor: '#54a0ff',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
    boxImage: {
        width: 200,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
});

export default styles;