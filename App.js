import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import convert from 'convert-units';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';
import { SimpleLineIcons } from '@expo/vector-icons';

const measures = convert().measures();
const mainColor = '#052F5F';

const MeasureView = ({ measure }) => {
  const units = convert().possibilities(measure);
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [toUnit, setToUnit] = useState(units[1]);
  const [value, setValue] = useState('0');
  const [valueConverted, setValueConverted] = useState(0);

  useEffect(() => {
    setValueConverted(
      convert(+value)
        .from(fromUnit)
        .to(toUnit)
        .toFixed(2)
    );
  }, [value, fromUnit, toUnit]);

  return (
    <View style={styles.scene}>
      <View style={styles.row}>
        <Picker
          style={styles.column}
          selectedValue={fromUnit}
          onValueChange={setFromUnit}
        >
          {units.map((unit, i) => (
            <Picker.Item label={unit} value={unit} key={i} />
          ))}
        </Picker>
        <View style={styles.column}>
          <TextInput
            value={value}
            onChange={setValue}
            keyboardType={'numeric'}
            style={styles.input}
          />
        </View>
      </View>
      <SimpleLineIcons
        name='arrow-down-circle'
        size={40}
        color={mainColor}
        style={{ alignSelf: 'center' }}
      />
      <View style={styles.row}>
        <Picker
          style={styles.column}
          selectedValue={toUnit}
          onValueChange={setToUnit}
        >
          {units.map((unit, i) => (
            <Picker.Item label={unit} value={unit} key={i} />
          ))}
        </Picker>
        <View style={styles.column}>
          <Text
            style={[
              styles.input,
              { fontSize: 40, fontWeight: 'bold', borderBottomWidth: 0 },
            ]}
          >
            {valueConverted}
          </Text>
        </View>
      </View>
    </View>
  );
};

const unCamelCase = (value) => value.replace(/([A-Z])/g, ' $1');

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    measures.map((m) => ({ key: m, title: unCamelCase(m) }))
  );

  const renderScene = ({ route }) => {
    return <MeasureView measure={route.key} />;
  };

  return (
    <View style={[styles.scene, { marginTop: Constants.statusBarHeight }]}>
      <Text style={styles.title}>Unit Converter</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            tabStyle={{ width: 'auto' }}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: mainColor }}
          />
        )}
      ></TabView>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  title: {
    padding: 15,
    fontWeight: 'bold',
    color: mainColor,
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    height: 40,
    borderColor: mainColor,
    borderBottomWidth: 1,
    fontSize: 30,
    textAlign: 'center',
  },
});
