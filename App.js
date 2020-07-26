import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Text, Alert} from 'react-native';
import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/react/api/list/')
      .then((response) => response.json())
      .then((json) => setItems(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const deleteItem = (id) => {
    setItems((prevItems) => {
      return prevItems.filter((item) => item.id != id);
    });
  };

  const addItem = (text) => {
    if (!text) {
      Alert.alert('Error', 'Please enter an item', {text: 'Ok'});
    } else {
      fetch('http://localhost:8000/react/api/create/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: text,
        }),
      });
      setItems((prevItems) => {
        let id = prevItems.length + 1;
        return [{id: id, text}, ...prevItems];
      });
    }
  };
  return (
    <View style={styles.container}>
      <Header title="Shopping List" />
      <AddItem addItem={addItem} />
      <FlatList
        data={items}
        keyExtractor={({id}, index) => id}
        renderItem={({item}) => (
          <ListItem item={item} deleteItem={deleteItem} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
});

export default App;
