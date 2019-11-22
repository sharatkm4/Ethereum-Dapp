let userRepo = {
    users: [],

    find: function(username, password) {
        let matchingUsers = this.users.filter(
            u => u.username === username && u.password === password);
        return matchingUsers[0];
    },

    addUser: function(username, password, buyerSellerType, success, error) {
        let existingUser = this.users.filter(
            u => u.username === username)[0];
        if (!existingUser) {
            let user = {username, password, buyerSellerType};
            this.users.push(user);
            success(user);
        }
        else
            error("Username unavailable: " + username);
    },
	
	getAllSellers: function() {
		let sellers = [];
		for(i=0; i<this.users.length; i++){
			let user = this.users[i];
			if(user.buyerSellerType === 'seller'){
				sellers.push(user.username);
			}
		}		
		console.log('getAllSellers: ', sellers);
        return sellers;
    }
};

module.exports = userRepo;
