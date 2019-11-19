$(document).ready(function () {
    const ethereumProvider = ethers.providers.getDefaultProvider('ropsten');
    const carMarketplaceContractAddress = "0xc1dcc9e09c708cf915d58b0309e267422b251657";
    const carMarketplaceContractABI = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_vin",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_make",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_model",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_year",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createCarForSale",
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
				"internalType": "string",
				"name": "make",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "model",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
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
				"internalType": "string",
				"name": "make",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "model",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
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
	}
];
    const carMarketplaceContract = new ethers.Contract(carMarketplaceContractAddress, carMarketplaceContractABI, ethereumProvider);

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
		/*web3.eth.getAccounts((err, accounts) => {
			//if (!err && accounts.length > 0){
			if (err || accounts.length == 0){
				return showError("Please unlock Metamask in your browser to register, login, buy and sell cars.");
			}
		});*/	
		/*if (typeof web3 === 'undefined')
			return showError("Please install Metamask to access the Ethereum Web3 API from your web browser");
		}*/
        showView("viewRegister");
    });
	
	$('#linkCreateCarSale').click(function () {
		showView("viewCreateCarSale");
	});	

    $('#linkLogout').click(logout);

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
		//alert(buyerSellerType);
		if(loggedIn && buyerSellerType === 'seller')			
			$('.show-sell-car-after-login').show();
		else 
			$('.show-sell-car-after-login').hide();
        if (viewName === 'viewHome')
            loadVotingResults();
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

    async function login() {
		
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

    async function loadVotingResults() {
        try {
			let candidates = [];
			let candidatesCount = await carMarketplaceContract.carCount();
			//alert(candidatesCount);
			let votingResultsUl = $('#votingResults').empty();
			for (var i = 1; i <= candidatesCount; i++) {
				let car = await carMarketplaceContract.carsMap(i);
				if(!car.purchased) {
					let li = $('<li>').html(`<b>Vehicle</b> ${i}: <b>Vin:</b> ${car.vin} <b>Make:</b> ${car.make} <b>Model:</b> ${car.model} <b>Year:</b> ${car.year} <b>Price:</b> ${car.price} `);
					li.appendTo(votingResultsUl);
				}
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
		
		console.log(carSaleVIN + ' : ' + carSaleMake + ' : ' + carSaleModel + ' : ' + carSaleYear + ' : ' + carSalePrice);

		try {
			// Make sure metamask is installed in the browser
			if (typeof web3 === 'undefined'){
				return showError("Please install Metamask to access the Ethereum Web3 API from your web browser");
			}
			
			// Make sure metamask has been logged in and has a valid account
			let account = web3.eth.accounts[0];
			if(!account)
				return showError("Please unlock Metamask in your browser to register, login, buy and sell cars.");
			
			console.log('metamask account: ', account);
			
			let carMarketplaceContract = web3.eth.contract(carMarketplaceContractABI).at(carMarketplaceContractAddress);
			console.log('carMarketplaceContract: ', carMarketplaceContract);
		
			carMarketplaceContract.createCarForSale(carSaleVIN, carSaleMake, carSaleModel, carSaleYear, carSalePrice, function (err, txHash) {
							if (err)
								return showError("Smart contract call failed when creating your car sale: " + err);
							showInfo(`Your car has been <b>successfully listed</b> for sale. Transaction hash: ${txHash}`);
							showView("viewHome");
						});
		} catch(err) {
			showError("Cannot create car sale. Please try again later.", err);
		} finally {
			hideProgressProgress();
		}
	}

    function logout() {
        sessionStorage.clear();
		showView("viewHome");
    }

});


