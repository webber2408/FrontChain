// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;


contract FrontCoin {

    string public constant name = "FRONTCOIN";
    string public constant symbol = "FRONT";
    uint8 public constant decimals = 2; 
   
    address ERCowner; //#1

    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;
    
    uint256 totalSupply_;

    using SafeMath for uint256;

   constructor() {  
        totalSupply_ = 1000000;
        balances[msg.sender] = totalSupply_;
        ERCowner = msg.sender; //#2
    }  

    function totalSupply() public view returns (uint256) {
	    return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        balances[owner] = balances[owner].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
 
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}