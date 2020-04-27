import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

import {
  isBusy,
  isInitialized,
  isError,
  shouldRefresh,
} from '@shoutem/redux-io';
import {
  EmptyStateView,
  ListView,
  Screen,
} from '@shoutem/ui';

import { ext } from '../const';

const { array, func, shape, string } = PropTypes;

/* eslint-disable  class-methods-use-this */

export default class RemoteDataListScreen extends PureComponent {
  static propTypes = {
    // The shortcut title
    title: string,

    // Data items to display
    // eslint-disable-next-line  react/forbid-prop-types
    data: array,

    // Actions
    next: func.isRequired,
    // Component style
    style: shape({
      screen: Screen.propTypes.style,
      list: ListView.propTypes.style,
      emptyState: EmptyStateView.propTypes.style,
    }),
  };

  static defaultProps = {
    style: {
      screen: {},
      list: {},
      emptyState: {},
    },
  };

  constructor(props, context) {
    super(props, context);

    this.fetchData = this.fetchData.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate(prevProps) {
    this.refreshData(prevProps);
  }

  refreshData(prevProps = {}) {
    const { data } = this.props;

    if (shouldRefresh(data, true)) {
      this.fetchData();
    }
  }

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: (title || '').toUpperCase(),
    };
  }

  getListProps() {
    return {};
  }

  // Override this function if you want custom sections
  getSectionId() {
    return null;
  }

  loadMore() {
    this.props.next(this.props.data);
  }

 /*
  * Override this function to implement specific data fetching.
  * It's empty since it's called to refresh data.
  */
  fetchData() {

  }

  shouldRenderPlaceholderView(data) {
    if ((!isInitialized(data) && !isError(data)) || isBusy(data)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if data is empty
    return isError(data) || !_.size(data);
  }

  renderPlaceholderView(data) {
    const { style } = this.props;

    const emptyStateViewProps = {
      icon: 'refresh',
      message: isError(data) ?
        I18n.t(ext('unexpectedErrorMessage')) :
        I18n.t(ext('preview.noContentErrorMessage')),
      onRetry: this.fetchData,
      retryButtonTitle: I18n.t(ext('tryAgainButton')),
      style: style.emptyState,
    };

    return (
      <EmptyStateView {...emptyStateViewProps} />
    );
  }

  // Override this function if you want custom section headers. Used with getSectionId.
  renderSectionHeader() {
    return null;
  }

  // Oveerride this function to render a featured item which differs from default renderRow.
  // eslint-disable-next-line no-unused-vars
  renderFeaturedItem(item) {
    return null;
  }

  // Override this function to render data items
  // eslint-disable-next-line no-unused-vars
  renderRow(item) {
    return null;
  }

  renderData(data) {
    const { hasFeaturedItem } = this.props;

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        renderRow={this.renderRow}
        loading={isBusy(data) || !isInitialized(data)}
        onRefresh={this.fetchData}
        onLoadMore={this.loadMore}
        renderSectionHeader={this.renderSectionHeader}
        hasFeaturedItem={hasFeaturedItem}
        renderFeaturedItem={this.renderFeaturedItem}
        style={this.props.style.list}
        initialListSize={1}
        {...this.getListProps()}
      />
    );
  }

  render() {
    const { data, style } = this.props;
    const navigationBarProps = this.getNavigationBarProps();

    return (
      <Screen style={style.screen}>
        <NavigationBar {...navigationBarProps} />
        {this.renderData(data)}
      </Screen>
    );
  }
}
