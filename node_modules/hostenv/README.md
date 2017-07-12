
<!-- TITLE/ -->

# hostenv

<!-- /TITLE -->


<!-- BADGES/ -->

[![NPM version](https://img.shields.io/npm/v/hostenv.svg)](https://npmjs.org/package/hostenv "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/hostenv.svg)](https://npmjs.org/package/hostenv "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/hostenv.svg)](https://david-dm.org/bevry/hostenv)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/hostenv.svg)](https://david-dm.org/bevry/hostenv#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://bevry.me/bitcoin "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://bevry.me/wishlist "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Exports the correct PORT and HOSTNAME values for Heroku, AppFog, CloudFoundry, OpenShift, and other service environments

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('hostenv')`
- Install: `npm install --save hostenv`

### [Browserify](http://browserify.org/)
- Use: `require('hostenv')`
- Install: `npm install --save hostenv`
- CDN URL: `//wzrd.in/bundle/hostenv@1.0.1`

### [Ender](http://enderjs.com)
- Use: `require('hostenv')`
- Install: `ender add hostenv`

<!-- /INSTALL -->


## Usage

``` javascript
const hostenv = require('hostenv')
const PORT = hostenv.PORT || 8080
const HOSTNAME = hostenv.HOSTNAME || '0.0.0.0'
```

<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/hostenv/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/hostenv/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://bevry.me/bitcoin "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://bevry.me/wishlist "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/hostenv/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/hostenv/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; 2015+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->


