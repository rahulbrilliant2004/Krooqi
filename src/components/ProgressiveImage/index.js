import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';

class progressiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      imageLoaded: false,
    };
  }
  onLoad() {
    this.setState({ imageLoaded: true });
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      duration: 250,
    }).start();
  }
  onThumbnailLoad() {
    if (!this.state.imageLoaded) {
      Animated.timing(this.state.thumbnailOpacity, {
        toValue: 1,
        duration: 250,
      }).start();
    }
  }
  render() {
    return (
      <View
        width={this.props.style.width}
        height={this.props.style.height}
        backgroundColor="#ffffff"
      >
        <Animated.Image
          resizeMode="cover"
          key={this.props.key}
          style={[
            {
              position: 'absolute',
            },
            this.props.style,
          ]}
          source={this.props.source}
          onLoad={event => this.onLoad(event)}
        />
        <Animated.Image
          resizeMode="cover"
          key={this.props.key}
          style={[
            {
              opacity: this.state.thumbnailOpacity,
            },
            this.props.style,
          ]}
          source={this.props.thumbnail}
          onLoad={event => this.onThumbnailLoad(event)}
        />
      </View>
    );
  }
}

progressiveImage.propTypes = {};

export default progressiveImage;
