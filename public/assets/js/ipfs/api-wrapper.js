(function() {
  "use strict"

  /*
  |--------------------------------------------------------------------------
  | Configuration
  |--------------------------------------------------------------------------
  |
  | Used to general configuration
  |
  */
  var Config = {
      IPFS: {
        // host: "69.114.190.228",
        host: "ipfs.dnn.media",
        port: "5002",
        gateway: "//ipfs.io/ipfs/"
      }
  };

  /*
  |--------------------------------------------------------------------------
  | IPFS
  |--------------------------------------------------------------------------
  |
  | Used to decentralize DNN's data
  |
  */
  var IPFS = {};

  // Expose Config
  IPFS.config = Config.IPFS;

   // Connects to IPFS Node
   IPFS.connect = function() {
      return window.IpfsApi(Config.IPFS.host, Config.IPFS.port);
   };

   // Persist data to IPFS
   IPFS.store = function(data) {
       var that = this;
       return new Promise(function(resolve, reject) {
            var Buffer = window.IpfsApi().Buffer
           that.instance.add(new Buffer(JSON.stringify(data)))
              .then(function (files) {
                  resolve({files: files});
              })
              .catch(function(err) {
                  reject({error: err});
              })
        });
   };

   // Establish a connection with IPFS
   IPFS.instance = IPFS.connect();

   // Expose IPFS
   window.IPFS = IPFS;

})();
