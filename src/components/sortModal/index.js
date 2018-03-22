import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { backgroundColor } from '../../constants/config';

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.75,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    marginTop: 8,
  },
});

class SortModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.selectedValue,
      sortData: props.sortData,
    };
    this.selectValue = this.selectValue.bind(this);
  }

  selectValue(data) {
    this.props.onSelect(data);
  }

  render() {
    const { selectedValue, sortData } = this.state;
    let height = 40 + sortData.length * 40;
    height = height > 320 ? 320 : height;
    return (
      <View style={[styles.container, { height }]}>
        <Text
          style={{
            color: backgroundColor,
            marginBottom: 8,
          }}
        >
          Sort By
        </Text>
        <ScrollView>
          {sortData.map(data => (
            <TouchableHighlight
              key={data}
              onPress={() => this.selectValue(data)}
              underlayColor="#f1f1f1"
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 8,
                }}
              >
                <Text>{data}</Text>
                {selectedValue === data ? (
                  <Icon
                    name={Platform.OS === 'ios' ? 'ios-radio-button-on' : 'md-radio-button-on'}
                    color={backgroundColor}
                    size={18}
                  />
                ) : (
                  <Icon
                    name={Platform.OS === 'ios' ? 'ios-radio-button-off' : 'md-radio-button-off'}
                    color={backgroundColor}
                    size={18}
                  />
                )}
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }
}

SortModal.propTypes = {
  sortData: PropTypes.array,
  selectedValue: PropTypes.string,
  onSelect: PropTypes.func,
};

SortModal.defaultProps = {
  sortData: [],
  selectedValue: '',
  onSelect: null,
};

export default SortModal;
