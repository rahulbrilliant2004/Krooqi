/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  Linking,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../Carousel';
import LikeButton from '../LikeButton';
import PropertyContent from '../PropertyContent';
import { backgroundColor } from '../../constants/config';

// const { width, height } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      modalVisible: false,
    };
    this.showModal = this.showModal.bind(this);
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  openGps = () => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url = `${scheme}37.484847,-122.148386`;
    this.openExternalApp(url);
  };

  openExternalApp = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('ERROR', `Unable to open: ${url}`, [{ text: 'OK' }]);
      }
    });
  };

  scrollViewContent = () => (
    <Animated.ScrollView
      style={styles.fill}
      scrollEventThrottle={1}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
        useNativeDriver: true,
      })}
    >
      <PropertyContent property={this.props.property} />
    </Animated.ScrollView>
  );

  render() {
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 1],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    const { property, favorites, onLikePress } = this.props;

    return (
      <View style={styles.fill}>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            {this.scrollViewContent()}
          </KeyboardAvoidingView>
        ) : (
          this.scrollViewContent()
        )}
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
          <TouchableWithoutFeedback onPress={this.showModal}>
            <Animated.Image
              style={[
                styles.backgroundImage,
                {
                  opacity: imageOpacity,
                  transform: [{ translateY: imageTranslate }],
                },
              ]}
              source={{ uri: this.props.property.thumbnail }}
            />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [{ scale: titleScale }, { translateY: titleTranslate }],
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <View>
              <TouchableWithoutFeedback onPress={this.props.closeModel}>
                {Platform.OS === 'ios' ? (
                  <Icon name="ios-close" size={30} />
                ) : (
                  <Icon name="md-close" size={30} />
                )}
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flexGrow: 1 }} />
            <View>
              <LikeButton
                onLikePress={() => onLikePress(property.ID)}
                isFavorite={favorites.some(x => x.ID === property.ID)}
              />
            </View>
          </View>
        </Animated.View>
        <Modal
          animationType="slide"
          transparent={false}
          style={{ backgroundColor: 'black' }}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <Carousel
            images={this.props.property.images}
            closeModel={() => {
              this.setState({ modalVisible: false });
            }}
          />
        </Modal>
      </View>
    );
  }
}

App.propTypes = {
  property: PropTypes.object.isRequired,
  closeModel: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
  onLikePress: PropTypes.func,
};

App.defaultProps = {
  onLikePress: () => null,
};

function mapStateToProps(state) {
  const favorites = state.favorites.success || [];
  return {
    favorites,
  };
}

export default connect(mapStateToProps)(App);
