## 1.3.5 (2024-10-19)

#### Bug Fixes

* check secure context before generating randomUUID (0faed10c)

#### Chores

* **release:** 1.3.4 (d2baf6f6)


## 1.3.4 (2024-10-19)

#### Bug Fixes

* crypto.randomUUID validation for secure context (8892cfe0)

#### Chores

* **release:** 1.3.3 (e7cf367a)


## 1.3.3 (2024-10-19)

#### Bug Fixes

* docker container redirection (71e1fa76)

#### Documentation

* remove container after exec in docker example (ed264ebb)

#### Code Refactoring

* simplify by returning early (79938530)
* use objectmother instead of faker directly (63125dfc)

#### Styles

* sort import (145a9fa4)

#### Chores

* **release:** 1.3.2 (f5f4787b)

#### Build

* remove unused dep (6138a753)
* **deps:** bump the npm_and_yarn group with 4 updates (#148) (388795f1)


## 1.3.2 (2024-10-10)

#### Bug Fixes

* index html syntax (06d72fd4)

#### Documentation

* add more screenshots (b924f4b8)

#### Code Refactoring

* use static fields instead of exports (e33b2cb3)

#### Styles

* order imports (ca0df7e0)

#### Chores

* **release:** 1.3.1 (6e3b28d9)

#### Build

* **deps:** bump big.js from 6.2.1 to 6.2.2 (#146) (c27ce989)
* **deps-dev:** bump jsdom from 25.0.0 to 25.0.1 (#147) (211dec6a)
* **deps-dev:** bump @biomejs/biome from 1.8.3 to 1.9.3 (#143) (1ea0d349)
* **deps-dev:** bump @vitejs/plugin-react-swc from 3.7.0 to 3.7.1 (#144) (ef84c9a3)


## 1.3.1 (2024-09-29)

#### Bug Fixes

* add missing currency codes (c45af414)

#### Tests

* delete context test (cfe6782a)
* missing budget methods (057417d3)

#### Code Refactoring

* pass userOptions to avoid mocking context (6ab9dd88)
* new useroptions domain (5cd178d2)
* rename options and refactor model (e4473b0f)
* remove context mocks from tests, model errors domain (d1ba1dea)
* intlFormat util (7455bf47)
* move locale funcs to repo (9cebd959)
* initialize localforage instances in respective repos (36fdb9c6)
* move folders to guitos (f1abc8a4)

#### Styles

* order imports (9f71e6fa)

#### Chores

* **release:** 1.3.0 (70956840)

#### Build

* bump vite (1383ea1c)

#### CI

* exclude tests from coverage (088bdce7)
* exclude test mothers from coverage (7af99e2f)


## 1.3.0 (2024-09-14)

#### Feature

* larger buttons in menu (f89a91aa)

#### Bug Fixes

* spacing on new menu (dfb201d4)

#### Chores

* **release:** 1.2.11 (2a3ee749)


## 1.2.11 (2024-09-14)

#### Bug Fixes

* charts page filter margin (03a7d145)

#### Chores

* **release:** 1.2.10 (f4e52d87)


## 1.2.10 (2024-09-14)

#### Bug Fixes

* cleaner look due to reduced number of borders (0a90dcc4)

#### Documentation

* update screenshots (e9286ca5)

#### Tests

* split into mothers (9fcdca1d)

#### Styles

* order imports (9991babe)

#### Chores

* **release:** 1.2.9 (e3299471)

#### Build

* fix html meta tags (21a10f8e)
* **deps-dev:** bump @playwright/test from 1.45.3 to 1.46.1 (#139) (e1e74477)
* **deps:** bump react-router-dom from 6.26.0 to 6.26.1 (#140) (8cc0c270)
* **deps-dev:** bump jsdom from 24.1.1 to 25.0.0 (#138) (2c1eecfe)
* **deps:** bump framer-motion from 11.3.21 to 11.3.31 (#137) (2a24caab)
* **deps:** bump react-icons from 5.2.1 to 5.3.0 (#141) (f568a4c6)

#### CI

* enable no negation else rule (ad873cb3)


## 1.2.9 (2024-08-31)

#### Bug Fixes

* open last visited budget script (b063cd5f)

#### Chores

* **release:** 1.2.8 (b708963e)


## 1.2.8 (2024-08-31)

#### Bug Fixes

* content-security-policy typo (e32ad859)

#### Chores

* **release:** 1.2.7 (3739ed99)

#### CI

* remove redundant config (1253b908)


## 1.2.7 (2024-08-31)

#### Bug Fixes

* content-security-policy (404ef7d2)


## 1.2.5 (2024-08-28)

#### Bug Fixes

* infinite loop (42e8a55c)

#### Tests

* disable e2e (1c384da7)
* fix assertion (54e16706)
* remove unnecessary assertion (edab4180)

#### Code Refactoring

* remove unused code (8da614de)

#### Styles

* imports order (c413690f)

#### Chores

* **release:** 1.2.4 (382492d0)

#### Build

* bump axe-core (276b3631)


## 1.2.4 (2024-08-28)

#### Bug Fixes

* import and type (20d33621)
* serialization to db (b41111eb)

#### Tests

* disable flaky (f809a0e5)
* adjust e2e (0ef48332)
* fix and disable some (3c0a8a69)
* fix (c2b77264)

#### Styles

* apply recommended biome fixes (f5c7f461)
* fix (4ac5eb43)

#### Chores

* **release:** 1.2.3 (cd0ee2a3)

#### CI

* biome enable recommended (e2abe172)


## 1.2.3 (2024-08-27)

#### Bug Fixes

* add missing script hash (89151785)

#### Chores

* **release:** 1.2.2 (9f8cab18)


## 1.2.2 (2024-08-27)

#### Bug Fixes

* only try to open last visited budget if none is specified (524bf13d)
* typo (86592b0c)

#### Documentation

* add note about last visited behaviour (0a1e8b34)

#### Tests

* disable flaky test (7d4a16ae)

#### Chores

* **release:** 1.2.1 (44eb52d7)


## 1.2.1 (2024-08-27)

#### Bug Fixes

* open last visited budget during startup (300db9c8)

#### CI

* pass secret to composite (6d75ac95)


## 1.1.7 (2024-08-10)

#### Bug Fixes

* infinite loop in calculate button (6a2455b5)

#### Chores

* **release:** 1.1.6 (06d23e9e)

#### CI

* rename bundle folder (dd5544bb)


## 1.1.6 (2024-08-06)

#### Bug Fixes

* bundle release name (74b898af)

#### Chores

* **release:** 1.1.5 (cb51841f)


## 1.1.5 (2024-08-06)

#### Bug Fixes

* bundle upload condition (ccd2194e)
* bundle upload condition (90db83f6)

#### Chores

* **release:** 1.1.4 (33282620)


## 1.1.4 (2024-08-06)

#### Bug Fixes

* push release commit as last step (d1012037)

#### Chores

* **release:** 1.1.3 (4e2a1be3)


## 1.1.3 (2024-08-06)

#### Bug Fixes

* concurrency setup and bundle task (3a757bba)

#### Chores

* **release:** 1.1.2 (7d878877)


## 1.1.2 (2024-08-06)

#### Bug Fixes

* bundle upload on github (7d432e3f)

#### Chores

* **release:** 1.1.1 (fff72134)


## 1.1.1 (2024-08-06)

#### Bug Fixes

* useffect dependencies  on saveBudget() (94e9f797)
* history button disabled after history change (04354a1a)

#### Tests

* disable flaky test (c75bf3e9)

#### Chores

* **release:** 1.1.0 (b74c2388)

#### CI

* merge docker and release actions (d7c728e9)
* use correct action (df3901a0)
* upload release bundle to gh release (9b0923b1)
* fix package name (9cc09730)
* remove context field (dabeec34)
* add qemu (3258cb3b)
* fix perms, use buildx (7f3bc64d)


## 1.1.0 (2024-08-03)

#### Feature

* add container image option (a2ae58c7)

#### Documentation

* fix typo (10f67f7f)
* add json schema (ae282202)

#### Tests

* add missing act() (be6c29dc)
* add missing act() (fd5b8c6a)

#### Styles

* fix formatting (f4fd54e6)

#### Chores

* **release:** 1.0.2 (8e258c6d)

#### Build

* enable strictNullChecks (1041bca2)
* bump deps (008d5da7)
* **deps-dev:** bump @testing-library/react from 14.2.1 to 16.0.0 (#135) (397d0f8a)
* **deps-dev:** bump @playwright/test from 1.45.1 to 1.45.3 (#134) (f560cf2d)
* **deps:** bump use-immer from 0.9.0 to 0.10.0 (#133) (f1bc08a2)
* **deps:** bump react-icons from 5.1.0 to 5.2.1 (#132) (0ad1993a)
* **deps-dev:** bump @testing-library/jest-dom from 6.4.2 to 6.4.8 (#136) (75e3308b)

#### CI

* set timeouts, harden permissions, cancel builds (5f960ccb)


## 1.0.2 (2024-07-26)

#### Bug Fixes

* missing accessibility labels and tests (b4c7642b)

#### Chores

* **release:** 1.0.1 (e87d4f51)

#### Build

* add axe-core/playwright (a27bccf9)


## 1.0.1 (2024-07-25)

#### Bug Fixes

* menu header spacing (9e5d1a59)

#### Tests

* fix flaky download assertion (43f63a25)

#### Chores

* **release:** 1.0.0 (0029af80)

#### Build

* **deps:** bump react-router-dom from 6.23.0 to 6.24.0 (#129) (9dcc5cd4)
* **deps-dev:** bump @playwright/test from 1.42.1 to 1.45.1 (#131) (5a2f41cd)
* **deps-dev:** bump vite from 5.2.10 to 5.3.3 (#130) (7a5596bc)
* **deps-dev:** bump @biomejs/biome from 1.8.1 to 1.8.3 (#126) (8559b2ab)
* **deps-dev:** bump jsdom from 24.0.0 to 24.1.0 (#117) (8752cc23)
* **deps:** bump immer from 10.0.4 to 10.1.1 (#118) (e8c1867f)
* **deps-dev:** bump @types/node from 20.12.7 to 20.14.8 (#124) (129e959a)

#### CI

* set node version (935c53fc)
* lower playwright timeout to 11 seconds (0a567fe8)
* remove redundant vite-plugin-biome (55a16255)
* remove packagemanager field (52590a22)
* replace stylelint with biome (2a10c7d1)
* delete unused script (bc64a66e)


## 1.0.0 (2024-06-23)

#### Bug Fixes

* env vars in script (f0958b0c)
* release script path (5c9ff4d7)
* force release (0d466c52)
* force release (f836a6fd)
* release cli args (d8f183f8)

#### Reverts

* jsdom bump (86fbb755)

#### Documentation

* add missing twitter card tags (b1d91c1c)

#### Tests

* enable multiple playwright test workers (22018ed9)
* fix lint issues (0dbd0125)
* disable flaky tests (5c15568a)
* remove render from beforeEach, wrap with waitFor (4b26122a)
* remove render from beforeEach (3fcef045)
* fix selectors (d7449364)
* fix label selector (3810c4ac)
* add description (7dc9d0dc)
* add config for vscode extension (bc0a296e)

#### Styles

* apply biome suggestions (f51e31fc)
* fix eslint warnings (011a023e)
* lint package.json (17e8dd1c)

#### Chores

* **release:** 1.0.0 (ca4ce4ba)
* **release:** 1.0.0 (fb6fa9f7)

#### Build

* swap vite plugin react with swc version (66b45aef)
* **deps:** bump pnpm/action-setup from 3 to 4 (#119) (75bc8d56)
* bump libs (787c168a)
* bump libs (3a275d12)
* update lock files (7f0fe684)
* add eslint and prettier plugins (9e947e51)

#### CI

* simplify actions flow (11993cba)
* delete duplicate changelog entry (73a0b73c)
* migrate to cloudflare wrangler-action (1aa79c58)
* set correct origin (2fb7e129)
* skip local tag deletion (b7f89f74)
* add v to tag (b4227712)
* remove stale tag (beb61f05)
* use git directly (4010a927)
* use action instead of hook (2aba358d)
* remove quotes and slash from hooks-exec (1699f2c6)
* fix script for hook exec (26245026)
* use script for hook exec (d4964dec)
* use single quotes (dd2cff15)
* escape args (c3d133b9)
* set Semantic Release step name (3e69458f)
* enable changelog creation (d037e296)
* fix checkout step config (eddd36b7)
* set pnpm config for vscode (940f8662)
* replace semantic-release, uplift, git-cliff with go-semantic-release (1823bfc9)
* set npm options (127dc33f)
* disable uplift changelog (71df96cb)
* add uplift config (56a88371)
* add versio config (16097596)
* pull since last tag (5d6623f6)
* add missing env var (8d657d80)
* set correct params for cliff-jumper (2c35f8e8)
* update pnpm-lock (813779c2)
* replace semantic-release with git-cliff and cliff-jumper (600a476b)
* use pnpm with semantic-release (5d0cfb22)
* set pnpm version (4fa2eb05)
* set packagemanager field (0c2a0213)
* replace eslint and prettier with biome (16ccd2bb)
* add lint to actions (cab5601e)
* fix eslint config (51a8ce2e)
* use playwright container (19b0f1a6)
* pnpm dedup (5eaac9cf)
* add eslint-plugin-yml (e326fba4)
* add console-fail-test (93189b82)
* bump pnpm version (5ce6ef30)
* add eslint-plugin-regexp (c70ca43b)
* update prettier and eslint configs (86138836)
* add more vscode settings (242e0bf5)
* force clear mocks (c5c7472a)


## [0.35.1](https://github.com/rare-magma/guitos/compare/v0.35.0...v0.35.1) (2024-04-06)


### Bug Fixes

* add missing open graph tags ([715145e](https://github.com/rare-magma/guitos/commit/715145e196646308630aa9a7161fc109bc682692))

# [0.35.0](https://github.com/rare-magma/guitos/compare/v0.34.0...v0.35.0) (2024-03-29)


### Bug Fixes

* remove box shadow on button ([4dc3c90](https://github.com/rare-magma/guitos/commit/4dc3c90e155f8cf1eb8015898081faadc2e3e3ca))
* set aria-hidden on icons ([41d5453](https://github.com/rare-magma/guitos/commit/41d545390fab38346d176d31f8e74a5718d0f8ec))


### Features

* add toggle button for item reordering ([4921bb9](https://github.com/rare-magma/guitos/commit/4921bb96d94d0abf3ec43891a49081a8bde875e2))

# [0.34.0](https://github.com/rare-magma/guitos/compare/v0.33.0...v0.34.0) (2024-03-18)


### Features

* reorderable list of items ([4c8565f](https://github.com/rare-magma/guitos/commit/4c8565f8aec3f16e5ad092d85063cec2cdd8baa4)), closes [#89](https://github.com/rare-magma/guitos/issues/89)


### Performance Improvements

* lazy load tables ([60b909b](https://github.com/rare-magma/guitos/commit/60b909b5f8d46f45cec39780ad79a67ee1acea7f))

# [0.33.0](https://github.com/rare-magma/guitos/compare/v0.32.1...v0.33.0) (2024-03-16)


### Bug Fixes

* increase bottom padding on landing page title ([ad6dba1](https://github.com/rare-magma/guitos/commit/ad6dba1f10873af9850cdb4a1af7e7f7d2bbe5da))


### Features

* combine import/export buttons ([90e5508](https://github.com/rare-magma/guitos/commit/90e5508df2b75e8e95ef11c80f39d105c89a857f))

## [0.32.1](https://github.com/rare-magma/guitos/compare/v0.32.0...v0.32.1) (2024-03-13)


### Bug Fixes

* automated release publishing ([eaaa9f3](https://github.com/rare-magma/guitos/commit/eaaa9f3430e015e0f665f0a720a72d9ab901f53f))

# [0.32.0](https://github.com/rare-magma/guitos/compare/v0.31.0...v0.32.0) (2024-03-13)


### Bug Fixes

* notification font style ([f910148](https://github.com/rare-magma/guitos/commit/f910148b5cc524d90d7627d98d4c609b4ada15a6))


### Features

* add title to landing page ([a4c9986](https://github.com/rare-magma/guitos/commit/a4c99867708e195c27b49e2ef329492012e52bc7))

# [0.31.0](https://github.com/rare-magma/guitos/compare/v0.30.2...v0.31.0) (2024-02-25)


### Features

* add missing aria labels ([cf30731](https://github.com/rare-magma/guitos/commit/cf30731ec62683dba69959864aaa5d1a5ae8ba81))

## [0.30.2](https://github.com/rare-magma/guitos/compare/v0.30.1...v0.30.2) (2024-02-06)


### Bug Fixes

* enable Subresource Integrity checks ([13ce613](https://github.com/rare-magma/guitos/commit/13ce613c68d3b8f9d6bdf2829a5178485009a74f))

## [0.30.1](https://github.com/rare-magma/guitos/compare/v0.30.0...v0.30.1) (2023-12-24)


### Bug Fixes

* disable go buttons when impossible to do so ([e7773f5](https://github.com/rare-magma/guitos/commit/e7773f5564677e176e794c54a7355ca01d414313))

# [0.30.0](https://github.com/rare-magma/guitos/compare/v0.29.1...v0.30.0) (2023-12-24)


### Features

* add item operation history ([ea21598](https://github.com/rare-magma/guitos/commit/ea21598feacfdd695d6a56a0d8fe2c2db670976a))

## [0.29.1](https://github.com/rare-magma/guitos/compare/v0.29.0...v0.29.1) (2023-12-23)


### Bug Fixes

* focus element after searching for it ([b65832a](https://github.com/rare-magma/guitos/commit/b65832abb6e80dfee61907fbdb1b67cea76acf44))

# [0.29.0](https://github.com/rare-magma/guitos/compare/v0.28.2...v0.29.0) (2023-12-09)


### Bug Fixes

* home shortcut action ([50c96cf](https://github.com/rare-magma/guitos/commit/50c96cf2645b6a26e1cd7f058d7fbc5d1da70f6d))
* set unique jsx keys ([bad4b5e](https://github.com/rare-magma/guitos/commit/bad4b5edc23455a706167803a711f2d63a5f6d3a))


### Features

* add undo redo nav buttons ([90992e0](https://github.com/rare-magma/guitos/commit/90992e0ba1d826355671e97d28697b5e8f349386))
* add useUndoable to BudgetContext ([135d1f1](https://github.com/rare-magma/guitos/commit/135d1f1fbbe548237e3f5a0b05e75fb52ff1ec93))
* add useundoable to context ([1e2daf0](https://github.com/rare-magma/guitos/commit/1e2daf0fb4d6981f6bd6ef467c75052d0e6c41ca))
* consolidate export, currency and version into settings button ([42f06ac](https://github.com/rare-magma/guitos/commit/42f06ac3bc6223ca952456e6c4d76a8e02408c48))
* save history only on specific actions ([903c859](https://github.com/rare-magma/guitos/commit/903c859c290d3e26e536ebd336c663d233c5c1d4))
* undo budget deletion button in notification ([f3d413c](https://github.com/rare-magma/guitos/commit/f3d413ccd477a9cbabecabb544bad88eee77381b))

## [0.28.2](https://github.com/rare-magma/guitos/compare/v0.28.1...v0.28.2) (2023-10-15)


### Bug Fixes

* tooltip overlap with static vertical position ([387504a](https://github.com/rare-magma/guitos/commit/387504a6d7d8ebcc273a379615cf5d7b8a1d03ea))

## [0.28.1](https://github.com/rare-magma/guitos/compare/v0.28.0...v0.28.1) (2023-10-15)


### Performance Improvements

* smaller bundle with updated recharts ([38276da](https://github.com/rare-magma/guitos/commit/38276da2ba9e49091c55aa4299aeffd7560dc892))

# [0.28.0](https://github.com/rare-magma/guitos/compare/v0.27.3...v0.28.0) (2023-10-14)


### Features

* new chart based on filtering by item name ([8f8bcce](https://github.com/rare-magma/guitos/commit/8f8bccea8981156324e50e65041632e21c4480bf))

## [0.27.3](https://github.com/rare-magma/guitos/compare/v0.27.2...v0.27.3) (2023-10-13)


### Bug Fixes

* add workbox-window to dev deps ([ba0b30b](https://github.com/rare-magma/guitos/commit/ba0b30bc96e684b21c02ff9c4dc758a69aa5bfe1))

## [0.27.2](https://github.com/rare-magma/guitos/compare/v0.27.1...v0.27.2) (2023-10-13)


### Bug Fixes

* release process ([c2debaf](https://github.com/rare-magma/guitos/commit/c2debaf342971a084e39d437a6a68d636173799d))

## [0.27.1](https://github.com/rare-magma/guitos/compare/v0.27.0...v0.27.1) (2023-10-13)


### Performance Improvements

* enable experimentalVmThreads for faster tests ([fcb70df](https://github.com/rare-magma/guitos/commit/fcb70df61d35aa640812eb99499b97ca498807c8))

# [0.27.0](https://github.com/rare-magma/guitos/compare/v0.26.0...v0.27.0) (2023-10-12)


### Features

* improve screen reader a11y ([edc5bf5](https://github.com/rare-magma/guitos/commit/edc5bf57ee92978008a55aafd686b16223dc718a))

# [0.26.0](https://github.com/rare-magma/guitos/compare/v0.25.3...v0.26.0) (2023-09-24)


### Features

* improve search by matching item names ([7162974](https://github.com/rare-magma/guitos/commit/71629743d7ec642921d44f74fc6f1920b0947701))

## [0.25.3](https://github.com/rare-magma/guitos/compare/v0.25.2...v0.25.3) (2023-09-19)


### Performance Improvements

* lazy load charts page ([d7c006d](https://github.com/rare-magma/guitos/commit/d7c006d737e0d62c18148ba71d17c231f045171e))

## [0.25.2](https://github.com/rare-magma/guitos/compare/v0.25.1...v0.25.2) (2023-09-19)


### Bug Fixes

* notification border color ([2d867f3](https://github.com/rare-magma/guitos/commit/2d867f3367c76956f0c52bd53eb38d45d62a90ac))

## [0.25.1](https://github.com/rare-magma/guitos/compare/v0.25.0...v0.25.1) (2023-09-19)


### Bug Fixes

* notifications placement & styling ([8f4a5f5](https://github.com/rare-magma/guitos/commit/8f4a5f5b544ed39602068b8c93306e31a742628a))

# [0.25.0](https://github.com/rare-magma/guitos/compare/v0.24.5...v0.25.0) (2023-09-18)


### Features

* trigger notifications on budget creation, cloning and deletion ([acc9a8e](https://github.com/rare-magma/guitos/commit/acc9a8e0dcdcc89ca8cb85601b42ec2556714d01))

## [0.24.5](https://github.com/rare-magma/guitos/compare/v0.24.4...v0.24.5) (2023-09-18)


### Bug Fixes

* no matches found dark style ([da58917](https://github.com/rare-magma/guitos/commit/da5891755c1f084aee9a47197558d26f0751df08))

## [0.24.4](https://github.com/rare-magma/guitos/compare/v0.24.3...v0.24.4) (2023-09-18)


### Bug Fixes

* prevent spamming keyboard shortcuts ([aa1d081](https://github.com/rare-magma/guitos/commit/aa1d081fd9e254d4c6e3a8c2f2065deaf8064f44))

## [0.24.3](https://github.com/rare-magma/guitos/compare/v0.24.2...v0.24.3) (2023-09-17)


### Bug Fixes

* increase background color contrast ([5b3110d](https://github.com/rare-magma/guitos/commit/5b3110dcd343f2dd47cfbd9d3c735e18ffd6b652))

## [0.24.2](https://github.com/rare-magma/guitos/compare/v0.24.1...v0.24.2) (2023-08-29)


### Reverts

* Revert "fix: add macOS favicon" ([030796b](https://github.com/rare-magma/guitos/commit/030796b3768757bc28352221c0e9c54fc23655e6))

## [0.24.1](https://github.com/rare-magma/guitos/compare/v0.24.0...v0.24.1) (2023-08-29)


### Bug Fixes

* add macOS favicon ([b88c898](https://github.com/rare-magma/guitos/commit/b88c89890e6b0c651af65922a286353ed3928d13))

# [0.24.0](https://github.com/rare-magma/guitos/compare/v0.23.0...v0.24.0) (2023-08-19)


### Bug Fixes

* expenses header tooltip ([ee09ef3](https://github.com/rare-magma/guitos/commit/ee09ef391610f8ef119248a323302cc80acdca2f))


### Features

* add % of revenue spent progress bar and info ([2156712](https://github.com/rare-magma/guitos/commit/21567123b7009953da7bfeff45e35218f998e63a))

# [0.23.0](https://github.com/rare-magma/guitos/compare/v0.22.4...v0.23.0) (2023-07-29)


### Features

* cleaner style without header bgcolor, dedup css ([db88472](https://github.com/rare-magma/guitos/commit/db88472f6c2e8484d890dfc31922f90b0686239e))

## [0.22.4](https://github.com/rare-magma/guitos/compare/v0.22.3...v0.22.4) (2023-07-23)


### Performance Improvements

* optimize index.css ([6569bec](https://github.com/rare-magma/guitos/commit/6569bec4b128873c61489914ea7132304e50414d))

## [0.22.3](https://github.com/rare-magma/guitos/compare/v0.22.2...v0.22.3) (2023-07-02)


### Bug Fixes

* charts X axis spacing ([b7eafa8](https://github.com/rare-magma/guitos/commit/b7eafa8963f148d3e94f665c90ed34afd7de632b))

## [0.22.2](https://github.com/rare-magma/guitos/compare/v0.22.1...v0.22.2) (2023-07-02)


### Bug Fixes

* chart tooltip spacing ([1bbf01d](https://github.com/rare-magma/guitos/commit/1bbf01df7b6a11cb3fcb72cd810120c5ac7bfad9))
* use fixed width font on chart tooltip ([36e299f](https://github.com/rare-magma/guitos/commit/36e299f3a690950341e3dc861d95eb51833a0aa2))

## [0.22.1](https://github.com/rare-magma/guitos/compare/v0.22.0...v0.22.1) (2023-06-25)


### Bug Fixes

* monospace font selection for values ([19219df](https://github.com/rare-magma/guitos/commit/19219dfd1df6dcb70c89f469305e7270b8925353))

# [0.22.0](https://github.com/rare-magma/guitos/compare/v0.21.0...v0.22.0) (2023-06-25)


### Bug Fixes

* chart y axis width ([e7463cb](https://github.com/rare-magma/guitos/commit/e7463cbe20422d3cbfb9d1538ef7caf68e53b244))


### Features

* use monospace font for values ([cf2e6dc](https://github.com/rare-magma/guitos/commit/cf2e6dcffcbc072c4bc15c784f9eeb3233ffa63c))

# [0.21.0](https://github.com/rare-magma/guitos/compare/v0.20.1...v0.21.0) (2023-06-21)


### Features

* execute item value operation on enter keypress ([7886336](https://github.com/rare-magma/guitos/commit/788633678c60fd36f986dd4fd24898af4584da46))

## [0.20.1](https://github.com/rare-magma/guitos/compare/v0.20.0...v0.20.1) (2023-06-12)


### Bug Fixes

* inconsistent margins, responsive chart legends ([88bf6d5](https://github.com/rare-magma/guitos/commit/88bf6d570928ad0bd7b8cf52a9c995cd8b27b843))

# [0.20.0](https://github.com/rare-magma/guitos/compare/v0.19.6...v0.20.0) (2023-06-11)


### Features

* add charts view ([3cdd941](https://github.com/rare-magma/guitos/commit/3cdd94130e9a72105e09753fcef2e788a6a98718))
* add go to current month's budget shortcut ([71f1ae4](https://github.com/rare-magma/guitos/commit/71f1ae43779ac0f0bd42bc55609daede3ea920bd))

## [0.19.6](https://github.com/rare-magma/guitos/compare/v0.19.5...v0.19.6) (2023-06-11)


### Bug Fixes

* 💸 box size ([20069fb](https://github.com/rare-magma/guitos/commit/20069fb61cb9f347b3af4adccd58ae9de969f6d7))

## [0.19.5](https://github.com/rare-magma/guitos/compare/v0.19.4...v0.19.5) (2023-06-10)


### Bug Fixes

* placeholder color on firefox ([7f366e9](https://github.com/rare-magma/guitos/commit/7f366e9c1645bcb5feefe92f6ccc39389b6fab2d))

## [0.19.4](https://github.com/rare-magma/guitos/compare/v0.19.3...v0.19.4) (2023-06-10)


### Bug Fixes

* set correct index.html theme-color and description ([397b697](https://github.com/rare-magma/guitos/commit/397b6970ffe6a627e9781c0860883ef873c654ac))

## [0.19.3](https://github.com/rare-magma/guitos/compare/v0.19.2...v0.19.3) (2023-06-10)


### Bug Fixes

* item value input initial selection for all currencies ([b8b0b25](https://github.com/rare-magma/guitos/commit/b8b0b25c1931690e3b8d0191673d56c6af5a9f44))

## [0.19.2](https://github.com/rare-magma/guitos/compare/v0.19.1...v0.19.2) (2023-06-10)


### Bug Fixes

* item value input initial selection ([4c4cfce](https://github.com/rare-magma/guitos/commit/4c4cfce6c05266c93404258c742454fbb0dd1640))

## [0.19.1](https://github.com/rare-magma/guitos/compare/v0.19.0...v0.19.1) (2023-05-31)


### Bug Fixes

* loading guitos emoji ([0aa8a04](https://github.com/rare-magma/guitos/commit/0aa8a0486c3196fe25d93483aa523c097c14deb8))

# [0.19.0](https://github.com/rare-magma/guitos/compare/v0.18.1...v0.19.0) (2023-05-31)


### Features

* add security headers ([5b2b1e4](https://github.com/rare-magma/guitos/commit/5b2b1e46732379f5a8061a73d1a13affb922e30a))

## [0.18.1](https://github.com/rare-magma/guitos/compare/v0.18.0...v0.18.1) (2023-05-26)


### Bug Fixes

* open changelog in new tab ([5ab9fe4](https://github.com/rare-magma/guitos/commit/5ab9fe4ddfad653942363194c863cd8a97b54d45))

# [0.18.0](https://github.com/rare-magma/guitos/compare/v0.17.1...v0.18.0) (2023-05-26)


### Features

* add help buttons and link to repo ([68deb54](https://github.com/rare-magma/guitos/commit/68deb54895259ea1096c2b57b0520dbf32ff5c2a))

## [0.17.1](https://github.com/rare-magma/guitos/compare/v0.17.0...v0.17.1) (2023-05-22)


### Bug Fixes

* prevent exporting empty budget as json ([f88a91e](https://github.com/rare-magma/guitos/commit/f88a91e6c9fba05c9afbf22a61bda44a7da0b594))

# [0.17.0](https://github.com/rare-magma/guitos/compare/v0.16.6...v0.17.0) (2023-05-22)


### Features

* add export as CSV option ([07e8cb5](https://github.com/rare-magma/guitos/commit/07e8cb5c3b6caf8a8f46bc1c481c7285cd78234e)), closes [#40](https://github.com/rare-magma/guitos/issues/40)

## [0.16.6](https://github.com/rare-magma/guitos/compare/v0.16.5...v0.16.6) (2023-05-21)


### Bug Fixes

* add missing aria-labels ([c4ba3a9](https://github.com/rare-magma/guitos/commit/c4ba3a9d32b0892f2122fc5e555586cd8c52013b))
* unique id a11y issues ([eaa84cf](https://github.com/rare-magma/guitos/commit/eaa84cf0e4171ee3c5e583781f4cb908fca38331))

## [0.16.5](https://github.com/rare-magma/guitos/compare/v0.16.4...v0.16.5) (2023-05-21)


### Bug Fixes

* remove autofocus usage ([b9d68e7](https://github.com/rare-magma/guitos/commit/b9d68e780f7eb88eabc234633b742cf5cec59bdc))

## [0.16.4](https://github.com/rare-magma/guitos/compare/v0.16.3...v0.16.4) (2023-05-21)


### Bug Fixes

* close item popover on change accepted ([af72075](https://github.com/rare-magma/guitos/commit/af7207553bb57584213999d4b711ba9e9681ea6c))

## [0.16.3](https://github.com/rare-magma/guitos/compare/v0.16.2...v0.16.3) (2023-05-15)


### Bug Fixes

* focused value border color ([e217e9f](https://github.com/rare-magma/guitos/commit/e217e9f406d6cf76bfbfe1c2266aff2263af92e8))

## [0.16.2](https://github.com/rare-magma/guitos/compare/v0.16.1...v0.16.2) (2023-05-14)


### Reverts

* Revert "perf: reduce css size with purgecss plugin" ([1380375](https://github.com/rare-magma/guitos/commit/138037578b2b616ef7466c4a21c7303935a5cb34))

## [0.16.1](https://github.com/rare-magma/guitos/compare/v0.16.0...v0.16.1) (2023-05-14)


### Performance Improvements

* reduce css size with purgecss plugin ([b946134](https://github.com/rare-magma/guitos/commit/b9461342b0ba21a4a40ea4822db2e2b15b4f55cd))

# [0.16.0](https://github.com/rare-magma/guitos/compare/v0.15.1...v0.16.0) (2023-05-14)


### Features

* set up PWA and update checks ([cd0c317](https://github.com/rare-magma/guitos/commit/cd0c317015475bf78973ef9714d6e6ae642964f0))

## [0.15.1](https://github.com/rare-magma/guitos/compare/v0.15.0...v0.15.1) (2023-05-13)


### Bug Fixes

* close popover with click/tap outside of it ([e06899c](https://github.com/rare-magma/guitos/commit/e06899c8a4283e35f1d6e0b6d5e7c92ac967dc2c))

# [0.15.0](https://github.com/rare-magma/guitos/compare/v0.14.3...v0.15.0) (2023-05-13)


### Features

* improve consistency of border colors ([4b4f8cb](https://github.com/rare-magma/guitos/commit/4b4f8cbff0a6cb0879a8782f8cc93eb264843c10))

## [0.14.3](https://github.com/rare-magma/guitos/compare/v0.14.2...v0.14.3) (2023-05-11)


### Bug Fixes

* add branch name to publish job ([33e05df](https://github.com/rare-magma/guitos/commit/33e05df8618296d51a03898582d01bc0036b34df))

## [0.14.2](https://github.com/rare-magma/guitos/compare/v0.14.1...v0.14.2) (2023-05-11)


### Bug Fixes

* publish action directory ([88ab549](https://github.com/rare-magma/guitos/commit/88ab5494acff8b67ee3409b30e19147cd5e47517))

## [0.14.1](https://github.com/rare-magma/guitos/compare/v0.14.0...v0.14.1) (2023-05-11)


### Performance Improvements

* setup npm cache in gh actions ([cb2333d](https://github.com/rare-magma/guitos/commit/cb2333db4fa2daf7f991afa6fd1eabc041ccfb95))

# [0.14.0](https://github.com/rare-magma/guitos/compare/v0.13.0...v0.14.0) (2023-05-11)


### Features

* clean up design ([4641faa](https://github.com/rare-magma/guitos/commit/4641faaf9582577ce9d22d8082005067d230e336))

# [0.13.0](https://github.com/rare-magma/guitos/compare/v0.12.2...v0.13.0) (2023-05-11)


### Bug Fixes

* loading state not triggered on startup ([c719e71](https://github.com/rare-magma/guitos/commit/c719e715acafecb1194cf51a4d685c18dfe6a2b0))


### Features

* add delete confirmation buttons ([90cf696](https://github.com/rare-magma/guitos/commit/90cf6960d0cc0f44e2097919f6286affaab52c37))

## [0.12.2](https://github.com/rare-magma/guitos/compare/v0.12.1...v0.12.2) (2023-05-09)


### Bug Fixes

* error if locale didn't match country code ([ca74521](https://github.com/rare-magma/guitos/commit/ca745212063f65b5819d787f7a4b4312b2b29d57))

## [0.12.1](https://github.com/rare-magma/guitos/compare/v0.12.0...v0.12.1) (2023-05-09)


### Bug Fixes

* input with decimals doesn't work ([ea63d1f](https://github.com/rare-magma/guitos/commit/ea63d1f8e171fd41d5e4179ce35b3f93773d720c)), closes [#43](https://github.com/rare-magma/guitos/issues/43)

# [0.12.0](https://github.com/rare-magma/guitos/compare/v0.11.1...v0.12.0) (2023-05-08)


### Features

* add operation button for item value ([faeb092](https://github.com/rare-magma/guitos/commit/faeb09285cae42e19507b30a27e650a39fab32ae))
* focus item name upon adding new item in table ([3edbf06](https://github.com/rare-magma/guitos/commit/3edbf06b30bb2f173c37e32f37410957b2942d6f)), closes [#42](https://github.com/rare-magma/guitos/issues/42)

## [0.11.1](https://github.com/rare-magma/guitos/compare/v0.11.0...v0.11.1) (2023-05-07)


### Bug Fixes

* issue with reserves input ([72a71b6](https://github.com/rare-magma/guitos/commit/72a71b6c4b3983893df8a1cbe77ece925a9be9db))

# [0.11.0](https://github.com/rare-magma/guitos/compare/v0.10.0...v0.11.0) (2023-05-07)


### Features

* cleaner stats labels ([c3ff0a5](https://github.com/rare-magma/guitos/commit/c3ff0a5a83081c239037b7e7997f03d602c77196))

# [0.10.0](https://github.com/rare-magma/guitos/compare/v0.9.0...v0.10.0) (2023-05-06)


### Features

* add button for calculating savings goal automatically ([af6f7b9](https://github.com/rare-magma/guitos/commit/af6f7b9166e14823e94099ce9b46863c117cba7a))
* use big decimal for better precision on all calculations ([7235743](https://github.com/rare-magma/guitos/commit/723574356fff03ebe8044be7d05130fae736530b)), closes [#19](https://github.com/rare-magma/guitos/issues/19)

# [0.9.0](https://github.com/rare-magma/guitos/compare/v0.8.1...v0.9.0) (2023-05-06)


### Features

* add currency setting override option ([81e70b9](https://github.com/rare-magma/guitos/commit/81e70b9b18bba46d825ea99e4cd311a9414bddff)), closes [#39](https://github.com/rare-magma/guitos/issues/39)
* add shortcut to change currency setting ([5dac9b8](https://github.com/rare-magma/guitos/commit/5dac9b8a75ae79d91afafc1305638c92bae2dcab))

## [0.8.1](https://github.com/rare-magma/guitos/compare/v0.8.0...v0.8.1) (2023-05-04)


### Reverts

* Revert "feat: add button for calculating savings goal automatically" ([ddf4e98](https://github.com/rare-magma/guitos/commit/ddf4e98bc4b14571961a71616858778d6ed2a630))

# [0.8.0](https://github.com/rare-magma/guitos/compare/v0.7.1...v0.8.0) (2023-05-04)


### Features

* add button for calculating savings goal automatically ([9226c28](https://github.com/rare-magma/guitos/commit/9226c28262f42dee4f23125f6eb5f78015a8917b))

## [0.7.1](https://github.com/rare-magma/guitos/compare/v0.7.0...v0.7.1) (2023-05-03)


### Bug Fixes

* scrollbar flickering due to tooltip popup ([f536a30](https://github.com/rare-magma/guitos/commit/f536a3060768676400da369e6ce7667bb54bb694))

# [0.7.0](https://github.com/rare-magma/guitos/compare/v0.6.2...v0.7.0) (2023-05-03)


### Bug Fixes

* close menu on button click ([07a1d24](https://github.com/rare-magma/guitos/commit/07a1d247f2cdd7410c39391c5657baa1f27db07b))


### Features

* add tooltips to all buttons ([fa49d04](https://github.com/rare-magma/guitos/commit/fa49d04521541454092d1ac78a07036195755da8))
* show budget name on menu title ([b7cf2a3](https://github.com/rare-magma/guitos/commit/b7cf2a329818615331911169121626422f80ab03))

## [0.6.2](https://github.com/rare-magma/guitos/compare/v0.6.1...v0.6.2) (2023-05-02)


### Bug Fixes

* toggle and close menu buttons border color ([ed79760](https://github.com/rare-magma/guitos/commit/ed797608a0d58203ef80c947affcdbefda0bbba5))

## [0.6.1](https://github.com/rare-magma/guitos/compare/v0.6.0...v0.6.1) (2023-05-01)


### Bug Fixes

* csv import setting goal and reserves values as strings ([5fd4fba](https://github.com/rare-magma/guitos/commit/5fd4fba4618ec6f5e4bda03a7ab5cc4b5dd78e30))
* unique key warning thrown during import ([dea2087](https://github.com/rare-magma/guitos/commit/dea2087cd64a69f8f61b4dfe1e3e783e97f31d1c))

# [0.6.0](https://github.com/rare-magma/guitos/compare/v0.5.0...v0.6.0) (2023-04-30)


### Bug Fixes

* stats straight corners ([21c608d](https://github.com/rare-magma/guitos/commit/21c608d51f5a04a5d8dc321b6e8bf626fa66eded))
* wrong new item id if list of items went to 0 ([5e5d072](https://github.com/rare-magma/guitos/commit/5e5d0725406a8d0aaa3d75023ccaa15e1e84473f))


### Features

* add goal/reserves shortcuts ([7462a79](https://github.com/rare-magma/guitos/commit/7462a79621a3df2edd820651b3a3326bc482671d))

# [0.5.0](https://github.com/rare-magma/guitos/compare/v0.4.0...v0.5.0) (2023-04-30)


### Features

* add F to search shortcuts ([0b009f1](https://github.com/rare-magma/guitos/commit/0b009f130beaefaa8c3b0b66e4eeee5d4d3e7e26))
* add search/rename shortcuts ([05f854d](https://github.com/rare-magma/guitos/commit/05f854dc53ace0cc8ff0614cc35605f8cd05b00d))

# [0.4.0](https://github.com/rare-magma/guitos/compare/v0.3.1...v0.4.0) (2023-04-30)


### Bug Fixes

* remove modifier key from shortcuts ([3743fa4](https://github.com/rare-magma/guitos/commit/3743fa428d370b8c11d66d1dcb0a636fa3bd880a))
* rename download as export ([319fe90](https://github.com/rare-magma/guitos/commit/319fe90d0fa1dd9aa6ac1780657aec81a2144a8c))


### Features

* add keyboard shortcuts for clone, export and new actions ([180d715](https://github.com/rare-magma/guitos/commit/180d71547c3a06c1adc3ad098af2e84143d2bcd3))
* implement fw/bk buttons, handlers and shortcuts ([72f53c5](https://github.com/rare-magma/guitos/commit/72f53c560965edcc0e72381259aef8dd5f221f97)), closes [#17](https://github.com/rare-magma/guitos/issues/17)

## [0.3.1](https://github.com/rare-magma/guitos/compare/v0.3.0...v0.3.1) (2023-04-22)

### Bug Fixes

- semantic-release config ([f5d67ef](https://github.com/rare-magma/guitos/commit/f5d67ef2f743158184e8c70caf6063e5cac44070))

## [0.3.0](https://github.com/rare-magma/guitos/compare/v0.2.1...v0.3.0) (2023-04-22)

- Minor fixes related to fonts

## [0.2.1](https://github.com/rare-magma/guitos/compare/v0.2.0...v0.2.1) (2023-04-22)

- Minor fixes related to size of values and spacing

## [0.2.0] - 2023-04-20

- Display amounts in formatted currency based on browser locale

## [0.1.0] - 2023-04-19

- Initial release
