exports.id = 473;
exports.ids = [473,209];
exports.modules = {

/***/ 9042:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cc": () => (/* binding */ GITHUB_OPTIONS),
/* harmony export */   "$9": () => (/* binding */ DEFAULT_PIPELINE_STATUS),
/* harmony export */   "Km": () => (/* binding */ DEFAULT_PIPELINE_DESCRIPTION),
/* harmony export */   "Hc": () => (/* binding */ PRODUCTION_ENVIRONMENT),
/* harmony export */   "mj": () => (/* binding */ DEFAULT_BRANCH),
/* harmony export */   "_d": () => (/* binding */ CORE_APPROVED_PR_LABEL),
/* harmony export */   "Xt": () => (/* binding */ PEER_APPROVED_PR_LABEL),
/* harmony export */   "Ak": () => (/* binding */ READY_FOR_MERGE_PR_LABEL),
/* harmony export */   "Ee": () => (/* binding */ QUEUED_FOR_MERGE_PREFIX),
/* harmony export */   "IH": () => (/* binding */ FIRST_QUEUED_PR_LABEL),
/* harmony export */   "nJ": () => (/* binding */ JUMP_THE_QUEUE_PR_LABEL),
/* harmony export */   "HW": () => (/* binding */ DEFAULT_PR_TITLE_REGEX)
/* harmony export */ });
/* unused harmony export DEFAULT_EXEMPT_DESCRIPTION */
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
// These extra headers are for experimental operations. Newer versions of octokit may not require this
const GITHUB_OPTIONS = {
    headers: {
        accept: 'application/vnd.github.ant-man-preview+json,application/vnd.github.flash-preview+json,application/vnd.github.v3+json'
    }
};
const DEFAULT_EXEMPT_DESCRIPTION = 'Passed in case the check is exempt.';
const DEFAULT_PIPELINE_STATUS = 'Pipeline Status';
const DEFAULT_PIPELINE_DESCRIPTION = 'Pipeline clear.';
const PRODUCTION_ENVIRONMENT = 'production';
const DEFAULT_BRANCH = 'main';
const CORE_APPROVED_PR_LABEL = 'CORE APPROVED';
const PEER_APPROVED_PR_LABEL = 'PEER APPROVED';
const READY_FOR_MERGE_PR_LABEL = 'READY FOR MERGE';
const QUEUED_FOR_MERGE_PREFIX = 'QUEUED FOR MERGE';
const FIRST_QUEUED_PR_LABEL = `${QUEUED_FOR_MERGE_PREFIX} #1`;
const JUMP_THE_QUEUE_PR_LABEL = 'JUMP THE QUEUE';
const DEFAULT_PR_TITLE_REGEX = '^(build|ci|chore|docs|feat|fix|perf|refactor|style|test|revert|Revert|BREAKING CHANGE)((.*))?: .+$';


/***/ }),

/***/ 7473:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "manageMergeQueue": () => (/* binding */ manageMergeQueue)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __webpack_require__(2186);
// EXTERNAL MODULE: ./src/constants.ts
var constants = __webpack_require__(9042);
// EXTERNAL MODULE: ./node_modules/@actions/github/lib/github.js
var github = __webpack_require__(5438);
// EXTERNAL MODULE: ./src/octokit.ts
var octokit = __webpack_require__(6161);
// EXTERNAL MODULE: ./src/helpers/set-commit-status.ts
var set_commit_status = __webpack_require__(2209);
// EXTERNAL MODULE: ./node_modules/bluebird/js/release/bluebird.js
var bluebird = __webpack_require__(8710);
;// CONCATENATED MODULE: ./src/utils/update-merge-queue.ts




const updateMergeQueue = (queuedPrs) => {
    const prsSortedByQueuePosition = queuedPrs
        .map(pr => {
        var _a, _b;
        const label = (_a = pr.labels.find(label => { var _a; return (_a = label.name) === null || _a === void 0 ? void 0 : _a.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.Ee); })) === null || _a === void 0 ? void 0 : _a.name;
        const queuePosition = Number((_b = label === null || label === void 0 ? void 0 : label.split('#')) === null || _b === void 0 ? void 0 : _b[1]);
        return {
            pull_number: pr.number,
            label,
            queuePosition
        };
    })
        .sort((pr1, pr2) => pr1.queuePosition - pr2.queuePosition);
    return (0,bluebird.map)(prsSortedByQueuePosition, (pr, index) => {
        const { pull_number, label, queuePosition } = pr;
        const newQueuePosition = index + 1;
        if (!label || queuePosition === newQueuePosition) {
            return;
        }
        return Promise.all([
            octokit/* octokit.issues.addLabels */.K.issues.addLabels(Object.assign({ labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.Ee} #${newQueuePosition}`], issue_number: pull_number }, github.context.repo)),
            octokit/* octokit.issues.removeLabel */.K.issues.removeLabel(Object.assign({ name: label, issue_number: pull_number }, github.context.repo))
        ]);
    });
};

;// CONCATENATED MODULE: ./src/helpers/manage-merge-queue.ts
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const manageMergeQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { items, total_count: queuePosition } } = yield getQueuedPrData();
    const issue_number = github.context.issue.number;
    const { data: pullRequest } = yield octokit/* octokit.pulls.get */.K.pulls.get(Object.assign({ pull_number: issue_number }, github.context.repo));
    if (pullRequest.merged || !pullRequest.labels.find(label => label.name === constants/* READY_FOR_MERGE_PR_LABEL */.Ak)) {
        core.info('This PR is not in the merge queue.');
        return removePRFromQueue(pullRequest, items);
    }
    const isFirstQueuePosition = queuePosition === 1 || pullRequest.labels.find(label => label.name === constants/* FIRST_QUEUED_PR_LABEL */.IH);
    return Promise.all([
        octokit/* octokit.issues.addLabels */.K.issues.addLabels(Object.assign({ labels: [`${constants/* QUEUED_FOR_MERGE_PREFIX */.Ee} #${queuePosition}`], issue_number }, github.context.repo)),
        (0,set_commit_status.setCommitStatus)({
            sha: pullRequest.head.sha,
            context: 'QUEUE CHECKER',
            state: isFirstQueuePosition ? 'success' : 'pending',
            description: isFirstQueuePosition ? 'This PR is next to merge.' : `This PR is #${queuePosition} in line to merge.`
        })
    ]);
});
const removePRFromQueue = (pullRequest, queuedPrs) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queueLabel = (_a = pullRequest.labels.find(label => { var _a; return (_a = label.name) === null || _a === void 0 ? void 0 : _a.startsWith(constants/* QUEUED_FOR_MERGE_PREFIX */.Ee); })) === null || _a === void 0 ? void 0 : _a.name;
    if (queueLabel) {
        yield octokit/* octokit.issues.removeLabel */.K.issues.removeLabel(Object.assign({ name: queueLabel, issue_number: pullRequest.number }, github.context.repo));
        yield updateMergeQueue(queuedPrs);
    }
});
const getQueuedPrData = () => {
    const { repo, owner } = github.context.repo;
    return octokit/* octokit.search.issuesAndPullRequests */.K.search.issuesAndPullRequests({
        q: `org:${owner}+repo:${repo}+is:pr+is:open+label:"${constants/* READY_FOR_MERGE_PR_LABEL */.Ak}"`
    });
};


/***/ }),

/***/ 2209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setCommitStatus": () => (/* binding */ setCommitStatus)
/* harmony export */ });
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8710);
/* harmony import */ var bluebird__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bluebird__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _octokit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6161);
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



const setCommitStatus = ({ sha, context, state, description, target_url }) => (0,bluebird__WEBPACK_IMPORTED_MODULE_1__.map)(context.split('\n'), context => _octokit__WEBPACK_IMPORTED_MODULE_2__/* .octokit.repos.createCommitStatus */ .K.repos.createCommitStatus(Object.assign({ sha,
    context,
    state,
    description,
    target_url }, _actions_github__WEBPACK_IMPORTED_MODULE_0__.context.repo)));


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": () => (/* binding */ octokit)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
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


const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_1__.getOctokit)(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('github_token', { required: true })).rest;


/***/ })

};
;
//# sourceMappingURL=473.index.js.map