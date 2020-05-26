import React from 'react';
import Reflux from 'reflux';
import createReactClass from 'create-react-class';

import {Client} from 'app/api';
import {Release} from 'app/types';
import getDisplayName from 'app/utils/getDisplayName';
import ReleaseStore, {getReleaseKey} from 'app/stores/releaseStore';
import {getRelease} from 'app/actionCreators/releases';

type InjectedReleaseProps = {
  api: Client;
  orgSlug: string;
  projectSlug: string;
  releaseVersion: string;
};

type State = {
  release: Release | undefined;
};

const withRelease = <P extends InjectedReleaseProps>(
  WrappedComponent: React.ComponentType<P>
) =>
  createReactClass<
    Omit<P, keyof InjectedReleaseProps> & Partial<InjectedReleaseProps>,
    State
  >({
    displayName: `withRelease(${getDisplayName(WrappedComponent)})`,
    mixins: [Reflux.listenTo(ReleaseStore, 'onStoreUpdate') as any],

    getInitialState() {
      const {projectSlug, releaseVersion} = this.props as P & InjectedReleaseProps;
      const releaseData = ReleaseStore.get(projectSlug, releaseVersion);

      return {release: releaseData.release};
    },

    componentDidMount() {
      this.fetchRelease();
    },

    fetchRelease() {
      const {api, orgSlug, projectSlug, releaseVersion} = this.props as P &
        InjectedReleaseProps;
      const releaseData = ReleaseStore.get(projectSlug, releaseVersion);

      if (!releaseData.release && !releaseData.loading) {
        // HACK(dlee): Actions fired by the ActionCreators are queued to the back
        // of the event loop, allowing another getRelease for the same release
        // to be fired before the loading state is updated in store.
        // This hack short-circuits that and update the state immediately.
        ReleaseStore.loading[getReleaseKey(projectSlug, releaseVersion)] = true;

        getRelease(api, {orgSlug, projectSlug, releaseVersion});
      }
    },

    onStoreUpdate() {
      const {projectSlug, releaseVersion} = this.props as P & InjectedReleaseProps;
      const releaseData = ReleaseStore.get(projectSlug, releaseVersion);

      this.setState({release: releaseData.release});
    },

    render() {
      return (
        <WrappedComponent
          Release={this.state.Release as Release}
          {...(this.props as P)}
        />
      );
    },
  });

export default withRelease;
