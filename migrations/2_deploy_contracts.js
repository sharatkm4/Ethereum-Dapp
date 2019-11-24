var CarMarketPlace = artifacts.require("CarMarketPlace.sol");
var Utils = artifacts.require("Utils.sol");
var SafeMathMock = artifacts.require("SafeMathMock.sol");

module.exports = function(deployer) {
	deployer.deploy(Utils);
	deployer.link(Utils, CarMarketPlace);
	deployer.deploy(CarMarketPlace);
	deployer.deploy(SafeMathMock);
};
