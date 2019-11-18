const CarMarketPlace = artifacts.require("CarMarketPlace");

contract("CarMarketPlace", async accounts => {
	
	let firstAccount = accounts[0];
	let seller1 = accounts[1]; //Seller 1	
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
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(seller1), 0);
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(thirdAccount), 0);
	});	
	
	it("Should create a car for sale", async () => {
		//Success: Create car 1
		let tx = await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(seller1), 1);
		
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
	
	it("Should create muliple cars for sale", async () => {
		//Success: Create car 1
		let tx = await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(seller1), 1);
		
		assert.equal(tx.receipt.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");
		
		const event = tx.logs[0].args;
		assert.equal(event.vin, 'V1', 'Vin is correct');
		assert.equal(event.make, 'Ford', 'Make is correct');
		assert.equal(event.model, 'Mustang', 'Model is correct');
		assert.equal(event.year.toNumber(), 2019, 'Year is correct');
		assert.equal(event.price, '1000000000000000000', 'Price is correct');
		
		//Success: Create car 2
		let tx2 = await carMarketPlace.createCarForSale("V2","BMW","4 Series",2018,web3.utils.toWei('2', 'Ether'),{from: seller1});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(seller1), 2);
		
		assert.equal(tx2.receipt.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx2.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx2.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");
		
		const event2 = tx2.logs[0].args;
		assert.equal(event2.vin, 'V2', 'Vin is correct');
		assert.equal(event2.make, 'BMW', 'Make is correct');
		assert.equal(event2.model, '4 Series', 'Model is correct');
		assert.equal(event2.year.toNumber(), 2018, 'Year is correct');
		assert.equal(event2.price, '2000000000000000000', 'Price is correct');
		
	});
	
	
	it("Should not create a car for sale when data is invalid", async () => {
		try {
			//Vin is invalid
			await carMarketPlace.createCarForSale("","Ford","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
		
		try {
			//Make is invalid
			await carMarketPlace.createCarForSale("V1","","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
		
		try {
			//Model is invalid
			await carMarketPlace.createCarForSale("V1","Ford","",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
		
		try {
			//Year is invalid
			await carMarketPlace.createCarForSale("V1","Ford","Mustang",1999,web3.utils.toWei('1', 'Ether'),{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
		
		try {
			//Price is invalid
			await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,999,{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}		
		
	});
	
	it("Should not create a car for sale for duplicate car/vin", async () => {
		//Create car 1
		let tx = await carMarketPlace.createCarForSale("V1","Ford","Mustang",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
		assert.equal(await carMarketPlace.getNumberOfCarsForSale.call(seller1), 1);
		
		assert.equal(tx.receipt.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs.length, 1, "createCarForSale() call did not log 1 event");
		assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");
		
		const event = tx.logs[0].args;
		assert.equal(event.vin, 'V1', 'Vin is correct');
		assert.equal(event.make, 'Ford', 'Make is correct');
		assert.equal(event.model, 'Mustang', 'Model is correct');
		assert.equal(event.year.toNumber(), 2019, 'Year is correct');
		assert.equal(event.price, '1000000000000000000', 'Price is correct');
		
		// Failure when creating with the same vin
		try {
			//Vin is invalid
			await carMarketPlace.createCarForSale("V1","Ford","Escape",2019,web3.utils.toWei('1', 'Ether'),{from: seller1});
			assert.fail();
		} catch (err) {
			assert.ok(/revert/.test(err.message));
		}
		
		
	});
	
	
});