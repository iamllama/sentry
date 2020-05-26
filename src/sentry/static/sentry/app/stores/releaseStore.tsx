import Reflux from 'reflux';

import ReleaseActions from 'app/actions/releaseActions';
import {Release} from 'app/types';

type StoreRelease = Map<string, Release>;
type StoreLoading = Map<string, boolean>;
type StoreError = Map<string, Error>;

type ReleaseStoreInterface = {
  get(
    projectSlug: string,
    releaseVersion: string
  ): {
    release: Release | undefined;
    loading: boolean | undefined;
    error: Error | undefined;
  };

  orgSlug: string | undefined;
  releases: StoreRelease;
  loading: StoreLoading;
  error: StoreError;

  loadVersion(orgSlug: string, projectSlug: string, releaseVersion: string): void;
  loadVersionSuccess(projectSlug: string, releaseVersion: string, data: Release): void;
  loadVersionError(projectSlug: string, releaseVersion: string, error: Error);
};

export const getReleaseKey = (projectSlug: string, releaseVersion: string) =>
  `${projectSlug}${releaseVersion}`;

const ReleaseStoreConfig: Reflux.StoreDefinition & ReleaseStoreInterface = {
  orgSlug: undefined,
  releases: new Map() as StoreRelease,
  loading: new Map() as StoreLoading,
  error: new Map() as StoreError,

  listenables: [ReleaseActions],

  init() {
    this.reset();
  },

  reset(releaseKey?: string) {
    // Reset data for the entire store
    if (!releaseKey) {
      this.orgSlug = undefined;
      this.releases = new Map() as StoreRelease;
      this.loading = new Map() as StoreLoading;
      this.error = new Map() as StoreError;
      return;
    }

    // Reset data for a release
    this.releases.delete(releaseKey);
    this.loading.delete(releaseKey);
    this.error.delete(releaseKey);
  },

  loadVersion(orgSlug: string, projectSlug: string, releaseVersion: string) {
    const releaseKey = getReleaseKey(projectSlug, releaseVersion);

    // Wipe entire store if the user switched organizations
    if (!this.orgSlug || this.orgSlug !== orgSlug) {
      this.reset();
      this.orgSlug = orgSlug;
    }

    this.loading[releaseKey] = true;
  },

  loadVersionError(projectSlug: string, releaseVersion: string, error: Error) {
    const releaseKey = getReleaseKey(projectSlug, releaseVersion);

    this.loading[releaseKey] = false;
    this.error[releaseKey] = error;
  },

  loadVersionSuccess(projectSlug: string, releaseVersion: string, data: Release) {
    const releaseKey = getReleaseKey(projectSlug, releaseVersion);

    this.loading[releaseKey] = false;
    this.error[releaseKey] = undefined;
    this.releases[releaseKey] = data;
  },

  get(projectSlug: string, releaseVersion: string) {
    const releaseKey = getReleaseKey(projectSlug, releaseVersion);

    return {
      release: this.releases[releaseKey] as Release | undefined,
      loading: this.loading[releaseKey] as boolean | undefined,
      error: this.error[releaseKey] as Error | undefined,
    };
  },
};

type ReleaseStore = Reflux.Store & ReleaseStoreInterface;
export default Reflux.createStore(ReleaseStoreConfig) as ReleaseStore;
