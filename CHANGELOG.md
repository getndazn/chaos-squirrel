# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.9.1 (2020-10-05)

**Note:** Version bump only for package @dazn/chaos-squirrel





# [0.9.0](https://github.com/getndazn/chaos-squirrel/compare/v0.8.0...v0.9.0) (2020-08-25)


### Features

* **runner-middy:** allow creating a custom logger for each context ([406ccf1](https://github.com/getndazn/chaos-squirrel/commit/406ccf1fbbe69c9bae48261c324ebc25368e3ac2))





# [0.8.0](https://github.com/getndazn/chaos-squirrel/compare/v0.7.0...v0.8.0) (2020-08-24)


### Features

* switch to using ES6 exports instead of CommonJS style ([3639a5d](https://github.com/getndazn/chaos-squirrel/commit/3639a5da2c43b4f1a304e33b66349ab3fb4ee90d))


### BREAKING CHANGES

* will break all require calls





# [0.7.0](https://github.com/getndazn/chaos-squirrel/compare/v0.6.0...v0.7.0) (2020-08-24)


### Features

* **runner:** allow defining a logger ([3188119](https://github.com/getndazn/chaos-squirrel/commit/3188119dad41fb0804b1bf6e5d201a40c044f51b))





# [0.6.0](https://github.com/getndazn/chaos-squirrel/compare/v0.5.0...v0.6.0) (2020-08-14)


### Features

* **runner:** choose which attack to run based on weighting ([9760a44](https://github.com/getndazn/chaos-squirrel/commit/9760a44506fcea3b16a0d376d004a4bbbce5fd8a))


### BREAKING CHANGES

* **runner:** possibleAttack.probability removed in favour of possibleAttack.weight





# [0.5.0](https://github.com/getndazn/chaos-squirrel/compare/v0.4.0...v0.5.0) (2020-08-14)


### Features

* **runner-middy:** add runner for easy usage with middy ([f76d169](https://github.com/getndazn/chaos-squirrel/commit/f76d169d03fd844dc5cc935fd44d483986d67250))





# [0.4.0](https://github.com/getndazn/chaos-squirrel/compare/v0.3.0...v0.4.0) (2020-08-14)


### Features

* **attack-disk-space:** create disk space attack ([f3e9a75](https://github.com/getndazn/chaos-squirrel/commit/f3e9a75cdb25d736515193bac56b16d2c099a6e8))
* **attack-disk-space:** optimise for the os blksize, big perf improvement ([8bd7f96](https://github.com/getndazn/chaos-squirrel/commit/8bd7f96a8f4e0c07715d4a1c525d7243255d69a6))





# [0.3.0](https://github.com/getndazn/chaos-squirrel/compare/v0.2.0...v0.3.0) (2020-08-14)


### Bug Fixes

* update to 2.0 ([3d008d4](https://github.com/getndazn/chaos-squirrel/commit/3d008d465042bf91d6874d012e121be6f26279a8))


### Features

* **attack-memory:** new memory attack ([d8b6334](https://github.com/getndazn/chaos-squirrel/commit/d8b6334887321928b9015711abbb00756c8d3aa1))
* **attack-memory-background:** add background memory attack ([9000e81](https://github.com/getndazn/chaos-squirrel/commit/9000e81d0d766b3d95fa3914294ede6d45e30186))





# [0.2.0](https://github.com/getndazn/chaos-squirrel/compare/v0.1.0...v0.2.0) (2020-08-07)


### Bug Fixes

* **attack-cpu-background:** missed rename ([53e9d6c](https://github.com/getndazn/chaos-squirrel/commit/53e9d6c5bcf8e6256b27a26b3cfed2418ec461d3))


### Features

* convert attacks to be OO instead of functional ([acce40c](https://github.com/getndazn/chaos-squirrel/commit/acce40c8d1ca4e3283290f74cf99fc3d49b8dfee))
* update runner to be OO, add helper configure methods ([808b220](https://github.com/getndazn/chaos-squirrel/commit/808b220d5945a1fc90d019b21be04e226b92ea27))
* working runner module to select and start attacks ([1e7a42c](https://github.com/getndazn/chaos-squirrel/commit/1e7a42caa1e0cfc9b43bdc6d207b0c32ab7c319f))
* **runner:** first-pass at runner module ([f2ce515](https://github.com/getndazn/chaos-squirrel/commit/f2ce51508fddebfb8cbd584b48c4991e05c56a93))


### BREAKING CHANGES

* runner interface has changed
* all attack interfaces changed
* switched exports to use esModuleInterop style





# 0.1.0 (2020-07-20)


### Features

* **open-files:** add open files attack ([ed982b7](https://github.com/getndazn/chaos-squirrel/commit/ed982b7612073018742a5276756267e5e6a8f025))
* add a background CPU attack ([1994322](https://github.com/getndazn/chaos-squirrel/commit/199432262a26773932ac461a572cf7feb1a9d959))
* init and basic CPU attack ([d825138](https://github.com/getndazn/chaos-squirrel/commit/d8251384715dcf8c561f8bc85aaafcb15559609a))
