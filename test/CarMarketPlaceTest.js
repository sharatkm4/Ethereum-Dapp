const CarMarketPlace = artifacts.require("CarMarketPlace");

contract("CarMarketPlace", async accounts => {
	
	let firstAccount = accounts[0];
	
	it("Sets an owner", async () => {
		let carMarketPlace = await CarMarketPlace.deployed();
		assert.equal(await carMarketPlace.owner.call(), firstAccount);
	});
	
});