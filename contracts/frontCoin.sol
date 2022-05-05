// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;


contract FrontCoin {

    string public constant name = "FRONTCOIN";
    string public constant symbol = "FRONT";
    uint8 public constant decimals = 2; 
   
    address ERCowner; //#1

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
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

    function transfer(address sender, address receiver, uint numTokens) payable public returns (bool) {
        require(numTokens <= balances[sender], "Insufficient Sender Balance!");
        balances[sender] = balances[sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(sender, receiver, numTokens);
        return true;
    }

    function transferFrom(address buyer, address seller, uint numTokens, address dealer) public returns (bool) {
        require(numTokens <= balances[buyer], "Insufficient Balance!"); 
        require(numTokens <= allowed[buyer][dealer], "Insufficient Allowance!");

        balances[buyer] = balances[buyer].sub(numTokens);
        allowed[buyer][dealer] = allowed[buyer][dealer].sub(numTokens);
        balances[seller] = balances[seller].add(numTokens);
        emit Transfer(buyer, seller, numTokens);
        return true;
    }

    function approve(address sender, address dealer, uint numTokens) public returns (bool) {
        allowed[sender][dealer] = numTokens;
        emit Approval(sender, dealer, numTokens);
        return true;
    }

    function allowance(address owner, address dealer) public view returns (uint) {
        return allowed[owner][dealer];
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