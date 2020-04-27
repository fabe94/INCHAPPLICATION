import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  ImageBackground,
  ImageGallery,
  Html,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { NavigationBar } from 'shoutem.navigation';
import { getLeadImageUrl, createRenderAttachment } from 'shoutem.rss';

import { NextArticle } from '../components/NextArticle';
import { ext } from '../const';

export class ArticleDetailsScreen extends PureComponent {
  static propTypes = {
    // The news article to display
    article: PropTypes.object.isRequired,
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: PropTypes.object,
    // A function that will open the given article, this
    // function is required to show the up next view
    openArticle: PropTypes.func,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: PropTypes.bool,
    openNextArticle: PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;

    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title}
          imageUrl={getLeadImageUrl(nextArticle)}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }

    return null;
  }

  renderInlineGallery() {
    const { article, showInlineGallery } = this.props;

    if (!showInlineGallery) {
      return null;
    }

    const images = _.map(article.imageAttachments, 'url');

    return (
      <ImageGallery sources={images} height={300} width={Dimensions.get('window').width} />
    );
  }

  render() {
    const { article } = this.props;

    const articleImageUrl = getLeadImageUrl(article);
    const momentDate = moment.utc(article.timeUpdated);

    const dateInfo = moment.utc(momentDate).isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {moment.utc(momentDate).fromNow()}
      </Caption>
    ) : null;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={article.title}
          share={{
            title: article.title,
            link: article.link,
          }}
        />
        <ScrollView>
          <ImageBackground
            styleName="large-portrait placeholder"
            source={articleImageUrl ? { uri: articleImageUrl } : undefined}
            animationName="hero"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{article.title.toUpperCase()}</Title>
              <View styleName="horizontal collapsed" virtual>
                <Caption numberOfLines={1} styleName="collapsible">{article.author}</Caption>
                {dateInfo}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </ImageBackground>
          <View styleName="solid">
            <Html body={article.body} renderElement={createRenderAttachment(article, 'image')} />
            {this.renderInlineGallery()}
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
