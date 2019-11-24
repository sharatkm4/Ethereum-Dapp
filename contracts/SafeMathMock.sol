pragma solidity >=0.4.22 <0.6.0;

import "./Utils.sol";

contract SafeMathMock {
    /*function _safeMathAdd(uint256 a, uint256 b) public pure returns (uint256) {
        return Utils._safeMathAdd(a, b);
    }

    function _safeMathSubtract(uint256 a, uint256 b) public pure returns (uint256) {
        return Utils._safeMathSubtract(a, b);
    }*/

    function _safeMathDivide(uint256 a, uint256 b) public pure returns (uint256) {
        return Utils._safeMathDivide(a, b);
    }

    function _safeMathMultiply(uint256 a, uint256 b) public pure returns (uint256) {
        return Utils._safeMathMultiply(a, b);
    }
    
}