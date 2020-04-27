import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';

import {
  TouchableOpacity,
  Row,
  Subtitle,
  Caption,
  View,
  ImageBackground,
  Overlay,
  Icon,
  Divider,
} from '@shoutem/ui';

/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default class SmallVideoView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    video: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.video);
  }

  render() {
    const { video } = this.props;

    // For some reason we pass null instead of an empty string, so another check is necessary
    // for situations when the thumbnail isn't provided
    const thumbnailUrl = _.get(video, 'video.thumbnailurl');
    const resolvedThumbnailUrl = (thumbnailUrl === null) ? undefined : thumbnailUrl;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row>
          <ImageBackground
            styleName="medium rounded-corners placeholder"
            source={{ uri: resolvedThumbnailUrl }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </ImageBackground>

          <View styleName="vertical stretch space-between md-gutter-horizontal">
            <Subtitle numberOfLines={3}>{video.name}</Subtitle>
            <View styleName="horizontal space-between">
              <Caption>{moment(video.timeCreated).fromNow()}</Caption>
              <Caption>{video.duration}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
