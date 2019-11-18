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
    
    modifier validateSellCarRequest(string memory _vin, string memory _make, string memory _model, uint _year, uint _price) {
        require(bytes(_vin).length > 0, "VIN is invalid !!");
        require(bytes(_make).length > 0, "Make is invalid !!");
        require(bytes(_model).length > 0, "Model is invalid !!");
        require(_year > 0, "Year is invalid !!");
        require(_price > 0, "Price is invalid !!");
        _;
    }
    
    event CarOnSale(string vin, string make, string model, uint year, uint price);
    
    function createCarForSale(string memory _vin, string memory _make, string memory _model, uint _year, uint _price) public validateSellCarRequest(_vin, _make, _model, _year, _price) {
        // Seller Creates car and puts on sale
        sellerCarsMap[msg.sender].push(Car(_vin, _make, _model, _year, _price));
        // Trigger an event 
        emit CarOnSale(_vin, _make, _model, _year, _price);
    }
    
    function getNumberOfCarsForSale(address _seller) public view returns(uint) {
        return sellerCarsMap[_seller].length;
    }
    
}