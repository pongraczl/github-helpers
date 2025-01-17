/*
Copyright 2021 Expedia, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DEFAULT_PIPELINE_DESCRIPTION, DEFAULT_PIPELINE_STATUS, PRODUCTION_ENVIRONMENT } from '../../src/constants';
import { Mocktokit } from '../types';
import { context } from '@actions/github';
import { notifyPipelineComplete } from '../../src/helpers/notify-pipeline-complete';
import { octokit } from '../../src/octokit';
import { setDeploymentStatus } from '../../src/helpers/set-deployment-status';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { list: jest.fn() },
      repos: { createCommitStatus: jest.fn() }
    }
  }))
}));
jest.mock('../../src/helpers/set-deployment-status');

(octokit.pulls.list as unknown as Mocktokit).mockImplementation(async () => ({
  data: [{ head: { sha: 'sha 1' } }, { head: { sha: 'sha 2' } }, { head: { sha: 'sha 3' } }]
}));

describe('setOpenPullRequestStatus', () => {
  const description = 'Pipeline clear.';

  beforeEach(async () => {
    await notifyPipelineComplete({});
  });

  it('should call list with correct params', () => {
    expect(octokit.pulls.list).toHaveBeenCalledWith({
      state: 'open',
      per_page: 100,
      ...context.repo
    });
  });

  it.each(['sha 1', 'sha 2', 'sha 3'])('should call createCommitStatus with correct params', sha => {
    expect(octokit.repos.createCommitStatus).toHaveBeenCalledWith({
      sha,
      context: DEFAULT_PIPELINE_STATUS,
      state: 'success',
      description,
      ...context.repo
    });
  });

  it('should call setDeploymentStatus with correct params', () => {
    expect(setDeploymentStatus).toHaveBeenCalledWith({
      state: 'success',
      environment: PRODUCTION_ENVIRONMENT,
      description: DEFAULT_PIPELINE_DESCRIPTION,
      ...context.repo
    });
  });
});
