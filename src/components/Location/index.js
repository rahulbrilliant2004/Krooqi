import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
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
import I18n from '../../i18n';
import styles from './styles';
import { backgroundColor, propertyStatuses } from '../../constants/config';
import Panel from '../Panel';
import Map from '../Map';
import { connect } from 'react-redux'
import { 
  updatePropertyFor,
  updateRegion, 
  updateBranch, 
  updateDistrict, 
  updateAddress, 
  updateUnitFloor,
  updateLocationOnMap,
  updateScreen_1,
} from '../../Actions/propertyPostAction'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var countriesArr = ['Saudi Arabia']
var citiesArr = ['Asir','Jeddah Province','Makkah Province','Qassim','Riyadh Province','Tabuk']
var districtsArr = ['Al Khunayqiyah','Jeddah','Labkhah','Mecca','Riyadh']

Navigation.registerComponent('krooqi.Map', () => Map);

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toProperCase = function() {
  return this.toLowerCase().replace(/^(.)|\s(.)/g, 
      function($1) { return $1.toUpperCase(); });
}

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyStatus: '33',
      branchLo: '',
      regionLo: '',
      city: '',
      districtLo: '',
      addressLo: '',
      unit: '',
      mapRegion: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    this.selectPropertyStatus = this.selectPropertyStatus.bind(this);  
    this.openMap = this.openMap.bind(this);
  }

  selectRegion = (region) => {
    this.setState({ regionLo: region });
    this.props.updateRegion(region)
  }
  selectBranch = (branch) => {
    this.setState({ branchLo: branch });
    this.props.updateBranch(branch)
  }
  selectDistrict = (district) => {
    this.setState({ districtLo: district });
    this.props.updateDistrict(district)
  }

  addressUpdate = (addText) => {
    this.setState({ addressLo: addText })
    this.props.updateAddress(addText)
  }

  unitFloorUpdate = (unitUpdate) => {
    this.setState({ unit: unitUpdate })
    this.props.updateUnitFloor(unitUpdate)
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
    this.props.updatePropertyFor(termId)
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
        this.props.updateLocationOnMap(this.state.mapRegion)
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  }

  renderRegion() {
    const { regionLo } = this.state;
    const pp_region = `${I18n.t('pp_region').capitalize()}`;
    return (
      <View>
        <Picker mode="dropdown" selectedValue={regionLo} onValueChange={ (value) => {this.selectRegion(value)}}>
          <Picker.Item label={pp_region} value="Select country" />
          {
            countriesArr.length > 0 && (
              countriesArr.map((country, i) => {
               return <Picker.Item key={i} label={country} value={country} />     
              })
            )
          }
        </Picker>
        {Platform.OS !== 'ios' && <View style={styles.divider} />}
      </View>
    );
  }

  renderBranch() {
    const { branchLo } = this.state;
    const pp_branch = `${I18n.t('pp_branch').capitalize()}`;
    return (
      <View>
        <Picker mode="dropdown" selectedValue={branchLo} onValueChange={(value) => {this.selectBranch(value)}}>
          <Picker.Item label={pp_branch} value="key0" />
          {
            citiesArr.length > 0 && (
              citiesArr.map((city, i) => {
              return  <Picker.Item key={i} label={city} value={city} />     
              })
            )
          }
        </Picker>
        {Platform.OS !== 'ios' && <View style={styles.divider} />}
      </View>
    );
  }

  renderDistrict() {
    const { districtLo } = this.state;
    const pp_district = `${I18n.t('pp_district').capitalize()}`;
    return (
      <View>
        <Picker mode="dropdown" selectedValue={districtLo} onValueChange={(value) => {this.selectDistrict(value)}}>
          <Picker.Item label={pp_district} value="Select District" />
          {
            districtsArr.length > 0 && (
              districtsArr.map((district, i) => {
              return  <Picker.Item key={i} label={district} value={district} />     
              })
            )
          }
        </Picker>
        {Platform.OS !== 'ios' && <View style={styles.divider} />}
      </View>
    );
  }

  render() {
    const {
      propertyStatus, regionLo, city, districtLo, addressLo, unit, mapRegion, branchLo
    } = this.state;
    const { OS } = Platform;
    let statusSelectedIndex = 0;
    if (propertyStatus === 34) {
      statusSelectedIndex = 1;
    }
    if (propertyStatus === 108) {
      statusSelectedIndex = 2;
    }
    const { propertyFor, region, branch, district, address, unitFloor, locationOnMap, screen_1 } = this.props.propertyPost;

    const pp_region = `${I18n.t('pp_region').capitalize()}`;
    const pp_branch = `${I18n.t('pp_branch').capitalize()}`;
    const pp_district = `${I18n.t('pp_district').capitalize()}`;
    const pp_address = `${I18n.t('pp_address').capitalize()}`;
    const pp_unit_floor = `${I18n.t('pp_unit_floor').capitalize()}`;
    const pp_loacate_on_map = `${I18n.t('pp_loacate_on_map').capitalize()}`;

    let For_Rent = `${I18n.t('pp_for_rent').toProperCase()}`;
    let For_Sale = `${I18n.t('pp_for_sale').toProperCase()}`;
    let Devlopment = `${I18n.t('pp_for_development').toProperCase()}`;
    let property_type_Location =  [For_Rent, For_Sale, Devlopment];

    return (
      <View style={styles.container}>
        <View style={styles.mainViewHead}><Text style={styles.mainViewHeadText}>  {I18n.t('ppt_loc').capitalize()} </Text></View>
        <ScrollView style={styles.flex}>
          <KeyboardAvoidingView style={styles.flex} behavior="padding">
            {
              screen_1 && (
                Alert.alert(
                  `${I18n.t('ppa_required').capitalize()}`,
                  `${I18n.t('ppa_content').capitalize()}`,
                  [
                    {text: `${I18n.t('ppa_ok').capitalize()}`, onPress: () => this.props.updateScreen_1(false)},
                  ],
                  { cancelable: false }
                )
              )
            }
            <View style={styles.margin}>
              <SegmentedControlTab
                tabStyle={{ borderColor: backgroundColor }}
                activeTabStyle={{ backgroundColor }}
                tabTextStyle={{ color: backgroundColor }}
                values={property_type_Location}
                selectedIndex={statusSelectedIndex}
                onTabPress={this.selectPropertyStatus}
              />
            </View>       
            {OS === 'ios' ? (
              <Panel title={pp_region} text={regionLo}>
                {this.renderRegion()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>{pp_region}</Text>
                {this.renderRegion()}
              </View>
            )}
            {OS === 'ios' ? (
              <Panel title={pp_branch} text={branchLo}>
                {this.renderBranch()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>{pp_branch}</Text>
                {this.renderBranch()}
              </View>
            )}
            {OS === 'ios' ? (
              <Panel title={pp_district} text={districtLo}>
                {this.renderDistrict()}
              </Panel>
            ) : (
              <View style={styles.margin}>
                <Text style={styles.label}>{pp_district}</Text>
                {this.renderDistrict()}
              </View>
            )}
            <View style={styles.margin}>
              <Text style={styles.label}>{pp_address}</Text>
              <TextInput
                style={styles.textInput}
                value={addressLo}
                placeholder={pp_address}
                onChangeText={txt => this.addressUpdate(txt)}
              />
            </View>
            <View style={styles.margin}>
              <Text style={styles.label}>{pp_unit_floor}</Text>
              <TextInput
                style={styles.textInput}
                value={unit}
                placeholder={pp_unit_floor}
                onChangeText={txt => this.unitFloorUpdate(txt) }
              />
            </View>
            <View style={[{ flexDirection: 'row' }, styles.margin]}>
              <TouchableHighlight onPress={this.openMap} underlayColor="gray">
                <Text style={{ padding: 10 }}>{pp_loacate_on_map}</Text>
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

function mapStateToProps (state) {
  return {
    propertyPost: state.propertyPost,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updatePropertyFor: (value) => dispatch(updatePropertyFor(value)),
    updateRegion: (value) => dispatch(updateRegion(value)),
    updateBranch: (value) => dispatch(updateBranch(value)),
    updateDistrict: (value) => dispatch(updateDistrict(value)),
    updateAddress: (value) => dispatch(updateAddress(value)),
    updateUnitFloor: (value) => dispatch(updateUnitFloor(value)),
    updateLocationOnMap: (value) => dispatch(updateLocationOnMap(value)),
    updateScreen_1: (value) => dispatch(updateScreen_1(value)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location)