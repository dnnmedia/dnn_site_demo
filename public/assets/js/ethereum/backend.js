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
      RPC: {
         host: "69.114.190.228",
         port: "8545",
         use: false
      }
  };


  /*
  |--------------------------------------------------------------------------
  | Web3 Check
  |--------------------------------------------------------------------------
  |
  | Checks if browser is Web3 enabled
  |
  */
  window.isBrowserWeb3Enabled = function() {
      return (typeof web3 !== "undefined");
  };

  window.handleBrowserWeb3EnabledIfNeeded = function() {
    if (!isBrowserWeb3Enabled()) {
        window.location.href = "/onboard#!/noweb3"
        return false;
    }
    else return true;
  };
  /*
  |--------------------------------------------------------------------------
  | Application
  |--------------------------------------------------------------------------
  |
  | Initialize application upon load
  |
  */
   window["addEventListener"]('load', function() {

      if (isBrowserWeb3Enabled()) {

        /*
        |--------------------------------------------------------------------------
        | Contacts
        |--------------------------------------------------------------------------
        |
        |  Holds all contracts
        |
        */
        var backend = {};
        backend.contracts = {};
        backend.user = {};

        // Expose backend
        window.backend = backend;

        /*
        |--------------------------------------------------------------------------
        | EthJS Module
        |--------------------------------------------------------------------------
        |
        |  Used to send messages to client via RPC
        |
        */
        var Eth = require('ethjs');
        var eth = new Eth(Config.RPC.use ? (new web3.providers.HttpProvider("http://"+Config.RPC.host+":"+Config.RPC.port)) : web3.currentProvider );

        // Expose EthJS
        window.eth = eth;


        /*
        |--------------------------------------------------------------------------
        | Convenient Eth Methods
        |--------------------------------------------------------------------------
        |
        |  Holds convenient methods/alias pertaining to ethjs
        |
        */
        backend.eth = {};
        backend.eth.accounts = function() {
            return eth.accounts();
        };

        /*
        |--------------------------------------------------------------------------
        | Smart Contract: User
        |--------------------------------------------------------------------------
        |
        |  Used to associate user details stored in IPFS with the
        |  ethereum account address
        |
        */
        backend.contracts.UserContractAbi = [{"constant":false,"inputs":[{"name":"id","type":"uint32"}],"name":"updateUserId","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"retrieveUserType","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"retrieveUserData","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"string"}],"name":"updateUserData","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newType","type":"uint8"}],"name":"updateUserType","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"retrieveUserId","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"}];
        backend.contracts.UserContractAddress = '0xaF869bc32aF06B48a46db9ac592b09F478Db0B94';
        backend.contracts.UserContract = eth.contract(backend.contracts.UserContractAbi).at(backend.contracts.UserContractAddress);


        /*
        |--------------------------------------------------------------------------
        | Smart Contract: DNN Token
        |--------------------------------------------------------------------------
        |
        |  DNN's EC20 Constract. Used to keep track of DNN Token balances, and
        |  execute transfers.
        |
        */
        backend.contracts.DNNTokenAbi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
        backend.contracts.DNNTokenAddress = '0x5c29BAa425a7E9B394B8534D085B262C2d93917E';
        backend.contracts.DNNTokenContract = eth.contract(backend.contracts.DNNTokenAbi).at(backend.contracts.DNNTokenAddress);


        /*
        |--------------------------------------------------------------------------
        | Smart Contract: ReviewProcess
        |--------------------------------------------------------------------------
        |
        |  Handles all actions involving the review process
        |
        */
        backend.contracts.ReviewProcessContractAbi = [{"constant":false,"inputs":[{"name":"articleIpfsHash","type":"string"}],"name":"submitArticleForReview","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"articleId","type":"bytes32"}],"name":"checkForExpiration","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"articleIpfsHash","type":"string"},{"name":"collateralAmount","type":"uint32"}],"name":"askToVote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"articleIpfsHash","type":"string"},{"name":"personalVote","type":"uint8"},{"name":"poolVote","type":"uint8"},{"name":"feedbackIpfsHash","type":"string"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"articleId","type":"bytes32"},{"indexed":false,"name":"articleIpfsHash","type":"string"}],"name":"ArticleSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"articleId","type":"bytes32"},{"indexed":false,"name":"articleIpfsHash","type":"string"}],"name":"VotingStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"articleId","type":"bytes32"},{"indexed":false,"name":"articleIpfsHash","type":"string"}],"name":"ArticleAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"articleId","type":"bytes32"},{"indexed":false,"name":"articleIpfsHash","type":"string"}],"name":"ArticleRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"articleId","type":"bytes32"}],"name":"VotingPeriodExpired","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"BroadcastMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toAddress","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"reason","type":"string"}],"name":"SendTokens","type":"event"}];
        backend.contracts.ReviewProcessContractAddress = '0x4fdE337827f9b103592Eca051B8d90700d7Ea6a7';
        backend.contracts.ReviewProcessContract = eth.contract(backend.contracts.ReviewProcessContractAbi).at(backend.contracts.ReviewProcessContractAddress);


      }

    });


})();
