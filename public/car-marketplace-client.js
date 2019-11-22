$(document).ready(function () {
    const ethereumProvider = ethers.providers.getDefaultProvider('ropsten');
    //const carMarketplaceContractAddress = "0xbaaa528c6ba3210ae4c4a7afe041f2545882719c";	//V1
	const carMarketplaceContractAddress = "0xf9316ce5cd90f48d6ce95f4852bda45a22d0ee19"; 	//V2
    const carMarketplaceContractABI = [
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
		"name": "owner",
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
				"name": "carCount",
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
				"name": "id",
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
	}
];

	const IPFS = window.IpfsApi('localhost','5001');
	const Buffer = IPFS.Buffer;
	
    const carMarketplaceContractEthers = new ethers.Contract(carMarketplaceContractAddress, carMarketplaceContractABI, ethereumProvider);

    showView("viewHome");

    $('#linkHome').click(function () {
        showView("viewHome");
    });

    $('#linkLogin').click(function () {
		if (window.ethereum) {
			window.ethereum.enable();
		} else {
			return showError("Please install Metamask in your browser to register, login, buy and sell cars.");			
		}
        showView("viewLogin");
    });

    $('#linkRegister').click(function () {
		if (window.ethereum) {
			window.ethereum.enable();
		} else {
			return showError("Please install Metamask in your browser to register, login, buy and sell cars.");			
		}		
        showView("viewRegister");
    });
	
	$('#linkCreateCarSale').click(function () {
		showView("viewCreateCarSale");
	});	

	$('#linkPurchasedCars').click(function () {		
		showView("viewPurchasedCars");
		loadPurchasedCarResults();
	});
	
    $('#linkLogout').click(logout);
	
	//$('#linkSoldId').click(loadCarResults('SOLD'));
	$("#linkSoldId").on("click", function (){		
		loadCarResults('SOLD');
	});
	
	$("#listOfSellersId").on("change", function (){		
		loadCarResults('SELLER');
	});
	
	$("#buttonResetCriteria").on("click", function (){		
		loadCarResults('ALL');
	});

    $('#buttonLogin').click(login);
    $('#buttonRegister').click(register);
	$('#buttonCreateCarSale').click(createCarSale);	

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
        const loggedIn = sessionStorage.jsonWallet;
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
				//console.log('loggedInUsername: ', sessionStorage.username);
				$('#welcomeId').empty();
				$('#welcomeId').text("Welcome " + sessionStorage.username);
			} else {
				$('#welcomeId').empty();
				$('#welcomeId').text("Please login or register in order to buy or sell car (invoke a smart contract).");
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
	
    async function login() {
		
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
		let walletPassword = $('#passwordLogin').val();
		if(!walletPassword || !walletPassword.trim().length > 0 ){
			showError("Invalid password.");
			return;
		}
		
		let backendPassword = CryptoJS.HmacSHA256(username, walletPassword).toString();
		try {
			let result = await $.ajax({
				type: 'POST',
				url: `/login`,
				data: JSON.stringify({username, password: backendPassword}),
				contentType: 'application/json'
			});
			
			sessionStorage['username'] = username;
			sessionStorage['jsonWallet'] = result.jsonWallet;
			sessionStorage['buyerSellerType'] = result.buyerSellerType;			
			showView("viewHome");
			showInfo(`User "${username}" logged in successfully.`);

		} catch(err) {
			showError("Cannot login user. ", err);
		}
    }

    async function register() {
		
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
		
		let walletPassword = $('#passwordRegister').val();		
		if(!walletPassword || !walletPassword.trim().length > 0 ){
			showError("Invalid password.");
			return;
		}
		
		let buyerSellerType = $('#buyerSellerId option:selected').attr('id');		
		
		try {
			let wallet = ethers.Wallet.createRandom();			
			let jsonWallet = await wallet.encrypt(walletPassword, {}, showProgressBox);			
			let backendPassword = CryptoJS.HmacSHA256(username, walletPassword).toString();
						
			let result = await $.ajax({
				type: 'POST',
				url: `/register`,
				data: JSON.stringify({username, password: backendPassword, jsonWallet, buyerSellerType}),
				contentType: 'application/json'
			});
			
			sessionStorage['username'] = username;
			sessionStorage['jsonWallet'] = jsonWallet;
			sessionStorage['buyerSellerType'] = buyerSellerType;
			showView("viewHome");
			showInfo(`User "${username}" registered successfully. Please save your mnemonic: <b>${wallet.mnemonic}</b>`);

		} catch(err) {
			showError("Cannot register user. ", err);
		} finally {
			hideProgressProgress();
		}
    }

    async function loadCarResults(filterCriteria) {
		console.log('filterCriteria: ', filterCriteria);
		
		/*var etherAmount = web3.fromWei(1900000);
		console.log('etherAmount: ', etherAmount);
		var weiAmount = web3.toWei(0.0000000000001,'ether');
		console.log('weiAmount: ', weiAmount);*/
		
        try {
			let selectedSellerName;
			if(filterCriteria === 'SELLER'){
				selectedSellerName = $('#listOfSellersId option:selected').attr('id');
				if(selectedSellerName === 'all')
					filterCriteria = 'ALL';
			}
		
			let carCount = await carMarketplaceContractEthers.carCount();
			carCount = parseInt(carCount);
			console.log('carCount: ', carCount);
			let carResultsUl = $('#carResults').empty();
			if(carCount > 0 ){
				for (let i = 1; i <= carCount; i++) {
					let car = await carMarketplaceContractEthers.carsMap(i);
					
					//let carPriceInEther = web3.fromWei(car.price);
					//console.log('carId:' + i + '  carPriceInEther: '+ carPriceInEther);
					
					let carOwner = car.owner;
					
					let carInfoJson = JSON.parse(await IPFS.cat(car.carInfoIpfsHash));				
					console.log('CarInfoJson retrieved from IPFS: ', carInfoJson);

					if(filterCriteria === 'SOLD'){
						if(!car.purchased)
							continue;
					} else if(filterCriteria === 'SELLER'){						
						//console.log('selectedSellerName: ', selectedSellerName);
						//console.log('carInfoJson.sellerName: ', carInfoJson.sellerName);
						if(!(carInfoJson.sellerName === selectedSellerName))
							continue;
					}
					
					if(car.purchased) {
						let li = $('<li>').html(`<b>Vehicle ${i}</b>: from ${carInfoJson.sellerName} <br/> ` +
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Vin:</b> ${car.vin} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Make:</b> ${carInfoJson.make} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Model:</b> ${carInfoJson.model} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Year:</b> ${carInfoJson.year} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Price:</b> ${car.price} (in WEI)<br/>  ` + 
						`<img src='https://ipfs.io/ipfs/QmQxt6JEqzdmmcDu7yM3dBXM8Gs7DrXNxvUZ11agxx2Kja' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/><br/><br/>`);
						li.appendTo(carResultsUl);
					} else {
						let li = $('<li>').html(`<b>Vehicle ${i}</b>: <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Seller:</b> ${carInfoJson.sellerName} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Vin:</b> ${car.vin} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Make:</b> ${carInfoJson.make} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Model:</b> ${carInfoJson.model} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Year:</b> ${carInfoJson.year} <br/> ` + 
						`&nbsp;&nbsp;&nbsp;&nbsp;<b>Price:</b> ${car.price} (in WEI)<br/> ` + 
						`<img src='https://ipfs.io/ipfs/${car.imageIpfsHash}' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/>`);
						
						
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
							li.append('<br/><br/><br/>');		
						}
						li.appendTo(carResultsUl);
					}
				}				
			} else {
				let li = $('<li>').html("No cars are available for sale right now. Please check back later.");
				li.appendTo(carResultsUl);
				
			}
			
					
			
			/*for (let index = 0; index < candidatesCount; index++) {
				let candidate = await votingContract.getCandidate(index);
				let votes = await votingContract.getVotes(index);
				candidates.push({candidate, votes});
			}
			
			let votingResultsUl = $('#votingResults').empty();
			for (let index = 0; index < candidatesCount; index++) {
				let candidate = candidates[index];
				let li = $('<li>').html(`${candidate.candidate} -> ${candidate.votes} votes`);
				if (sessionStorage['username']) {
					let button = $(`<input type="button" value="vote">`);
					button.click(function () {
						vote(index, candidate.candidate)
					});
					li.append(button);
				}
				li.appendTo(votingResultsUl);
			}*/
		}
		catch (err) {
			showError(err);
		}
    }
	
	async function loadPurchasedCarResults() {
		
        try {			
		
			// Make sure metamask has been logged in and has a valid account
			let account = web3.eth.accounts[0];
			if(!account)
				return showError("Please unlock Metamask in your browser to register, login, buy and sell cars.");		
			
			
			let carCount = await carMarketplaceContractEthers.carCount();
			carCount = parseInt(carCount);
			console.log('carCount: ', carCount);
			let carResultsUl = $('#purchasedCarResults').empty();
			if(carCount > 0 ){
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
						`<img src='https://ipfs.io/ipfs/${car.imageIpfsHash}' alt='${carInfoJson.make} ${carInfoJson.model}' style='width:400px;height:200px;' > <br/><br/><br/>`);
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

    async function vote(candidateIndex, candidateName) {
        /*try {
			let jsonWallet = sessionStorage['jsonWallet'];
			let walletPassword = prompt("Enter your wallet password:");
			
			let wallet = await ethers.Wallet.fromEncryptedWallet(jsonWallet, walletPassword, showProgressBox);
			let privateKey = wallet.privateKey;
			const votingContract = new ethers.Contract(votingContractAddress, votingContractABI, new ethers.Wallet(privateKey, ethereumProvider));
			let votingResult = await votingContract.vote(candidateIndex);
			let tranHash = votingResult.hash;
			showInfo(`Voted successfully for: ${candidateName}. ` + 
				`See the transaction: <a href="https://ropsten.etherscan.io/tx/${tranHash}" target="_blank">${tranHash}</a>`);
		}
		catch (err) {
			showError(err);
		}
		finally {
			hideProgressProgress();
		}*/
    }
	
	function buyCarFromSeller(carId, carPrice, carOwner) {	
		
		carId = parseInt(carId);
		if(!(carId > 0)){
			showError("Invalid carId.");
			return;
		}
		
		console.log('About to buy car from seller with ID: ' + carId + ' for price: ' + carPrice);
		
		try{
			let metamaskCheckMsg = checkMetamask();		
			if(metamaskCheckMsg !== "SUCCESS") {		
				return showError(metamaskCheckMsg);
			}
			let account = web3.eth.accounts[0];			
			
			console.log('metamask account: ', account);
			
			if(account === carOwner.toLowerCase()){
				return showError("Invalid buyer !! Are you the seller ?");	
			}

			let carMarketplaceContract = web3.eth.contract(carMarketplaceContractABI).at(carMarketplaceContractAddress);
			console.log('carMarketplaceContract: ', carMarketplaceContract);
			
			//https://ethereum.stackexchange.com/questions/45398/call-a-payable-function-and-pay-ether-with-metamask			
			//var etherAmount = web3.toBigNumber($("#id_of_field_with_ether_value").val());
			//var etherAmount = web3.fromWei(carPrice);
			//console.log('etherAmount: ', etherAmount);
			//var weiAmount = web3.toWei(etherAmount,'ether');
			//console.log('weiAmount: ', weiAmount);
   			
			carMarketplaceContract.buyCarFromSeller(carId, {from: account, value: carPrice}, function (err, txHash) {
				if (err)
					return showError("Smart contract call failed when buying car from seller: " + err);				
				console.log(`Your transaction for purchasing the car from seller has been sent. Transaction hash: ${txHash}`);
				showInfo(`Your transaction for purchasing the car from seller has been sent. Transaction hash: ${txHash}`);					
			});
			
			//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#contract-events
			carMarketplaceContract.CarPurchasedFromSeller(function(error, event) {
				if (error)
					return showError("CarPurchasedFromSeller Event failed : " + error);					
				console.log('CarPurchasedFromSeller event: ', event); 
				showInfo(`Your car has been <b>successfully purchased</b> from seller.`);							
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
	
	function createCarSale() {
		
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
			let metamaskCheckMsg = checkMetamask();		
			if(metamaskCheckMsg !== "SUCCESS") {		
				return showError(metamaskCheckMsg);
			}
			let account = web3.eth.accounts[0];			
			
			console.log('metamask account: ', account);
			
			let carMarketplaceContract = web3.eth.contract(carMarketplaceContractABI).at(carMarketplaceContractAddress);
			console.log('carMarketplaceContract: ', carMarketplaceContract);
			
			if($('#carImageForUpload')[0].files.length === 0) {
				return showError("Please select a file to upload");
			}
			
			let fileReader = new FileReader();
			fileReader.onload = function () {			
				let fileBuffer = Buffer.from(fileReader.result);			

				IPFS.files.add(fileBuffer, (err, result) => {
					if(err)
						return showError('Error while adding files to IPFS: ' + err);
					if(result) {
						let imageIpfsHash = result[0].hash;
						console.log('Image added to IPFS successfully with hash: ', imageIpfsHash);
						
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
						
						IPFS.files.add(ipfsCarInfoFileBuffer, (err2, result2) => {
							if(err2)
								return showError('Error while adding carInfo JSON to IPFS: ' + err2);
							if(result2) {
								let carInfoIpfsHash = result2[0].hash;
								console.log('carInfo JSON added to IPFS successfully with hash: ', carInfoIpfsHash);
								
								carMarketplaceContract.createCarForSale(carSaleVIN, carSalePrice, carInfoIpfsHash, imageIpfsHash, function (err, txHash) {
									if (err)
										return showError("Smart contract call failed when creating your car sale: " + err);
									console.log(`Your transaction for listing car for sale has been sent. Transaction hash: ${txHash}`);
									showInfo(`Your transaction for listing car for sale has been sent. Transaction hash: ${txHash}`);							
								});
								
								//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#contract-events
								carMarketplaceContract.CarOnSale(function(error, event) {
									if (error)
										return showError("CarOnSale Event failed : " + error);					
									console.log('CarOnSale event: ', event); 
									showInfo(`Your car has been <b>successfully listed</b> for sale.`);					
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

    function logout() {
        sessionStorage.clear();
		showView("viewHome");
    }
	
	let metamaskAccountChange;
	function checkMetamaskAccountChange() {
		const loggedIn = sessionStorage.jsonWallet;
		if(loggedIn){
			//alert(metamaskAccountChange + '   ' + web3.eth.accounts[0]);			
			if ( (web3.eth.accounts[0] !== metamaskAccountChange) && (metamaskAccountChange !== 'undefined') ) {
				metamaskAccountChange = web3.eth.accounts[0];
				console.log('Account changed....');
				location.reload();
			}
		}		
	}
	
	//setInterval(checkMetamaskAccountChange, 5000);

});


