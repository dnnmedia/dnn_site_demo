
Hashids
-------

A small Node.js class to generate YouTube-like ids from one or many numbers. Use hashids when you do not want to expose your database ids to the user. Read **full documentation** at: [http://hashids.org/node-js](http://hashids.org/node-js)

[![hashids](https://api.travis-ci.org/ivanakimov/hashids.node.js.svg "Hashids")](https://travis-ci.org/ivanakimov/hashids.node.js)

Installation
-------

1. Node it up: [http://nodejs.org/download/](http://nodejs.org/download/)
2. Install using npm:
	
	`npm install hashids`
	
Updating from v0.3 to 1.0?
-------

Read the `CHANGELOG` at the bottom of this readme!

Client-side Version
-------

If you're looking for a client-side Bower version, there's a separate repo: <https://github.com/ivanakimov/hashids.js/>

Production Note
-------

**BE CAREFUL WHICH VERSION OF HASHIDS YOU ARE USING.**

Since future improvements to Hashids might alter produced hashes, it's a good idea to specify *exact* Hashids version in your **package.json**, if their consistency is important to you (if you are storing them in database):

```javascript
	
	"dependencies": {
		"hashids": "1.0.1"
	}
```

Usage
-------

#### Encoding one number

You can pass a unique salt value so your ids differ from everyone else's. I use "this is my salt" as an example.

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(12345);
```

`id` is now going to be:
	
	NkK9

#### Decoding

Notice during decoding, same salt value is used:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decode("NkK9");
```

`numbers` is now going to be:
	
	[ 12345 ]

#### Decoding with different salt

Decoding will not work if salt is changed:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my pepper");

var numbers = hashids.decode("NkK9");
```

`numbers` is now going to be:
	
	[]
	
#### Encoding several numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(683, 94108, 123, 5);
```

`id` is now going to be:
	
	aBMswoO2UB3Sj
	
You can also pass an array:

```javascript

var arr = [683, 94108, 123, 5];
var id = hashids.encode(arr);
```

#### Decoding is done the same way

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var numbers = hashids.decode("aBMswoO2UB3Sj");
```

`numbers` is now going to be:
	
	[ 683, 94108, 123, 5 ]
	
#### Encoding and specifying minimum id length

Here we encode integer 1, and set the **minimum** id length to **8** (by default it's **0** -- meaning ids will be the shortest possible length).

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var id = hashids.encode(1);
```

`id` is now going to be:
	
	gB0NV05e
	
#### Decoding

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 8);

var numbers = hashids.decode("gB0NV05e");
```

`numbers` is now going to be:
	
	[ 1 ]
	
#### Specifying custom id alphabet

Here we set the alphabet to consist of valid hex characters: "0123456789abcdef"

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt", 0, "0123456789abcdef");

var id = hashids.encode(1234567);
```

`id` is now going to be:
	
	b332db5
	
MongoDB Support
-------

MongoDB uses hex strings for their ObjectIds. You can convert them to Hashids like this:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encodeHex("507f191e810c19729de860ea");
var objectId = hashids.decodeHex(id);
```

`id` will be:
	
	yNyaoWeKWVINWqvaM9bw
	
`objectId` will be as expected:
	
	507f191e810c19729de860ea
	
The length of the hex string does not matter -- it does not have to be a MongoDB ObjectId.
	
Randomness
-------

The primary purpose of hashids is to obfuscate ids. It's not meant or tested to be used for security purposes or compression.
Having said that, this algorithm does try to make these hashes unguessable and unpredictable:

#### Repeating numbers

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(5, 5, 5, 5);
```

You don't see any repeating patterns that might show there's 4 identical numbers in the id:

	1Wc8cwcE

Same with incremented numbers:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id = hashids.encode(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

`id` will be :
	
	kRHnurhptKcjIDTWC3sx
	
#### Incrementing number ids:

```javascript

var Hashids = require("hashids"),
	hashids = new Hashids("this is my salt");

var id1 = hashids.encode(1), /* NV */
	id2 = hashids.encode(2), /* 6m */
	id3 = hashids.encode(3), /* yD */
	id4 = hashids.encode(4), /* 2l */
	id5 = hashids.encode(5); /* rD */
```

Curses! #$%@
-------

This code was written with the intent of placing created hashes in visible places - like the URL. Which makes it unfortunate if generated hashes accidentally formed a bad word.

Therefore, the algorithm tries to avoid generating most common English curse words. This is done by never placing the following letters next to each other:
	
	c, C, s, S, f, F, h, H, u, U, i, I, t, T

Running tests
-------
Hashids uses [jasmine](http://pivotal.github.io/jasmine/) spec tests, particularly [jasmine-node](https://npmjs.org/package/jasmine-node).

To install `sudo npm install -g jasmine-node`
then just run `jasmine-node .` in the root folder.

Contact
-------

Follow me [@IvanAkimov](http://twitter.com/ivanakimov)

Or [http://ivanakimov.com](http://ivanakimov.com)

License
-------

MIT License. See the `LICENSE` file. You can use Hashids in open source projects and commercial products. Don't break the Internet. Kthxbye.
