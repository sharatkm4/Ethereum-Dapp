$(document).ready(function () {
    const ethereumProvider = ethers.providers.getDefaultProvider('ropsten');
	//Car marketPlace contract address
	//const carMarketplaceContractAddress = "0x3f18b216889d768a038accee2fadabc033873d91"; 	//V1
	//https://ropsten.etherscan.io/tx/0x54e5bc12dd25348c2baa3b604162d4aa9fb1eb55565b6a315d6472446ff1e4b5
	
	const carMarketplaceContractAddress = "0xFc6Fd05649fEA3450894cBC97D0e7935657cd995"; 	//V2 (with shutdown)
	//https://ropsten.etherscan.io/tx/0x372b0d232a2f1f2b7a637c01e724cdf64f24ab6b3ff4ad234bf75d9ff3799cb4
	
	//Car marketPlace contract ABI
    const carMarketplaceContractABI = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "buyCarFromSeller",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_vin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_carInfoIpfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_imageIpfsHash",
				"type": "string"
			}
		],
		"name": "createCarForSale",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "marketPlaceShutDown",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vin",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "carInfoIpfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageIpfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "purchased",
				"type": "bool"
			}
		],
		"name": "CarOnSale",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "vin",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "carInfoIpfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageIpfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "purchased",
				"type": "bool"
			}
		],
		"name": "CarPurchasedFromSeller",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sellerBalanceBefore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountToSendToSeller",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sellerBalanceAfter",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "marketPlaceSmartContractBalance",
				"type": "uint256"
			}
		],
		"name": "sellerAndSmartContractBalanceAfterPurchase",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "msg",
				"type": "string"
			}
		],
		"name": "MarketPlaceShutDown",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "carCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "carsMap",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "vin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "carInfoIpfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageIpfsHash",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "purchased",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractOwner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "uniqueVinMap",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

	//Initialize IPFS
	const IPFS = window.IpfsApi('localhost','5001');
	const Buffer = IPFS.Buffer;

	//Create car marketPlace contract using ethers library for reading data only. For writing data, contract is created using metamask library.
	//Users can see list of cars available for sale even without logging in to the app nor have metamask installed !!
    const carMarketplaceContractEthers = new ethers.Contract(carMarketplaceContractAddress, carMarketplaceContractABI, ethereumProvider);

    showView("viewHome");

	//Show home page
    $('#linkHome').click(function () {
        showView("viewHome");
    });

	//Show login section
    $('#linkLogin').click(function () {
		//Check if  metamask is installed or not
		if (window.ethereum) {
			window.ethereum.enable();
		} else {
			return showError("Please install Metamask in your browser to register, login, buy and sell cars.");			
		}
        showView("viewLogin");
    });

	//Show register section
    $('#linkRegister').click(function () {
		//Check if  metamask is installed or not
		if (window.ethereum) {
			window.ethereum.enable();
		} else {
			return showError("Please install Metamask in your browser to register, login, buy and sell cars.");			
		}		
        showView("viewRegister");
    });
	
	//Show create car section
	$('#linkCreateCarSale').click(function () {
		showView("viewCreateCarSale");
	});	

	//Show  purchased cars section
	$('#linkPurchasedCars').click(function () {		
		showView("viewPurchasedCars");
		loadPurchasedCarResults();
	});
	
	//Logout
    $('#linkLogout').click(logout);
	
	//Show car results when clicked on SOLD filter criteria
	$("#linkSoldId").on("click", function (){		
		loadCarResults('SOLD');
	});
	
	//Show car results when seller filter criteria is changed
	$("#listOfSellersId").on("change", function (){		
		loadCarResults('SELLER');
	});
	
	//Show all car results when reset is clicked
	$("#buttonResetCriteria").on("click", function (){		
		loadCarResults('ALL');
	});

	//Login button clicked
    $('#buttonLogin').click(login);
	//Register button clicked
    $('#buttonRegister').click(register);
	//Create car button clicked
	$('#buttonCreateCarSale').click(createCarSale);	

	//Show view based on logged in or without logged in
    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
        const loggedIn = sessionStorage.username;
        if (loggedIn) {
            $('.show-after-login').show();
            $('.hide-after-login').hide();
        } else {
            $('.show-after-login').hide();
            $('.hide-after-login').show();
        }
		const buyerSellerType = sessionStorage.buyerSellerType;
		console.log('buyerSellerType: ', buyerSellerType);
		
		if(loggedIn && buyerSellerType === 'seller')			
			$('.show-sell-car-after-login').show();
		else 
			$('.show-sell-car-after-login').hide();
		
		if(loggedIn && buyerSellerType === 'buyer')			
			$('.show-purchased-cars-after-login').show();
		else 
			$('.show-purchased-cars-after-login').hide();
		
        if (viewName === 'viewHome'){
			if(loggedIn){				
				$('#welcomeId').empty();
				$('#welcomeId').html(`Welcome <b>${sessionStorage.username}</b>`);
			} else {
				$('#welcomeId').empty();
				$('#welcomeId').html(`Please <b>login or register</b> in order to buy or sell car (invoke a smart contract).`);
			}			
			loadSellers();
            loadCarResults('ALL');
		}
    }

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#ajaxLoadingBox").fadeIn(200) },
        ajaxStop: function() { $("#ajaxLoadingBox").fadeOut(200) }
    });

    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function () {
            $('#infoBox').hide();
        });
    }

    function showError(errorMsg, err) {
        let msgDetails = "";
        if (err && err.responseJSON)
            msgDetails = err.responseJSON.errorMsg;
        $('#errorBox>p').html('Error: ' + errorMsg + msgDetails);
        $('#errorBox').show();
        $('#errorBox>header').click(function () {
            $('#errorBox').hide();
        });
    }

    function showProgressBox(percent) {
        let msg = "Wallet encryption / decryption ... " +
            Math.round(percent * 100) + "% complete";
        $('#progressBox').html(msg).show(100);
    }

    function hideProgressProgress() {
        $('#progressBox').hide(100);
    }
	
	//Retrieve list of registered sellers from server and populate dropdown for filter criteria
	async function loadSellers() {
		
		$('#listOfSellersId').empty();
		$('#listOfSellersId').append('<option id="all">ALL</option>');
		
		try {
			let result = await $.ajax({
				type: 'GET',
				url: `/getAllSellers`,				
				contentType: 'application/json'
			});
			console.log("sellers_result", result);
			
			if(result){
				let sellers = result.sellers;
				for(i=0; i<sellers.length; i++){
					let seller = sellers[i];
					$('#listOfSellersId').append('<option id="' + seller + '">' + seller + '</option>');
				}
			}			

		} catch(err) {
			console.log("Cannot load sellers. ", err);
			showError("Cannot load sellers. ", err);
		}
    }

	// Check if metamask is installed and account is unlocked. If not, error message is returned.
	function checkMetamask(){
		
		// Make sure metamask is installed in the browser
		if (typeof web3 === 'undefined'){
			return "Please install Metamask to access the Ethereum Web3 API from your web browser";
		}
		
		// Make sure metamask has been logged in and has a valid account
		let account = web3.eth.accounts[0];
		if(account)
			return "SUCCESS";			
		else 
			return "Please unlock Metamask in your browser to register, login, buy and sell cars.";		
	}
	
	// Allows buyer or seller to login
    async function login() {
		
		// Metamask validation
		let metamaskCheckMsg = checkMetamask();		
		if(metamaskCheckMsg !== "SUCCESS") {		
			return showError(metamaskCheckMsg);
		}		
		
		// validate username
        let username = $('#usernameLogin').val();
		if(!username || !username.trim().length > 0){
			showError("Invalid Username.");
			return;
		}
		
		// validate password
		let loginPassword = $('#passwordLogin').val();
		if(!loginPassword || !loginPassword.trim().length > 0 ){
			showError("Invalid password.");
			return;
		}
		// hash the password with username and validate credentials on server side
		let backendPassword = CryptoJS.HmacSHA256(username, loginPassword).toString();
		let account = web3.eth.accounts[0];
		try {
			let result = await $.ajax({
				type: 'POST',
				url: `/login`,
				data: JSON.stringify({username, password: backendPassword, account}),
				contentType: 'application/json'
			});
			
			sessionStorage['username'] = username;
			sessionStorage['metamaskAccount'] = account;			
			sessionStorage['buyerSellerType'] = result.buyerSellerType;			
			showView("viewHome");
			showInfo(`User "${username}" logged in successfully.`);

		} catch(err) {
			showError("Cannot login user. ", err);
		}
    }

	//Allows users to register as buyer or seller
    async function register() {
		
		// Metamask validation
		let metamaskCheckMsg = checkMetamask();		
		if(metamaskCheckMsg !== "SUCCESS") {		
			return showError(metamaskCheckMsg);
		}		
		
		// validate username
        let username = $('#usernameRegister').val();
		if(!username || !username.trim().length > 0){
			showError("Invalid Username.");
			return;
		}
		
		// validate password
		let registerPassword = $('#passwordRegister').val();		
		if(!registerPassword || !registerPassword.trim().length > 0 ){
			showError("Invalid password.");
			return;
		}
		
		let buyerSellerType = $('#buyerSellerId option:selected').attr('id');		
		
		try {
			// hash the password with username and store it in back end
			let backendPassword = CryptoJS.HmacSHA256(username, registerPassword).toString();
						
			let account = web3.eth.accounts[0];			
			
			let result = await $.ajax({
				type: 'POST',
				url: `/register`,
				data: JSON.stringify({username, password: backendPassword, account, buyerSellerType}),
				contentType: 'application/json'
			});
			
			sessionStorage['username'] = username;			
			sessionStorage['buyerSellerType'] = buyerSellerType;
			sessionStorage['metamaskAccount'] = account;
			showView("viewHome");
			showInfo(`User "${username}" registered successfully.`);

		} catch(err) {
			showError("Cannot register user. ", err);
		} finally {
			hideProgressProgress();
		}
    }

	// Load cars which were listed by all the sellers
    async function loadCarResults(filterCriteria) {
		console.log('filterCriteria: ', filterCriteria);
		
		/*var etherAmount = web3.fromWei(1900000);
		console.log('etherAmount: ', etherAmount);
		var weiAmount = web3.toWei(0.0000000000001,'ether');
		console.log('weiAmount: ', weiAmount);*/
		
        try {
			
			//Filter based on the seller option selected from filter criteria
			let selectedSellerName;
			if(filterCriteria === 'SELLER'){
				selectedSellerName = $('#listOfSellersId option:selected').attr('id');
				if(selectedSellerName === 'all')
					filterCriteria = 'ALL';
			}
		
			//Get car count from contract
			let carCount = await carMarketplaceContractEthers.carCount();
			carCount = parseInt(carCount);
			console.log('carCount: ', carCount);
			//Display carcount on UI
			$('#totalCountId').empty();
			$('#totalCountId').html(`<br/><b> Total count: ${carCount} </b>`);				
			let carResultsUl = $('#carResults').empty();
			
			if(carCount > 0 ){
				let j =0;
				//Loop through each cars
				for (let i = 1; i <= carCount; i++) {
					let car = await carMarketplaceContractEthers.carsMap(i);
					
					j++;
					//let carPriceInEther = web3.fromWei(car.price);
					//console.log('carId:' + i + '  carPriceInEther: '+ carPriceInEther);
					
					let carOwner = car.owner;
					
					//Fetch JSON (sample json below) which was stored in IPFS
					//{ 
					//  "vin": "V2",
					//	"make": "Audi",
					//	"model": "Q5",
					//	"year": 2019,
					//	"type": "suv",
					//	"sellerName": "seller1"
					//}
					let carInfoJson = JSON.parse(await IPFS.cat(car.carInfoIpfsHash));				
					console.log('CarInfoJson retrieved from IPFS: ', carInfoJson);

					//Handle filter criteria (by Sold or Seller types)
					if(filterCriteria === 'SOLD'){
						if(!car.purchased){
							j--;
							continue;
						}
					} else if(filterCriteria === 'SELLER'){						
						//console.log('selectedSellerName: ', selectedSellerName);
						//console.log('carInfoJson.sellerName: ', carInfoJson.sellerName);
						if(!(carInfoJson.sellerName === selectedSellerName)){
							j--;
							continue;
						}
					}
					
					//If car is sold, just display the details
					if(car.purchased) {
						let li = $('<li>').html(`<b>Vehicle ${i}</b>: <br/> ` +
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Seller:</b> ${carInfoJson.sellerName} <br/> ` +
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Vin:</b> ${car.vin} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Make:</b> ${carInfoJson.make} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Model:</b> ${carInfoJson.model} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Year:</b> ${carInfoJson.year} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Price:</b> ${car.price} (in WEI)<br/>  ` + 
						`<img src='https://ipfs.io/ipfs/QmQxt6JEqzdmmcDu7yM3dBXM8Gs7DrXNxvUZ11agxx2Kja' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/><br/><br/><hr>`);
						li.appendTo(carResultsUl);
					} else {
						//if car is not sold yet, provide BUY option only if the user is logged in as "BUYER"
						let li = $('<li>').html(`<b>Vehicle ${i}</b>: <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Seller:</b> ${carInfoJson.sellerName} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Vin:</b> ${car.vin} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Make:</b> ${carInfoJson.make} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Model:</b> ${carInfoJson.model} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Year:</b> ${carInfoJson.year} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Price:</b> ${car.price} (in WEI)<br/> ` + 
						`<img src='https://ipfs.io/ipfs/${car.imageIpfsHash}' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/>`);
						
						//Display "BUY" button only if the user is logged in as "BUYER"
						const buyerSellerType = sessionStorage.buyerSellerType;
						//console.log('i: ', i);
						let carId = i;
						let carPrice = car.price;
						if(buyerSellerType === 'buyer') {				
							let button = $(`<input type="button" value="BUY NOW !!">`);
							button.click(function () {								
								buyCarFromSeller(carId, carPrice, carOwner)
							});
							li.append(button);
							li.append('<br/><br/><br/><hr>');		
						} else {
							li.append('<hr>');		
						}
						li.appendTo(carResultsUl);
					}
				}
				carCount = j;
				$('#totalCountId').empty();
				$('#totalCountId').html(`<br/><b> Total count: ${carCount} </b>`);
			} else {
				let li = $('<li>').html("No cars are available for sale right now. Please check back later.");
				li.appendTo(carResultsUl);				
			}
		}
		catch (err) {
			showError(err);
		}
    }
	
	// Display all the purchased cars for logged in "BUYER"
	async function loadPurchasedCarResults() {
		
        try {			
		
			// Make sure metamask has been logged in and has a valid account
			let metamaskCheckMsg = checkMetamask();		
			if(metamaskCheckMsg !== "SUCCESS") {		
				return showError(metamaskCheckMsg);
			}
			let account = web3.eth.accounts[0];					
			
			// Get car count from contract
			let carCount = await carMarketplaceContractEthers.carCount();
			carCount = parseInt(carCount);
			console.log('carCount: ', carCount);
			let carResultsUl = $('#purchasedCarResults').empty();
			if(carCount > 0 ){
				//Loop through all the cars
				//If the car is purchased and carowner matches with metamask account, display car details.
				let j=0;
				for (let i = 1; i <= carCount; i++) {
					let car = await carMarketplaceContractEthers.carsMap(i);					
					//console.log('car.owner: ', car.owner);
					if(car.purchased && (account === car.owner.toLowerCase()) ) {
						j++;
						let carInfoJson = JSON.parse(await IPFS.cat(car.carInfoIpfsHash));
						
						let li = $('<li>').html(`<b>Vehicle ${j}</b>: <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Vin:</b> ${car.vin} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Make:</b> ${carInfoJson.make} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Model:</b> ${carInfoJson.model} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Year:</b> ${carInfoJson.year} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Price:</b> ${car.price} (in WEI)<br/>  ` + 
						`<img src='https://ipfs.io/ipfs/${car.imageIpfsHash}' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/><br/><br/><hr>`);
						li.appendTo(carResultsUl);						
					}
				}
				
				if(j == 0){
					let li = $('<li>').html("You haven't bought any cars yet !!");
					li.appendTo(carResultsUl);
				}
			} else {
				let li = $('<li>').html("You haven't bought any cars yet !!");
				li.appendTo(carResultsUl);				
			}
		}
		catch (err) {
			showError(err);
		}
    }

	//Buy the car from Seller by invoking smart contract
	//Input:
	//	carId - ID of the car
	// 	carPrice - carPrice set by the seller
	// 	carOwner - seller ethereum address
	async function buyCarFromSeller(carId, carPrice, carOwner) {	
		
		//validate carId
		carId = parseInt(carId);
		if(!(carId > 0)){
			showError("Invalid carId.");
			return;
		}
		
		console.log('About to buy car from seller with ID: ' + carId + ' for price: ' + carPrice);
		
		try{
			//validate metamask 
			let metamaskCheckMsg = checkMetamask();		
			if(metamaskCheckMsg !== "SUCCESS") {		
				return showError(metamaskCheckMsg);
			}
			let account = web3.eth.accounts[0];			
			
			console.log('metamask account: ', account);
			
			// Logged in user must use the same metamask account he had registered initially
			if(sessionStorage.metamaskAccount !== account){
				return showError("Invalid metamask account detected for the current user !!");
			}
			
			//If seller is the buyer, return error !!
			if(account === carOwner.toLowerCase()){
				return showError("Invalid buyer !! Are you the seller ?");	
			}

			let carMarketplaceContract = web3.eth.contract(carMarketplaceContractABI).at(carMarketplaceContractAddress);
			console.log('carMarketplaceContract: ', carMarketplaceContract);
			
			//Before buying car, make sure the marketplace is not shutdown (contract not killed)
			let carCount = await carMarketplaceContractEthers.carCount();
			if(!carCount)
				return showError("Marketplace is shutdown and cannot buy/sell car!!");
			
			//https://ethereum.stackexchange.com/questions/45398/call-a-payable-function-and-pay-ether-with-metamask			
			//var etherAmount = web3.toBigNumber($("#id_of_field_with_ether_value").val());
			//var etherAmount = web3.fromWei(carPrice);
			//console.log('etherAmount: ', etherAmount);
			//var weiAmount = web3.toWei(etherAmount,'ether');
			//console.log('weiAmount: ', weiAmount);
   			
			//Invoke smart contract to buy the car from seller by sending carId and carPrice
			carMarketplaceContract.buyCarFromSeller(carId, {from: account, value: carPrice}, function (err, txHash) {
				if (err)
					return showError("Smart contract call failed when buying car from seller: " + err);				
				console.log(`Your transaction for purchasing the car from seller has been sent. Please wait for confirmation. Transaction hash: ${txHash}`);
				showInfo(`Your transaction for purchasing the car from seller has been sent. Please wait for confirmation. Transaction hash: ${txHash}`);
				setTimeout(function () { showView("viewHome"); }, 5000);
			});
			
			//Listen for CarPurchasedFromSeller event from smart contract.
			//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#contract-events
			carMarketplaceContract.CarPurchasedFromSeller(function(error, event) {
				if (error)
					return showError("CarPurchasedFromSeller Event failed : " + error);					
				console.log('CarPurchasedFromSeller event: ', event); 
				showInfo(`Your car has been <b>successfully purchased</b> from seller.`);
				setTimeout(function () { showView("viewHome"); }, 5000);
			});			
			
			//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#methods.myMethod.send
			//Error: The MetaMask Web3 object does not support synchronous methods like eth_sendTransaction without a callback parameter			
			/*carMarketplaceContract.methods.buyCarFromSeller(carId).send({from: account, value: carPrice})
			.then(function(receipt){
				// receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
				console.log('receipt: ', receipt);
			});*/
			
			//Error: The MetaMask Web3 object does not support synchronous methods like eth_sendTransaction without a callback parameter			
			/*carMarketplaceContract.buyCarFromSeller(carId, {from: account, value: carPrice})
			.on('transactionHash', function(hash){
				showInfo(`Your transaction for purchasing the car from seller has been sent. Transaction hash: ${txHash}`);
			})
			.on('confirmation', function(confirmationNumber, receipt){
				console.log('confirmation: ', confirmation);
			})
			.on('receipt', function(receipt){
				console.log('receipt: ', receipt);
			})
			.on('error', function(error) {
				console.log('error: ', error);
			});*/
			
		} catch(err) {
			console.log('Error while trying to buy car from seller. Please try again later. ', err);
			showError("Error while trying to buy car from seller. Please try again later.", err);
		} finally {
			hideProgressProgress();
		}	
		
	}
	
	//Create or List car for sale. This option is available only for registered sellers
	async function createCarSale() {
		
		//Validate VIN
		let carSaleVIN = $('#carSaleVINId').val();		
		if(!carSaleVIN || !carSaleVIN.trim().length > 0 ){
			showError("Invalid VIN.");
			return;
		}
		
		//Validate Make
		let carSaleMake = $('#carSaleMakeId option:selected').attr('id');
		if(!carSaleMake || !carSaleMake.trim().length > 0 ){
			showError("Invalid Make.");
			return;
		}
		
		//Validate Model
		let carSaleModel = $('#carSaleModelId').val();		
		if(!carSaleModel || !carSaleModel.trim().length > 0 ){
			showError("Invalid Model.");
			return;
		}
		
		//Validate Model Year
		let carSaleYear = $('#carSaleYearId').val();
		if(!carSaleYear){
			showError("Invalid model Year.");
			return;
		}
		carSaleYear = parseInt(carSaleYear);		
		if(!(carSaleYear > parseInt(2000))){
			showError("Your car must be greater than model year 2000.");
			return;
		}
		
		//Validate Sale Price
		let carSalePrice = $('#carSalePriceId').val();
		if(!carSalePrice){
			showError("Invalid listed price.");
			return;
		}		
		carSalePrice = parseInt(carSalePrice);
		if(!(carSalePrice >parseInt(100000))){
			showError("Car price must be greater that 10000.");
			return;
		}
		
		//Validate Type
		let carType = $('#carTypeId option:selected').attr('id');
		if(!carType || !carType.trim().length > 0 ){
			showError("Invalid Type.");
			return;
		}
		
		//Validate image		
		let carImageForUpload = $('#carImageForUpload').val();		
		if(!carImageForUpload || !carImageForUpload.trim().length > 0 ){
			showError("Invalid Image.");
			return;
		}
		
		console.log(carSaleVIN + ' : ' + carSaleMake + ' : ' + carSaleModel + ' : ' + carSaleYear + ' : ' + carSalePrice + ' : ' + carType);

		try {
			//validate metamask
			let metamaskCheckMsg = checkMetamask();		
			if(metamaskCheckMsg !== "SUCCESS") {		
				return showError(metamaskCheckMsg);
			}
			let account = web3.eth.accounts[0];			
			
			console.log('metamask account: ', account);
			
			// Logged in user must use the same metamask account he had registered initially
			if(sessionStorage.metamaskAccount !== account){
				return showError("Invalid metamask account detected for the current user !!");
			}
			
			//create car market place contract using metmask web3 library
			let carMarketplaceContract = web3.eth.contract(carMarketplaceContractABI).at(carMarketplaceContractAddress);
			console.log('carMarketplaceContract: ', carMarketplaceContract);
			
			//Before buying car, make sure the marketplace is not shutdown (contract not killed)
			let carCount = await carMarketplaceContractEthers.carCount();
			if(!carCount)
				return showError("Marketplace is shutdown and cannot buy/sell car!!");
			
			//validate image
			if($('#carImageForUpload')[0].files.length === 0) {
				return showError("Please select a file to upload");
			}
			
			//Load the image and store it in IPFS
			let fileReader = new FileReader();
			fileReader.onload = function () {			
				let fileBuffer = Buffer.from(fileReader.result);			

				//Add image to IPFS
				IPFS.files.add(fileBuffer, (err, result) => {
					if(err)
						return showError('Error while adding files to IPFS: ' + err);
					if(result) {
						let imageIpfsHash = result[0].hash;
						console.log('Image added to IPFS successfully with hash: ', imageIpfsHash);
						
						//After image is stored, below car related JSON data is stored in IPFS
						let ipfsCarInfo = JSON.stringify({
							vin: carSaleVIN,
							make: carSaleMake,
							model: carSaleModel,
							year: carSaleYear,
							type: carType,
							sellerName: sessionStorage.username
						});
						console.log('ipfsCarInfo: ', ipfsCarInfo);
						
						let ipfsCarInfoFileBuffer = Buffer.from(ipfsCarInfo);												
						
						//Add JSON data to IPFS
						IPFS.files.add(ipfsCarInfoFileBuffer, (err2, result2) => {
							if(err2)
								return showError('Error while adding carInfo JSON to IPFS: ' + err2);
							if(result2) {
								let carInfoIpfsHash = result2[0].hash;
								console.log('carInfo JSON added to IPFS successfully with hash: ', carInfoIpfsHash);
								
								//Call smart contract method to create or list car for sale.
								carMarketplaceContract.createCarForSale(carSaleVIN, carSalePrice, carInfoIpfsHash, imageIpfsHash, function (err, txHash) {
									if (err)
										return showError("Smart contract call failed when creating your car sale: " + err);
									console.log(`Your transaction for listing car sale has been sent. Please wait for confirmation. Transaction hash: ${txHash}`);
									showInfo(`Your transaction for listing car sale has been sent. Please wait for confirmation. Transaction hash: ${txHash}`);
									setTimeout(function () { showView("viewHome"); }, 5000);
								});
								
								//Listen for CarOnSale event from smart contract.
								//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#contract-events
								carMarketplaceContract.CarOnSale(function(error, event) {
									if (error)
										return showError("CarOnSale Event failed : " + error);					
									console.log('CarOnSale event: ', event); 
									showInfo(`Your car has been <b>successfully listed</b> for sale.`);
									setTimeout(function () { showView("viewHome"); }, 5000);									
								});
							}					
						});							
					}
				})	
			};
			fileReader.readAsArrayBuffer($('#carImageForUpload')[0].files[0]);
		
			
		} catch(err) {
			showError("Error while creating car sale. Please try again later.", err);
		} finally {
			hideProgressProgress();
		}
	}

	//handle logout - clear all the session data and display home page
    function logout() {
        sessionStorage.clear();
		showView("viewHome");
    }
	
	
	// Detect metamask account change.	
	try {
		let metamaskAccountChange = web3.eth.accounts[0];	
		function checkMetamaskAccountChange() {
			const loggedIn = sessionStorage.username;
			if(loggedIn){
				console.log(metamaskAccountChange + '   ' + web3.eth.accounts[0]);			
				if ( (web3.eth.accounts[0] !== metamaskAccountChange) && (metamaskAccountChange !== 'undefined') ) {
					metamaskAccountChange = web3.eth.accounts[0];
					console.log('Account changed and page will be refreshed....');
					location.reload();
				}
			}		
		}
	} catch(err) {
		console.log('Error while running checkMetamaskAccountChange:  ', err);
	}
	
	setInterval(checkMetamaskAccountChange, 5000);

});


