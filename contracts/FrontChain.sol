// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface FrontCoinInterface {
    function totalSupply() external view returns (uint256);
    function transfer(address sender, address receiver, uint numTokens) external returns (bool);
    function transferFrom(address owner, address buyer, uint numTokens, address dealer) external returns (bool);
    function balanceOf(address tokenOwner) external view returns (uint);
    function approve(address sender, address dealer, uint numTokens) external returns (bool);
    function allowance(address owner, address dealer) external view returns (uint);
}

contract FrontChain {

    // Struct component used to store the frontend component basic information
    // It doesn't store the actual codes. Instead it stores a unique UUID which identifies
    // it uniquely and can be used to fetch the component's codes through a central server.
    struct Component {
        string name;
        string componentId; // UUID for components
        uint price;
        bool isSold;
        string ownerUUID;
        string description;
    }
    // MAPPING: componentId => owner
    mapping(string => address) componentOwner;
    // MAPPING: componentId => Component : To get the component details
    mapping(string => Component) componentDetails;
    // Stores all components
    Component[] components;

    // Used to store information regarding the user. Every user is identified uniquely by 
    // a userId which is a unique UUID generated at the time of Register from the DAPP UI.
    struct User{
        string name;
        string userId;
        uint balance;
        UserType userType;
    }
    // MAPPING: address => User
    mapping(address => User) userAddress;
    // ENUM: user type | SELLER => 0; BUYER => 1
    enum UserType{ SELLER, BUYER, CEO }

    // Stores the information about any feature request for any FE component that is needed by 
    // the user
    struct Request{
        string description;
        string reqId; // UUID for request | React
        string timestamp;
    }
    // MAPPING: reqId => Request
    mapping(string => Request) requestMap;
    // Stores all requests
    Request[] requests;

    // stores the address of the contract deployer
    address ceo;

    // stored to compare null string values with
    string constant NULL_STRING = '';

    // Transfer event for cryptocurrency transfer between two accounts.
    event Transfer(address indexed from, address indexed to, uint amount);

    address public constant FC_ADDRESS = 0x690e47bAD8F972Dc1f2dFa1E0Ee9EAAbc49597B4;
    
    FrontCoinInterface fcInterface = FrontCoinInterface(FC_ADDRESS);

    constructor() {
        ceo = msg.sender;
    }

    // Generic modifier based on enum UserType
    modifier onlyUserType(UserType userType){
        require(userAddress[msg.sender].userType == userType);
        _;
    }

    modifier onlyBuyerAndCeo{
        require(userAddress[msg.sender].userType == UserType.BUYER || msg.sender == ceo);
        _;
    }

    modifier onlyCeo{
        require(msg.sender == ceo);
        _;
    }

    function approveDealer(uint numTokens) public returns (bool) {
        fcInterface.approve(msg.sender, address(this), numTokens);
        return true;
    }

    function getDealerAllowance(address buyer) public view returns (uint) {
        return fcInterface.allowance(buyer, address(this));
    }

    function getFCStartingBalance() view public returns (uint256, uint256) {
        return (fcInterface.totalSupply(), address(FC_ADDRESS).balance);
    }

    function getFCUserBalance() view public returns (uint256) {
        return fcInterface.balanceOf(msg.sender);
    }

    function isUserCeo() view public returns (bool){
        return msg.sender == ceo;
    }

    function airDrop(address toAddress, uint amount) onlyCeo public payable {
        fcInterface.transfer(ceo, toAddress, amount);
        userAddress[ceo].balance = fcInterface.balanceOf(ceo);
        userAddress[toAddress].balance = fcInterface.balanceOf(toAddress);
    }

    // [WORKING] REGISTER USER
    // Registers a new user based on his user type and then maps its address with the struct User.
    function registerUser(string memory name, string memory userId, uint userType) payable public {
        // create new user
        User memory newUser;

        if(msg.sender == ceo){
            // ceo registering
            newUser = User(name, userId, fcInterface.balanceOf(msg.sender), UserType.CEO);
        }else{
            // other user registering
            // fcInterface.transferFrom(ceo, msg.sender, 100);
            
            // update balance of ceo after registration
            // userAddress[ceo].balance = fcInterface.balanceOf(ceo);

            if(userType == 0)
                newUser = User(name, userId, 0, UserType.SELLER);
            else
                newUser = User(name, userId, 0, UserType.BUYER);
        }

        // userId should not be null | Comparing userId string with Null String
        require(keccak256(bytes(newUser.userId)) != keccak256(bytes(NULL_STRING)));
        // map user address to its details
        userAddress[msg.sender] = newUser;
    }

    // [WORKING] PUBLISH COMPONENT - Modifier: onlySeller
    // This function accepts the component's name, its uuid, price and a description and none of the codes
    // and stores this information onto the blockchain.
    function publishComponent(string memory name, string memory componentId, uint price, string memory description) onlyUserType(UserType.SELLER) payable public{
        Component memory newComponent = Component(name, componentId, price, false, userAddress[msg.sender].userId, description);
        // push new component to all component list
        components.push(newComponent);
        // map owner of the new component
        componentOwner[componentId] = msg.sender;
        // map componentId to its details
        componentDetails[componentId] = newComponent;
    }

    // [WORKING] GET ALL COMPONENTS
    function getAllComponents() view public returns(Component[] memory) {
        return components;
    }

    // [WORKING] GET COMPONENT OWNER
    function getOwnerDetails(string memory componentId) view public returns(address, User memory) {
        return (componentOwner[componentId], userAddress[componentOwner[componentId]]);
    }

    // GET ANY USER from Registered Users
    function getUser() view public returns (User memory){
        return userAddress[msg.sender];
    }

    // [WORKING] GET COMPONENT DETAILS
    function getComponentDetails(string memory componentId) view public returns (Component memory) {
        return componentDetails[componentId];
    }

    // ADD REQUEST
    function addRequest(string memory description, string memory reqId, string memory timestamp) public {
        Request memory temp = Request(description, reqId, timestamp);
        // Push new request to all request list
        requests.push(temp);
    }

    // GET ALL REQUESTS
    function getAllRequests() view public returns(Request[] memory){
        return requests;
    }

    // [WORKING] PURCHASE COMPONENT - Modifier: Owner can not purchase himself/herself. - onlyBuyer
    function purchaseComponent(string memory componentId) payable onlyUserType(UserType.BUYER) public {

        // GET OWNER ADDRESS
        address payable ownerAddress = payable(componentOwner[componentId]);

        // sell the component
        componentDetails[componentId].isSold = true;
        componentDetails[componentId].ownerUUID = userAddress[msg.sender].userId;

        // change components list
        for(uint i=0; i<components.length; i++){
            if(keccak256(bytes(components[i].componentId)) == keccak256(bytes(componentId))){
                // found
                components[i].isSold = true;
                components[i].ownerUUID = userAddress[msg.sender].userId;
                break;
            }
        }

        // transfer component mapping to buyer
        componentOwner[componentId] = msg.sender;

        // Pay Owner
        fcInterface.transferFrom(msg.sender, ownerAddress, componentDetails[componentId].price, address(this));

        // Change balances
        userAddress[msg.sender].balance = fcInterface.balanceOf(msg.sender); // BUYER
        userAddress[ownerAddress].balance = fcInterface.balanceOf(ownerAddress); // SELLER
    }
}
