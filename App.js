import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TextInput, View, FlatList, Text, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, { useState, useEffect } from 'react';

export default function App() {

const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [list, setList] = useState([]);

const db = SQLite.openDatabase('coursedb.db');

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists item (id integer primary key not null, product text, amount text);');
  }, null, updateList);
}, []);

const saveItem = () => {
  db.transaction(tx => {
    tx.executeSql('insert into item (product, amount) values (?, ?);',
      [product, amount]);
  }, null, updateList)
  setProduct('');
  setAmount('');
}

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from item;', [], (_, { rows }) =>
      setList(rows._array)
    );
  }, null, null);
}

const deleteItem = (id) => {
  db.transaction(tx => {
    tx.executeSql('delete from item where id = ?;', [id]);
  }, null, updateList)
}

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.input}
        placeholder='Amount'
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title='Save'/>
      <Text style={styles.title}>Shopping List</Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.fl}>
            <Text style={styles.list}>{item.product}, {item.amount} </Text>
            <Text style={styles.bought} onPress={() => deleteItem(item.id)}> bought</Text>
          </View>
        }
        data={list}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  bought: {
    color: 'blue'
  },
  title: {
    fontSize: 18,
    margin: 10,
    fontWeight: 'bold'
  },
  input: {
    margin: 5,
    fontSize: 16,
    width: 200,
    borderColor: 'grey',
    borderWidth: 1,
  },
  list: {
    fontSize: 16,
    margin:1
  },
  fl: {
    flexDirection: 'row'
  }

});
