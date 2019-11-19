$(document).ready(function () {
    const ethereumProvider = ethers.providers.getDefaultProvider('ropsten');
    const votingContractAddress = "0xc1dcc9e09c708cf915d58b0309e267422b251657";
    const votingContractABI = [
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
    const votingContract = new ethers.Contract(votingContractAddress, votingContractABI, ethereumProvider);

    showView("viewHome");

    $('#linkHome').click(function () {
        showView("viewHome");
    });

    $('#linkLogin').click(function () {
        showView("viewLogin");
    });

    $('#linkRegister').click(function () {
        showView("viewRegister");
    });

    $('#linkLogout').click(logout);

    $('#buttonLogin').click(login);
    $('#buttonRegister').click(register);

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
        let username = $('#usernameLogin').val();
		let walletPassword = $('#passwordLogin').val();
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
			alert(sessionStorage['buyerSellerType']);
			showView("viewHome");
			showInfo(`User "${username}" logged in successfully.`);

		} catch(err) {
			showError("Cannot login user.", err);
		}
    }

    async function register() {
		// validate username
        let username = $('#usernameRegister').val();
		if(!username || !username.trim().length > 0){
			showError("Invalid Username !!");
			return;
		}
		
		let walletPassword = $('#passwordRegister').val();		
		if(!walletPassword || !walletPassword.trim().length > 0 ){
			showError("Invalid password !!");
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
			showError("Cannot register user.", err);
		} finally {
			hideProgressProgress();
		}
    }

    async function loadVotingResults() {
        try {
			let candidates = [];
			let candidatesCount = await votingContract.carCount();
			//alert(candidatesCount);
			let votingResultsUl = $('#votingResults').empty();
			for (var i = 1; i <= candidatesCount; i++) {
				let car = await votingContract.carsMap(i);
				if(!car.purchased) {
					let li = $('<li>').html(`${car.make}`);
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
        try {
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
		}
    }

    function logout() {
        sessionStorage.clear();
		showView("viewHome");
    }

});


