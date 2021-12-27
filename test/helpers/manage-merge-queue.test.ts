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

import { Mocktokit } from '../types';
import { READY_FOR_MERGE_PR_LABEL } from '../../src/constants';
import { addLabels } from '../../src/helpers/add-labels';
import { manageMergeQueue } from '../../src/helpers/manage-merge-queue';
import { octokit } from '../../src/octokit';
import { removeLabel } from '../../src/helpers/remove-label';
import { setCommitStatus } from '../../src/helpers/set-commit-status';
import { updateMergeQueue } from '../../src/utils/update-merge-queue';

jest.mock('../../src/helpers/add-labels');
jest.mock('../../src/helpers/set-commit-status');
jest.mock('../../src/utils/update-merge-queue');
jest.mock('../../src/helpers/remove-label');
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: { repo: { repo: 'repo', owner: 'owner' }, issue: { number: 123 } },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: { get: jest.fn() },
      issues: { addLabels: jest.fn() },
      search: { issuesAndPullRequests: jest.fn() }
    }
  }))
}));
const items = ['some', 'items'];

describe('manageMergeQueue', () => {
  describe('pr merged case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: true,
          number: 123,
          labels: [{ name: 'QUEUED FOR MERGE #1' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabel).toHaveBeenCalledWith({
        label: 'QUEUED FOR MERGE #1',
        pull_number: '123'
      });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });

  describe('pr not ready for merge case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          number: 123,
          labels: [{ name: 'QUEUED FOR MERGE #2' }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call remove label with correct params', () => {
      expect(removeLabel).toHaveBeenCalledWith({
        label: 'QUEUED FOR MERGE #2',
        pull_number: '123'
      });
    });

    it('should call updateMergeQueue with correct params', () => {
      expect(updateMergeQueue).toHaveBeenCalledWith(items);
    });
  });

  describe('pr ready for merge case', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 2,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call setCommitStatus with correct params', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha',
        context: 'QUEUE CHECKER',
        state: 'pending',
        description: 'This PR is #2 in line to merge.'
      });
    });

    it('should call addLabels with correct params', () => {
      expect(addLabels).toHaveBeenCalledWith({
        labels: 'QUEUED FOR MERGE #2',
        pull_number: '123'
      });
    });
  });

  describe('pr ready for merge case queued #1', () => {
    beforeEach(async () => {
      (octokit.search.issuesAndPullRequests as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          total_count: 1,
          items
        }
      }));
      (octokit.pulls.get as unknown as Mocktokit).mockImplementation(async () => ({
        data: {
          merged: false,
          head: { sha: 'sha' },
          labels: [{ name: READY_FOR_MERGE_PR_LABEL }]
        }
      }));
      await manageMergeQueue();
    });

    it('should call issuesAndPullRequests search with correct params', () => {
      expect(octokit.search.issuesAndPullRequests).toHaveBeenCalledWith({
        q: `org:owner+repo:repo+is:pr+is:open+label:"${READY_FOR_MERGE_PR_LABEL}"`
      });
    });

    it('should call setCommitStatus', () => {
      expect(setCommitStatus).toHaveBeenCalledWith({
        sha: 'sha',
        context: 'QUEUE CHECKER',
        state: 'success',
        description: 'This PR is next to merge.'
      });
    });

    it('should call addLabels with correct params', () => {
      expect(addLabels).toHaveBeenCalledWith({
        labels: 'QUEUED FOR MERGE #1',
        pull_number: '123'
      });
    });
  });
});