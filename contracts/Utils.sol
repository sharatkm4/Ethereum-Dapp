pragma solidity >=0.4.22 <0.6.0;

library Utils {
    
    // Allow for safely adding two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    /*function _safeMathAdd(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "_safeMathAdd : Addition Overflow");

        return c;
    }*/
    
    // Allows for safely subtracting two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    /*function _safeMathSubtract(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "_safeMathSubtract : Subtraction Overflow");
        uint256 c = a - b;

        return c;
    }*/
    
    // Allows for safely dividing two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathDivide(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "_safeMathDivide : Denominator is 0"); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // require(a == b * c + a % b, "_safeMathDivide : Division Overflow"); // There is no case in which this doesn't hold
        return c;
    }
    
    // Allows for safely multiplying two numbers.
    // Source --> https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol
    function _safeMathMultiply(uint a, uint b) internal pure returns (uint) {
         if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }
    
    // Compares two strings for equality.
    // Reference --> https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity
    /*function _compareStringsEqual(string memory a, string memory b) internal pure returns (bool) {
        return ( keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }*/
    
    // Allows for safely obtaining the Percentage of a Total Amount.
    // Source --> https://ethereum.stackexchange.com/questions/36272/get-percentage-of-gas-price-solidity-ethereum
    function _getPercentageOfTotalAmount(uint256 _numerator, uint256 _denominator, uint256 _totalAmount) internal pure returns (uint256) {
        uint256 totalNumerator = _safeMathMultiply(_numerator, _totalAmount);
        return _safeMathDivide(totalNumerator, _denominator);
    }
    
    // Source --> https://ethereum.stackexchange.com/questions/62222/address-payable-type-store-address-and-send-later-using-solidity-0-5-0
    /*function _convertAddressToAddressPayable(address _incomingAddress) internal pure returns (address payable) {
        address payable anAddressPayable = address(uint160(_incomingAddress));
        return anAddressPayable;
    }*/
    
}

