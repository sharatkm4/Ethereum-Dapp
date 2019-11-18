pragma solidity ^0.5.1;

contract CarMarketPlace {
    
    address payable public owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    struct Car {
        string vin;
        string make;
        string model;
        uint year;
        uint price;
    }
    
    mapping(address => Car[]) public sellerCarsMap;
    mapping(string => bool) public uniqueVinMap;
    
    event CarOnSale(string vin, string make, string model, uint year, uint price);
    
	modifier validateSellCarRequest(string memory vin, string memory make, string memory model, uint year, uint price) {
        require(bytes(vin).length > 0, "VIN is invalid !!");
		require(bytes(make).length > 0, "Make is invalid !!");
		require(bytes(model).length > 0, "Model is invalid !!");
		require(year >= 2000, "Year is invalid !!");
		require(price > 100000, "Price is invalid !!");
        _;
    }
    
    modifier validateUniqueVin(string memory vin) {
        require(uniqueVinMap[vin] != true, "VIN already exist !!");
        _;
    }
	
	function createCarForSale(string memory _vin, string memory _make, string memory _model, uint _year, uint _price) public validateSellCarRequest(_vin, _make, _model, _year, _price) validateUniqueVin(_vin) {
        // Seller Creates car and puts on sale
        sellerCarsMap[msg.sender].push(Car(_vin, _make, _model, _year, _price));
		//Map used later to check and avoid creating duplicate cars/vins for sale
        uniqueVinMap[_vin] = true;
        // Trigger an event 
        emit CarOnSale(_vin, _make, _model, _year, _price);
    }	
    
    function getNumberOfCarsForSale(address _seller) public view returns(uint) {
        return sellerCarsMap[_seller].length;
    }
    
}