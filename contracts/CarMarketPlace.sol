pragma solidity >=0.4.22 <0.6.0;

import "./Utils.sol";

contract CarMarketPlace {
    using Utils for *;
    
    address payable public owner;
	uint public carCount = 0;
    
    constructor() public {
        owner = msg.sender;
    }
    
    struct Car {
        uint id;
        string vin;
        string make;
        string model;
        uint year;
        uint price;
        string imageUrl;
        address payable owner;
        bool purchased;
    }
    
    mapping(uint => Car) public carsMap;
    mapping(string => bool) public uniqueVinMap;
    
    event CarOnSale(uint carCount, string vin, string make, string model, uint year, uint price, string ipfsImageUrl, address owner, bool purchased);
    
	modifier validateSellCarRequest(string memory vin, string memory make, string memory model, uint year, uint price, string memory ipfsImageUrl) {
        require(bytes(vin).length > 0, "VIN is invalid !!");
		require(bytes(make).length > 0, "Make is invalid !!");
		require(bytes(model).length > 0, "Model is invalid !!");
		require(year >= 2000, "Year is invalid !!");
		require(price > 100000, "Price is invalid !!");
		require(bytes(ipfsImageUrl).length > 0, "Image URL is invalid !!");
        _;
    }
    
    modifier validateUniqueVin(string memory vin) {
        require(uniqueVinMap[vin] != true, "VIN/Car already exists !!");
        _;
    }
    
    function createCarForSale(string memory _vin, string memory _make, string memory _model, uint _year, uint _price, string memory _ipfsImageUrl) public validateSellCarRequest(_vin, _make, _model, _year, _price, _ipfsImageUrl) validateUniqueVin(_vin) {
	    //Increment car count
	    carCount++;
        // Seller Creates car and puts on sale
        carsMap[carCount] = Car(carCount, _vin, _make, _model, _year, _price, _ipfsImageUrl, msg.sender, false);
        //Map used later to check and avoid creating duplicate cars/vins for sale
        uniqueVinMap[_vin] = true;
		//Trigger event when car is created for sale 
        emit CarOnSale(carCount, _vin, _make, _model, _year, _price, _ipfsImageUrl, msg.sender, false);
    }	
    
    event CarPurchasedFromSeller(uint id, string vin, string make, string model, uint year, uint price, string ipfsImageUrl, address owner, bool purchased);
    
    event sellerAndSmartContractBalanceAfterPurchase(uint sellerBalanceBefore, uint amountToSendToSeller, uint sellerBalanceAfter, uint marketPlaceSmartContractBalance);
    
    modifier validId(uint id) {
        require(id > 0 && id <= carCount, "Not a valid ID !!");
        _;
    }
    
    function buyCarFromSeller(uint _id) public payable validId(_id) {
        // Retrieve the car 
        Car memory car = carsMap[_id];
        // Get the owner/seller
        address payable seller = car.owner;
        
        //Validate buyer is not the same as seller
        require(msg.sender != seller, "Invalid buyer !! Are you the seller ? ");
        
        //Validate buyer has enough balance and price sent in the transaction is equal to or greater than car price set by seller
        require(msg.sender.balance >= car.price && msg.value >= car.price, "Invalid price sent to buy the car !!");
        
        //validate car is not purchased already
        require(!car.purchased, "Car has already been purchased by a different buyer !!");
        
        //Update the car as purchased
        car.purchased = true;
        //Buyer will be the new owner
        car.owner = msg.sender;
        
        //re-assign the updated car
        carsMap[_id] = car;
        
        //Pay 95% of the total price (in wei) to seller
        //Pay 5% of the total price (in wei) to CarMarketPlace smart contract
        uint totalCarPrice = msg.value;
        //uint amountToSendToSmartContract = Utils._getPercentageOfTotalAmount(uint(5), uint(100), uint(totalCarPrice));
        //uint amountToSendToSeller = Utils._safeMathSubtract(totalCarPrice, amountToSendToSmartContract);
        uint amountToSendToSeller = Utils._getPercentageOfTotalAmount(uint(95), uint(100), uint(totalCarPrice));

        uint sellerBalanceBefore = seller.balance;
        //Transfer 95% of the price to seller
        seller.transfer(amountToSendToSeller);
        uint sellerBalanceAfter = seller.balance;
        
        //5% of the price is added to this contract's balance 
        //We are not explicitly adding the balance since contract's function is payable and it holds all the money sent to it initially. 
        uint marketPlaceSmartContractBalance = address(this).balance;
        
        //Trigger event when car is purchased by buyer
        emit CarPurchasedFromSeller(_id, car.vin, car.make, car.model, car.year, car.price, car.imageUrl, msg.sender, true);
        
        //Trigger event for seller and smartContract balance after car purchase
        emit sellerAndSmartContractBalanceAfterPurchase(sellerBalanceBefore, amountToSendToSeller, sellerBalanceAfter, marketPlaceSmartContractBalance);
    }
    
}