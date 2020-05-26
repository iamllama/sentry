import * as Sentry from '@sentry/browser';

import {Client} from 'app/api';
import ReleaseActions from 'app/actions/releaseActions';

type ParamsGet = {
  orgSlug: string;
  projectSlug: string;
  releaseVersion: string;
};

export function getRelease(api: Client, params: ParamsGet) {
  const {orgSlug, projectSlug, releaseVersion} = params;
  const path = `/projects/${orgSlug}/${projectSlug}/releases/${encodeURIComponent(
    releaseVersion
  )}/`;

  ReleaseActions.loadVersion(orgSlug, projectSlug, releaseVersion);

  return api
    .requestPromise(path, {
      method: 'GET',
    })
    .then(res => {
      ReleaseActions.loadVersionSuccess(projectSlug, releaseVersion, res);
    })
    .catch(err => {
      ReleaseActions.loadVersionError(projectSlug, releaseVersion, err);
      Sentry.withScope(scope => {
        scope.setLevel(Sentry.Severity.Warning);
        scope.setFingerprint(['release-action-creator']);
        Sentry.captureException(err);
      });
    });
}

/*
export function getReleaseRepos(api: Client, params: ParamsGet) {
  const {orgSlug, releaseVersion} = params;
  const path = `/projects/${orgSlug}/repos/`;

  return api
    .requestPromise(path, {
      method: 'GET',
    })
    .then(res => {
      console.log('getReleaseRepos', res);
      ReleaseActions.loadVersionError(projectSlug, releaseVersion, res);
    })
    .catch(err => {
      ReleaseActions.loadVersionError(projectSlug, releaseVersion, err);
    });
}

export function getReleaseDeploys(api: Client, params: ParamsGet) {
  const {orgSlug, projectSlug, releaseVersion} = params;

  const path = `/projects/${orgSlug}/${projectSlug}/releases/${encodeURIComponent(
    releaseVersion
  )}/deploys/`;

  return api
    .requestPromise(path, {
      method: 'GET',
    })
    .then(res => {
      console.log('getReleaseDeploys', res);
      ReleaseActions.loadVersionError(projectSlug, releaseVersion, res);
    })
    .catch(err => {
      ReleaseActions.loadVersionError(projectSlug, releaseVersion, err);
    });
}
*/
