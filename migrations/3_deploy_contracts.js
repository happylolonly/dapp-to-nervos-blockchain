var MySimpleTodoContract = artifacts.require("./MySimpleTodoContract.sol");

module.exports = function (deployer) {
  deployer.deploy(MySimpleTodoContract);
};
