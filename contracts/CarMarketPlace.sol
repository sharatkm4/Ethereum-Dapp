pragma solidity >=0.4.22 <0.6.0;

import "./Utils.sol";

contract CarMarketPlace {
    using Utils for *;
    
    address payable public contractOwner;
    
    constructor() public {
        contractOwner = msg.sender;
    }
    
    struct Car {
        uint id;
        string vin;
        uint price;
        string carInfoIpfsHash;
        string imageIpfsHash;
        address payable owner;
        bool purchased;
    }
    
    //count of cars
    uint public carCount = 0;
    // Mapping of ID to car
    mapping(uint => Car) public carsMap;
    // Mapping of vin to purchased or not
    mapping(string => bool) public uniqueVinMap;
    
    //Event to be triggered
    event CarOnSale(uint carId, string vin, uint price, string carInfoIpfsHash, string imageIpfsHash, address owner, bool purchased);
    
    //Validate input data for create car sale
	modifier validateSellCarRequest(string memory vin, uint price, string memory carInfoIpfsHash, string memory imageIpfsHash) {
        require(bytes(vin).length > 0, "VIN is invalid !!");
		require(price > 100000, "Price is invalid !!");
		require(bytes(carInfoIpfsHash).length > 0, "CarInfo IPFS hash is invalid !!");
		require(bytes(imageIpfsHash).length > 0, "Image IPFS hash is invalid !!");
        _;
    }
    
    //Unique vin/car validation
    modifier validateUniqueVin(string memory vin) {
        require(uniqueVinMap[vin] != true, "VIN/Car already exists !!");
        _;
    }
    
    // This method will create or list a car for sale so that potential buyer can purchase it. 
    // Input: 
    //      _vin - VIN of the car
    //      _price - price of the car
    //      _carInfoIpfsHash - hash of JSON (vin, make, model, year, type, sellerName ) stored in IPFS
    //      _imageIpfsHash - hash of car image stored in IPFS
    function createCarForSale(string memory _vin, uint _price, string memory _carInfoIpfsHash, string memory _imageIpfsHash) public validateSellCarRequest(_vin, _price, _carInfoIpfsHash, _imageIpfsHash) validateUniqueVin(_vin) {
	    //Increment car count
	    carCount++;
        // Seller Creates car and puts on sale
        carsMap[carCount] = Car(carCount, _vin, _price, _carInfoIpfsHash, _imageIpfsHash, msg.sender, false);
        //Map to avoid creating duplicate cars/vins for sale
        uniqueVinMap[_vin] = true;
		//Trigger event when car is created for sale 
        emit CarOnSale(carCount, _vin, _price, _carInfoIpfsHash, _imageIpfsHash, msg.sender, false);
    }
    
    event CarPurchasedFromSeller(uint carId, string vin, uint price, string carInfoIpfsHash, string imageIpfsHash, address owner, bool purchased);
    
    event sellerAndSmartContractBalanceAfterPurchase(uint sellerBalanceBefore, uint amountToSendToSeller, uint sellerBalanceAfter, uint marketPlaceSmartContractBalance);
    
    modifier validId(uint id) {
        require(id > 0 && id <= carCount, "Not a valid ID !!");
        _;
    }
    
    // This method will allow the buyer to purchase the car from seller. 
    // 95% of the price goes to the seller and remaining 5% goes to this contract
    // Input:
    //      _id - ID of the car being bought
    function buyCarFromSeller(uint _id) public payable validId(_id) {
        // Retrieve the car 
        Car memory car = carsMap[_id];
        // Get the owner/seller
        address payable seller = car.owner;
        
        //Validate buyer is not the same as seller
        require(msg.sender != seller, "Invalid buyer !! Are you the seller ? ");
        
        //Validate buyer has enough balance to buy the car
        require(msg.sender.balance >= car.price, "Buyer does not have enough balance to purchase the car !!");
        
        //Validate price sent in the transaction is equal to or greater than car price set by seller
        require(msg.value >= car.price, "Invalid price sent to buy the car !!");
        
        //validate car is not purchased already
        require(!car.purchased, "Car has already been purchased by a different buyer !!");
        
        //Update the car as purchased
        car.purchased = true;
        //Transfer ownership to Buyer
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
        emit CarPurchasedFromSeller(_id, car.vin, car.price, car.carInfoIpfsHash, car.imageIpfsHash, msg.sender, true);
        
        //Trigger event for seller and smartContract balance after car purchase
        emit sellerAndSmartContractBalanceAfterPurchase(sellerBalanceBefore, amountToSendToSeller, sellerBalanceAfter, marketPlaceSmartContractBalance);
    }
    
}