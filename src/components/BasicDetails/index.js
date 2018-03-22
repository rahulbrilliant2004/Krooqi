import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Picker,
  TextInput,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import RNGooglePlaces from 'react-native-google-places';
import { Navigation } from 'react-native-navigation';
import MapView from 'react-native-maps';
import styles from './styles';
import { backgroundColor, propertyStatuses } from '../../constants/config';
import Panel from '../Panel';
import Map from '../Map';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

Navigation.registerComponent('krooqi.Map', () => Map);
class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyStatus: '',
      region: '',
      city: '',
      district: '',
      address: '',
      unit: '',
      mapRegion: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    this.selectPropertyStatus = this.selectPropertyStatus.bind(this);
    this.selectRegion = this.selectRegion.bind(this);
    this.openMap = this.openMap.bind(this);
  }

  selectPropertyStatus(index) {
    let termId = 0;
    if (index === 0) {
      termId = 33;
    } else if (index === 1) {
      termId = 34;
    } else {
      termId = 108;
    }
    this.setState({ propertyStatus: termId });
    this.openMap = this.openMap.bind(this);
  }

  selectRegion() {
    alert('select region');
  }

  openMap() {
    RNGooglePlaces.openPlacePickerModal()
      .then((place) => {
        this.setState({
          mapRegion: {
            ...this.state.mapRegion,
            latitude: place.latitude,
            longitude: place.longitude,
          },
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  renderRegion() {
    const { region } = this.state;
    return (
      <View>
        <Picker mode="dropdown" selectedValue={region} onValueChange={this.selectMinArea}>
          <Picker.Item label="Min Area" />
        </Picker>
        {Platform.OS !== 'ios' && <View style={styles.divider} />}
      </View>
    );
  }

  render() {
    const {
      propertyStatus, region, city, district, address, unit, mapRegion,
    } = this.state;
    const { OS } = Platform;
    let statusSelectedIndex = 0;
    if (propertyStatus === 34) {
      statusSelectedIndex = 1;
    }
    if (propertyStatus === 108) {
      statusSelectedIndex = 2;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.flex}>
          <KeyboardAvoidingView style={styles.flex} behavior="padding">
            <View style={styles.margin}>
              <SegmentedControlTab
                tabStyle={{ borderColor: backgroundColor }}
                activeTabStyle={{ backgroundColor }}
                tabTextStyle={{ color: backgroundColor }}
                values={propertyStatuses}
                selectedIndex={statusSelectedIndex}
                onTabPress={this.selectPropertyStatus}
              />
            </View>
            {OS === 'ios' ? (
              <Panel title="Region" text={region}>
                {this.renderRegion()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>Region</Text>
                {this.renderRegion()}
              </View>
            )}
            {OS === 'ios' ? (
              <Panel title="City" text={city}>
                {this.renderRegion()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>City</Text>
                {this.renderRegion()}
              </View>
            )}
            {OS === 'ios' ? (
              <Panel title="District" text={district}>
                {this.renderRegion()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>District</Text>
                {this.renderRegion()}
              </View>
            )}
            <View style={styles.margin}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                placeholder="Address"
                onChangeText={txt => this.setState({ address: txt })}
              />
            </View>
            <View style={styles.margin}>
              <Text style={styles.label}>Unit / Floor</Text>
              <TextInput
                style={styles.textInput}
                value={unit}
                placeholder="Unit / Floor"
                onChangeText={txt => this.setState({ unit: txt })}
              />
            </View>
            <View style={[{ flexDirection: 'row' }, styles.margin]}>
              <TouchableHighlight onPress={this.openMap} underlayColor="gray">
                <Text style={{ padding: 10 }}>LOCATE ON MAP</Text>
              </TouchableHighlight>
            </View>
            {mapRegion.latitude !== 0 &&
              mapRegion.longitude !== 0 && (
                <View style={[styles.margin, { height: 200 }]}>
                  <MapView style={{ flex: 1 }} region={mapRegion}>
                    <MapView.Marker
                      coordinate={{
                        latitude: mapRegion.latitude,
                        longitude: mapRegion.longitude,
                      }}
                    />
                  </MapView>
                </View>
              )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

Location.propTypes = {};

export default Location;
