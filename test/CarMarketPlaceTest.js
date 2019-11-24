const CarMarketPlace = artifacts.require("CarMarketPlace");
const BN = web3.utils.BN;

contract("CarMarketPlace", async accounts => {
	
	let contractOwner = accounts[0]; //ContractOwner
	let seller1 = accounts[1]; //Seller 1	
	let seller2 = accounts[2]; //Seller 2
	let seller3 = accounts[3]; //Seller 3
	let buyer1 = accounts[4]; //Buyer 1
	let buyer2 = accounts[5]; //Buyer 2
	let buyer3 = accounts[6]; //Buyer 3
	const MAX_UINT256 = new BN('2').pow(new BN('256')).sub(new BN('1'));
	
	
	let carMarketPlace;
	let carMarketPlaceBalance;
	
	beforeEach(async () => {
		//Create new contract
		carMarketPlace = await CarMarketPlace.new();		
	});
	
	/*it('adds correctly with overflow', async function () {
			//console.log(MAX_UINT256);		
			assert.equal(await carMarketPlace.buyCarFromSeller2.call(2,3), 5);
					
			try {			
				let tx = await carMarketPlace.buyCarFromSeller2.call(MAX_UINT256,1);
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
	});*/
	
	describe('Selling Car', async () => {
		it("Sets an owner.", async () => {
			//let carMarketPlace = await CarMarketPlace.deployed();
			assert.equal(await carMarketPlace.contractOwner.call(), contractOwner);
		});
		
		it("Initial cars for sale should be empty", async () => {
			assert.equal(await carMarketPlace.carCount.call(), 0);
		});	
		
		it("Should successfuly create a car for sale", async () => {
			//Success: Create car 1
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			//Count should be 1
			assert.equal(await carMarketPlace.carCount.call(), 1);
			//Unique VIN map for Car 1 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V1'), true);
			
			//Validate Car 1 
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(car.purchased, false, 'Purchased is false');
					
			//Validate event for Car 1
			//assert.equal(tx.receipt.logs.length, 1, "createCarForSale() call did not log 1 event");
			assert.equal(tx.logs.length, 1, "createCarForSale() call did not log 1 event");
			assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event = tx.logs[0].args;
			assert.equal(event.carId, '1', 'CarId is correct');
			assert.equal(event.vin, 'V1', 'VIN is correct');
			assert.equal(event.price, '1000000000000000000', 'Price is correct');
			//assert.equal(event.year.toNumber(), 2019, 'Year is correct');
			assert.equal(event.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(event.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(event.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(event.purchased, false, 'Purchased is false');			
			
		});
		
		it("Should successfuly create muliple cars from same seller", async () => {
			//Success: Create car 1 and car 2
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			let tx2 = await carMarketPlace.createCarForSale("V2",web3.utils.toWei('2', 'Ether'),"carInfo2_IpfsHash","image2_IpfsHash",{from: seller1});
			
			//Count should be 2
			assert.equal(await carMarketPlace.carCount.call(), 2);
			//Unique VIN map for Car 1 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V1'), true);
			//Unique VIN map for Car 2 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V2'), true);
			
			//Validate Car 1 
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(car.purchased, false, 'Purchased is false');
			
			//Validate Car 2
			let car2 = await carMarketPlace.carsMap.call(2);
			assert.equal(car2.id, '2', 'CarId is correct');
			assert.equal(car2.vin, 'V2', 'VIN is correct');
			assert.equal(car2.price, '2000000000000000000', 'Price is correct');
			assert.equal(car2.carInfoIpfsHash, 'carInfo2_IpfsHash', 'CarInfo2_IpfsHash is correct');
			assert.equal(car2.imageIpfsHash, 'image2_IpfsHash', 'image2_IpfsHash is correct');
			assert.equal(car2.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(car2.purchased, false, 'Purchased is false');
			
			//Validate event for Car 1
			assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event = tx.logs[0].args;
			assert.equal(event.carId, '1', 'CarId is correct');
			assert.equal(event.vin, 'V1', 'VIN is correct');
			assert.equal(event.price, '1000000000000000000', 'Price is correct');		
			assert.equal(event.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(event.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(event.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(event.purchased, false, 'Purchased is false');
			
			//Validate event for Car 2
			assert.equal(tx2.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event2 = tx2.logs[0].args;
			assert.equal(event2.carId, '2', 'CarId is correct');
			assert.equal(event2.vin, 'V2', 'VIN is correct');
			assert.equal(event2.price, '2000000000000000000', 'Price is correct');		
			assert.equal(event2.carInfoIpfsHash, 'carInfo2_IpfsHash', 'CarInfo2_IpfsHash is correct');
			assert.equal(event2.imageIpfsHash, 'image2_IpfsHash', 'image2_IpfsHash is correct');
			assert.equal(event2.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(event2.purchased, false, 'Purchased is false');
			
		});
		
		it("Should successfuly create cars from different sellers", async () => {
			//Success: Create car 1 from seller 1
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			//Success: Create car 2 from seller 2
			let tx2 = await carMarketPlace.createCarForSale("V2",web3.utils.toWei('2', 'Ether'),"carInfo2_IpfsHash","image2_IpfsHash",{from: seller2});
			//Success: Create car 3 from seller 3
			let tx3 = await carMarketPlace.createCarForSale("V3",web3.utils.toWei('3', 'Ether'),"carInfo3_IpfsHash","image3_IpfsHash",{from: seller3});
			
			//Count should be 3
			assert.equal(await carMarketPlace.carCount.call(), 3);
			//Unique VIN map for Car 1 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V1'), true);
			//Unique VIN map for Car 2 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V2'), true);
			//Unique VIN map for Car 3 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V3'), true);
			
			//Validate Car 1 
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			//Seller 1
			assert.equal(car.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(car.purchased, false, 'Purchased is false');
			
			//Validate Car 2
			let car2 = await carMarketPlace.carsMap.call(2);
			assert.equal(car2.id, '2', 'CarId is correct');
			assert.equal(car2.vin, 'V2', 'VIN is correct');
			assert.equal(car2.price, '2000000000000000000', 'Price is correct');
			assert.equal(car2.carInfoIpfsHash, 'carInfo2_IpfsHash', 'CarInfo2_IpfsHash is correct');
			assert.equal(car2.imageIpfsHash, 'image2_IpfsHash', 'image2_IpfsHash is correct');
			//Seller 2
			assert.equal(car2.owner, seller2, 'Car owner/Seller is correct');
			assert.equal(car2.purchased, false, 'Purchased is false');
			
			//Validate Car 3
			let car3 = await carMarketPlace.carsMap.call(3);
			assert.equal(car3.id, '3', 'CarId is correct');
			assert.equal(car3.vin, 'V3', 'VIN is correct');
			assert.equal(car3.price, '3000000000000000000', 'Price is correct');
			assert.equal(car3.carInfoIpfsHash, 'carInfo3_IpfsHash', 'CarInfo3_IpfsHash is correct');
			assert.equal(car3.imageIpfsHash, 'image3_IpfsHash', 'image3_IpfsHash is correct');
			//Seller 3
			assert.equal(car3.owner, seller3, 'Car owner/Seller is correct');
			assert.equal(car3.purchased, false, 'Purchased is false');
			
			//Validate event for Car 1
			assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event = tx.logs[0].args;
			assert.equal(event.carId, '1', 'CarId is correct');
			assert.equal(event.vin, 'V1', 'VIN is correct');
			assert.equal(event.price, '1000000000000000000', 'Price is correct');		
			assert.equal(event.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(event.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(event.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(event.purchased, false, 'Purchased is false');
			
			//Validate event for Car 2
			assert.equal(tx2.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event2 = tx2.logs[0].args;
			assert.equal(event2.carId, '2', 'CarId is correct');
			assert.equal(event2.vin, 'V2', 'VIN is correct');
			assert.equal(event2.price, '2000000000000000000', 'Price is correct');		
			assert.equal(event2.carInfoIpfsHash, 'carInfo2_IpfsHash', 'CarInfo2_IpfsHash is correct');
			assert.equal(event2.imageIpfsHash, 'image2_IpfsHash', 'image2_IpfsHash is correct');
			assert.equal(event2.owner, seller2, 'Car owner/Seller is correct');
			assert.equal(event2.purchased, false, 'Purchased is false');
			
			//Validate event for Car 3
			assert.equal(tx3.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event3 = tx3.logs[0].args;
			assert.equal(event3.carId, '3', 'CarId is correct');
			assert.equal(event3.vin, 'V3', 'VIN is correct');
			assert.equal(event3.price, '3000000000000000000', 'Price is correct');		
			assert.equal(event3.carInfoIpfsHash, 'carInfo3_IpfsHash', 'CarInfo3_IpfsHash is correct');
			assert.equal(event3.imageIpfsHash, 'image3_IpfsHash', 'image3_IpfsHash is correct');
			assert.equal(event3.owner, seller3, 'Car owner/Seller is correct');
			assert.equal(event3.purchased, false, 'Purchased is false');
			
		});
		
		it("Should not create a car for sale when data is invalid", async () => {
			try {
				//Vin is invalid			
				let tx = await carMarketPlace.createCarForSale("",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
			
			try {
				//Price is invalid
				let tx = await carMarketPlace.createCarForSale("V1",9999,"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
			
			try {
				//carInfoIpfsHash is invalid
				let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"","image1_IpfsHash",{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}		
			
			try {
				//imageIpfsHash is invalid
				let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","",{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}		
			
		});
		
		it("Should not create a car for sale for duplicate car/vin", async () => {
			//Success: Create car 1
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			//Count should be 1
			assert.equal(await carMarketPlace.carCount.call(), 1);
			//Unique VIN map for Car 1 should be true
			assert.equal(await carMarketPlace.uniqueVinMap.call('V1'), true);
			
			//Validate Car 1 
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(car.purchased, false, 'Purchased is false');
					
			//Validate event for Car 1
			assert.equal(tx.logs[0].event, "CarOnSale", "createCarForSale() call did not log event CarOnSale");		
			const event = tx.logs[0].args;
			assert.equal(event.carId, '1', 'CarId is correct');
			assert.equal(event.vin, 'V1', 'VIN is correct');
			assert.equal(event.price, '1000000000000000000', 'Price is correct');
			assert.equal(event.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(event.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(event.owner, seller1, 'Car owner/Seller is correct');
			assert.equal(event.purchased, false, 'Purchased is false');	
			
			// Failure when creating with the same vin
			try {
				// VIN or Car already exists
				await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}		
			
		});
	});
	
	describe('Buying Car', async () => {
		it("Should throw error when invalid ID is used to buy car", async () => {
			// Seller 1 creates car for sale
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			try {
				//ID is zero (invalid) and should throw error
				tx = await carMarketPlace.buyCarFromSeller(0,{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
			
			try {
				//ID is more than car count (invalid) and should throw error
				tx = await carMarketPlace.buyCarFromSeller(2,{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
			
			//Do we need this to test ?
			//tx = await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('1', 'Ether')});	
			
		});
		
		it("Should throw error when seller is trying to buy the car.", async () => {
			// Seller 1 creates car for sale		
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			try {
				//Seller1 is buying the car which is invalid and should throw error
				tx = await carMarketPlace.buyCarFromSeller(1,{from: seller1});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}			
			
		});
		
		it("Should throw error when buyer sends lesser value of the car price.", async () => {	
			// Seller 1 creates car for sale		
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			try {
				//Price is low compared to the actual price of the car and should throw error
				tx = await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('0.5', 'Ether')});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}			
		});
		
		it("Should throw error when buyer does not have enough balance to purchase the car.", async () => {
			// Seller 1 creates car for sale
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('101', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			//let buyer1Balance;
			//buyer1Balance = await web3.eth.getBalance(buyer1);
			//buyer1Balance = new web3.utils.BN(buyer1Balance)
			//console.log('buyer1Balance-> ', buyer1Balance);
						
			try {
				//Buyer1 does not have enough balance and should throw error
				tx = await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('101', 'Ether')});				
				//assert.fail();
			} catch (err) {								
				assert.equal(err.reason, "Buyer does not have enough balance to purchase the car !!");				
			}			
			
		});
		
		it("Should throw error when car is already purchased.", async () => {		
			//Seller 1 creates car for sale			
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			//Buyer 1 buys car from seller
			await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('1', 'Ether')});			
			
			//Validate the car bought
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, buyer1, 'Car buyer is correct');
			assert.equal(car.purchased, true, 'Purchased is true');
			
			try {
				//Buyer 2 is buying the same car and should throw error.
				await carMarketPlace.buyCarFromSeller(1,{from: buyer2, value: web3.utils.toWei('1.1', 'Ether')});
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}			
		});
		
		
		it("Should successfuly transfer the ownership and update car as purchased", async () => {
			//Seller 1 creates car for sale			
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			//Buyer 1 buys car from seller
			await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('1', 'Ether')});			
			
			//Validate the car bought
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, buyer1, 'Car buyer is correct');
			assert.equal(car.purchased, true, 'Purchased is true');
			
		});
		
		it("Should successfuly transfer 95% of price to seller and 5% to smart contract when car is purchased", async () => {		
		
			//Seller 1 creates car for sale	
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			// Seller balance before purchase
			let seller1BalanceBeforePurchase = await web3.eth.getBalance(seller1);
			//console.log('seller1BalanceBeforePurchase-> ', seller1BalanceBeforePurchase); 
			seller1BalanceBeforePurchase = new web3.utils.BN(seller1BalanceBeforePurchase);
			
			// Contract balance before purchase
			let contractBalanceBeforePurchase = await web3.eth.getBalance(carMarketPlace.address);
			//console.log('contractBalanceBeforePurchase-> ', contractBalanceBeforePurchase);
			contractBalanceBeforePurchase = new web3.utils.BN(contractBalanceBeforePurchase);
			
			//Buyer 1 buys car from seller
			await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('1', 'Ether')});
						
			//Validate the car bought
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, buyer1, 'Car buyer is correct');
			assert.equal(car.purchased, true, 'Purchased is true');			
			
			// Seller balance after purchase
			let seller1BalanceAfterPurchase = await web3.eth.getBalance(seller1);
			//console.log('seller1BalanceAfterPurchase-> ', seller1BalanceAfterPurchase); 
			seller1BalanceAfterPurchase = new web3.utils.BN(seller1BalanceAfterPurchase);
			
			// Contract balance after purchase
			let contractBalanceAfterPurchase = await web3.eth.getBalance(carMarketPlace.address);
			//console.log('contractBalanceAfterPurchase-> ', contractBalanceAfterPurchase);
			contractBalanceAfterPurchase = new web3.utils.BN(contractBalanceAfterPurchase);
			
			//95% of the money goes to seller
			//let price = new web3.utils.BN(950000000000000000); 
			let amountToSeller = web3.utils.toWei('0.95', 'Ether');
			amountToSeller = new web3.utils.BN(amountToSeller);
			
			//New seller balance should be old balance plus 95% of the price paid by buyer
			const expectedSellerBalance = seller1BalanceBeforePurchase.add(amountToSeller);
			//Seller Balance should match after adding
			assert.equal(seller1BalanceAfterPurchase.toString(), expectedSellerBalance.toString());	

			//5% of the money goes to smart contract			
			let amountToSmartContract = web3.utils.toWei('0.05', 'Ether');
			amountToSmartContract = new web3.utils.BN(amountToSmartContract);
					
			//New seller balance should be old balance plus 95% of the price paid by buyer
			const exepectedSmartContractBalance = contractBalanceBeforePurchase.add(amountToSmartContract);
			//Smart contract Balance should match after adding
			assert.equal(contractBalanceAfterPurchase.toString(), exepectedSmartContractBalance.toString());		
			
		});
		
		it("Should successfuly generate events when car is purchased", async () => {		
		
			//Seller 1 creates car for sale	
			let tx = await carMarketPlace.createCarForSale("V1",web3.utils.toWei('1', 'Ether'),"carInfo1_IpfsHash","image1_IpfsHash",{from: seller1});
			
			// Seller balance before purchase
			let seller1BalanceBeforePurchase = await web3.eth.getBalance(seller1);
			//console.log('seller1BalanceBeforePurchase-> ', seller1BalanceBeforePurchase); 
			seller1BalanceBeforePurchase = new web3.utils.BN(seller1BalanceBeforePurchase);
			
			// Contract balance before purchase
			let contractBalanceBeforePurchase = await web3.eth.getBalance(carMarketPlace.address);
			//console.log('contractBalanceBeforePurchase-> ', contractBalanceBeforePurchase);
			contractBalanceBeforePurchase = new web3.utils.BN(contractBalanceBeforePurchase);
			
			//Buyer 1 buys car from seller
			tx = await carMarketPlace.buyCarFromSeller(1,{from: buyer1, value: web3.utils.toWei('1', 'Ether')});
						
			//Validate the car bought
			let car = await carMarketPlace.carsMap.call(1);
			assert.equal(car.id, '1', 'CarId is correct');
			assert.equal(car.vin, 'V1', 'VIN is correct');
			assert.equal(car.price, '1000000000000000000', 'Price is correct');
			assert.equal(car.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(car.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(car.owner, buyer1, 'Car buyer is correct');
			assert.equal(car.purchased, true, 'Purchased is true');			
			
			// Seller balance after purchase
			let seller1BalanceAfterPurchase = await web3.eth.getBalance(seller1);
			//console.log('seller1BalanceAfterPurchase-> ', seller1BalanceAfterPurchase); 
			seller1BalanceAfterPurchase = new web3.utils.BN(seller1BalanceAfterPurchase);
			
			// Contract balance after purchase
			let contractBalanceAfterPurchase = await web3.eth.getBalance(carMarketPlace.address);
			//console.log('contractBalanceAfterPurchase-> ', contractBalanceAfterPurchase);
			contractBalanceAfterPurchase = new web3.utils.BN(contractBalanceAfterPurchase);
			
			//95% of the money goes to seller
			//let price = new web3.utils.BN(950000000000000000); 
			let amountToSeller = web3.utils.toWei('0.95', 'Ether');
			amountToSeller = new web3.utils.BN(amountToSeller);
			
			//New seller balance should be old balance plus 95% of the price paid by buyer
			const expectedSellerBalance = seller1BalanceBeforePurchase.add(amountToSeller);
			//Seller Balance should match after adding
			assert.equal(seller1BalanceAfterPurchase.toString(), expectedSellerBalance.toString());	

			//5% of the money goes to smart contract			
			let amountToSmartContract = web3.utils.toWei('0.05', 'Ether');
			amountToSmartContract = new web3.utils.BN(amountToSmartContract);
					
			//New seller balance should be old balance plus 95% of the price paid by buyer
			const exepectedSmartContractBalance = contractBalanceBeforePurchase.add(amountToSmartContract);
			//Smart contract Balance should match after adding
			assert.equal(contractBalanceAfterPurchase.toString(), exepectedSmartContractBalance.toString());

			//Validate event for Car 1
			//assert.equal(tx.logs.length, 1, "buyCarFromSeller() call did not log 1 event");
			assert.equal(tx.logs[0].event, "CarPurchasedFromSeller", "buyCarFromSeller() call did not log event CarPurchasedFromSeller");		
			const event1 = tx.logs[0].args;
			assert.equal(event1.carId, '1', 'CarId is correct');
			assert.equal(event1.vin, 'V1', 'VIN is correct');
			assert.equal(event1.price, '1000000000000000000', 'Price is correct');			
			assert.equal(event1.carInfoIpfsHash, 'carInfo1_IpfsHash', 'CarInfo1_IpfsHash is correct');
			assert.equal(event1.imageIpfsHash, 'image1_IpfsHash', 'image1_IpfsHash is correct');
			assert.equal(event1.owner, buyer1, 'Car buyer is correct');
			assert.equal(event1.purchased, true, 'Purchased is true');
			
			
			assert.equal(tx.logs[1].event, "sellerAndSmartContractBalanceAfterPurchase", "buyCarFromSeller() call did not log event sellerAndSmartContractBalanceAfterPurchase");		
			const event2 = tx.logs[1].args;			
			assert.equal(event2.sellerBalanceBefore, seller1BalanceBeforePurchase.toString(), 'Seller balance is correct');
			assert.equal(event2.amountToSendToSeller, amountToSeller.toString(), 'Seller balance is correct');
			assert.equal(event2.sellerBalanceAfter, seller1BalanceAfterPurchase.toString(), 'Seller balance is correct');
			assert.equal(event2.marketPlaceSmartContractBalance, exepectedSmartContractBalance.toString(), 'Seller balance is correct');
			
		});
		
	});
	
	
});