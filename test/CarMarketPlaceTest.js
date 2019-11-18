const CarMarketPlace = artifacts.require("CarMarketPlace");

contract("CarMarketPlace", async accounts => {
	
	let firstAccount = accounts[0];
	let secondAccount = accounts[1]; //Seller 1	
	let thirdAccount = accounts[2]; //Seller 2
	let fourthAccount = accounts[3]; //Buyer 1
	let fifthAccount = accounts[4]; //Buyer 2
	
	let carMarketPlace;
	
	beforeEach(async () => {		
		carMarketPlace = await CarMarketPlace.new();
	});
	
	it("Sets an owner.", async () => {
		//let carMarketPlace = await CarMarketPlace.deployed();
		assert.equal(await carMarketPlace.owner.call(), firstAccount);
	});
	
	it("Initial cars for sale should be empty", async () => {
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(secondAccount), 0);
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(thirdAccount), 0);
	});	
	
	it("Should create a car which is sellable", async () => {
		await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,100000, {from: secondAccount});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(secondAccount), 1);
	});	
	
	/*it("Should throw an error when request is empty", async () => {
		try {
			await carMarketPlace.getNumberOfCarsForSale({from: secondAccount});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
	});*/	
	
	
	
});