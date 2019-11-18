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
		let tx = await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: secondAccount});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(secondAccount), 1);
		
		assert.equal(tx.receipt.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");
		
		const event = tx.logs[0].args;
		assert.equal(event.vin, 'V1', 'Vin is correct');
		assert.equal(event.make, 'Ford', 'Make is correct');
		assert.equal(event.model, 'Mustang', 'Model is correct');
		assert.equal(event.year.toNumber(), 2019, 'Year is correct');
		assert.equal(event.price, '1000000000000000000', 'Price is correct');
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