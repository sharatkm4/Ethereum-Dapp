# Ethereum-DApp
Ethereum based DApp project as part of Kingsland University course.

A simple ethereum based DApp application which provides a decentralized marketplace for buying and selling used cars. 

If logged in as a seller, user can create/list cars for sale. <br/>
If logged in as a buyer, user can buy the car and transfer money to seller in ethers. <br/>
User with or without logging in can see the list of cars for sale from all the sellers. <br/>
The images are stored in IPFS. <br/>

Key Components: <br/>
JavaScript and JQuery based front end <br/>
&emsp;&emsp;Used to communicate with the Contract using MetaMask <br/>
ExpressJs Back end <br/>
&emsp;&emsp;Used to manage login and registration for users <br/>
IPFS <br/>
&emsp;&emsp;For storing and retrieving car info JSON (vin, make, model, year, type and sellerName) and car images <br/>
Smart Contract (Solidity) <br/>
&emsp;&emsp;For Buying and selling cars on ethereum blockchain (Ropsten) <br/>
Truffle framework for Unit Testing and Coverage <br/> <br/>

Steps to run: <br/>
Run node js <br/>
&emsp;&emsp;node src/car-marketplace-server.js <br/>
Run IPFS <br/>
&emsp;&emsp;ipfs daemon <br/>
Launch URL http://localhost:8888/ <br/>
