// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract FrontChain {
    struct Component {
        string name;
        string componentId;
        uint price;
        bool isSold;
        string ownerUUID;
        string description;
    }
    // componentId => owner
    mapping(string => address) componentOwner;
    // componentId => Component : To get the component details
    mapping(string => Component) componentDetails;
    // all components
    Component[] components;


    struct User{
        string name;
        string userId;
        uint balance;
        UserType userType;
    }
    // address => User
    mapping(address => User) userAddress;
    // user type
    enum UserType{ SELLER, BUYER}

    struct Request{
        string description;
        string reqId;
        string timestamp;
    }
    // reqId => Request
    mapping(string => Request) requestMap;
    // ALL REQUESTS
    Request[] requests;

    address ceo;

    string constant NULL_STRING = '';

    event Transfer(address indexed from, address indexed to, uint amount);


    constructor() {
        ceo = msg.sender;
    }

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


    // [WORKING] REGISTER USER
    function registerUser(string memory name, string memory userId, uint userType) payable public {
        // create new user
        User memory newUser;
        if(userType == 0)
            newUser = User(name, userId, msg.value, UserType.SELLER);
        else
            newUser = User(name, userId, msg.value, UserType.BUYER);

        // userId should not be null | Comparing userId string with Null String
        require(keccak256(bytes(newUser.userId)) != keccak256(bytes(NULL_STRING)));
        // map user address to its details
        userAddress[msg.sender] = newUser;
    }

    // [WORKING] PUBLISH COMPONENT - Modifier: onlySeller
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
        // BUYER BALANCE >= COMPONENT PRICE
        require(userAddress[msg.sender].balance >= componentDetails[componentId].price, "Low Balance");

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

         // // Handle transaction balances
        userAddress[ownerAddress].balance += componentDetails[componentId].price; // OWNER
        userAddress[msg.sender].balance -= componentDetails[componentId].price; // BUYER

        // transfer component mapping to buyer
        componentOwner[componentId] = msg.sender;

        // Pay Owner
        // ownerAddress.transfer(componentDetails[componentId].price);
        emit Transfer(msg.sender, ownerAddress,componentDetails[componentId].price);

       
    }
}
