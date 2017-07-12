
Changelog
-------

**1.0.2**

- Removed `preferGlobal` from `package.json` (thanks to [@waynebloss](https://github.com/ivanakimov/hashids.node.js/issues/17))
- Moved out changelog to `CHANGELOG.md`

**1.0.1**

- Auto-initialize a new instance of Hashids in case it wasn't initialized with "new" (thanks to [@rfink](https://github.com/ivanakimov/hashids.node.js/pull/15))

**1.0.0**

- Several public functions are renamed to be more appropriate:
	- Function `encrypt()` changed to `encode()`
	- Function `decrypt()` changed to `decode()`
	- Function `encryptHex()` changed to `encodeHex()`
	- Function `decryptHex()` changed to `decodeHex()`
	
	Hashids was designed to encode integers, primary ids at most. We've had several requests to encrypt sensitive data with Hashids and this is the wrong algorithm for that. So to encourage more appropriate use, `encrypt/decrypt` is being "downgraded" to `encode/decode`.

- Version tag added: `1.0`
- `README.md` updated

**0.3.3**

- `.toString()` added in `encryptHex()`: [https://github.com/ivanakimov/hashids.node.js/pull/9](https://github.com/ivanakimov/hashids.node.js/pull/9) (thanks to [@namuol](https://github.com/namuol))

**0.3.2**

- minor: contact email changed
- minor: internal version is accurate now

**0.3.1**

- minor: closure + readme update merged (thanks to [@krunkosaurus](https://github.com/krunkosaurus))
- minor: a few cleanups

**0.3.0**

**PRODUCED HASHES IN THIS VERSION ARE DIFFERENT THAN IN 0.1.4, DO NOT UPDATE IF YOU NEED THEM TO KEEP WORKING:**

- Same algorithm as [PHP version](https://github.com/ivanakimov/hashids.php) now
- Overall approximately **4x** faster
- Consistent shuffle function uses slightly modified version of [Fisher–Yates algorithm](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm)
- Generate large hash strings faster (where _minHashLength_ is more than 1000 chars)
- When using _minHashLength_, hash character disorder has been improved
- Basic English curse words will now be avoided even with custom alphabet
- New unit tests with [Jasmine](https://github.com/mhevery/jasmine-node)
- Support for MongoDB ObjectId
- _encrypt_ function now also accepts array of integers as input
- Passing JSLint now

**0.1.4**

- Global var leak for hashSplit (thanks to [@BryanDonovan](https://github.com/BryanDonovan))
- Class capitalization (thanks to [@BryanDonovan](https://github.com/BryanDonovan))

**0.1.3**

	Warning: If you are using 0.1.2 or below, updating to this version will change your hashes.

- Updated default alphabet (thanks to [@speps](https://github.com/speps))
- Constructor removes duplicate characters for default alphabet as well (thanks to [@speps](https://github.com/speps))

**0.1.2**

	Warning: If you are using 0.1.1 or below, updating to this version will change your hashes.

- Minimum hash length can now be specified
- Added more randomness to hashes
- Added unit tests
- Added example files
- Changed warnings that can be thrown
- Renamed `encode/decode` to `encrypt/decrypt`
- Consistent shuffle does not depend on md5 anymore
- Speed improvements

**0.1.1**

- Speed improvements
- Bug fixes

**0.1.0**
	
- First commit
