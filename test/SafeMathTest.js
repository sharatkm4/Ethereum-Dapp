const SafeMathMock = artifacts.require('SafeMathMock');
const BN = web3.utils.BN;
const MAX_UINT256 = new BN('2').pow(new BN('256')).sub(new BN('1'));

contract("SafeMath", async accounts => {
	
	let safeMath;
	
	beforeEach(async () => {
		safeMath = await SafeMathMock.new();	
	});
	
	/*it('adds correctly with overflow', async function () {
			//console.log(MAX_UINT256);		
			assert.equal(await carMarketPlace.buyCarFromSeller2.call(2,3), 5);
					
			try {			
				let tx = await carMarketPlace.buyCarFromSeller2.call(MAX_UINT256,1);
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
	});*/
	
	
	describe('mul', function () {
		it('multiplies correctly', async function () {
			const a = new BN('123');
			const b = new BN('567');
			
			assert.equal(await safeMath._safeMathMultiply.call(a,b), a.mul(b).toString());			
		});

		it('multiplies by zero correctly', async function () {
			const a = new BN('0');
			const b = new BN('5678');

			assert.equal(await safeMath._safeMathMultiply.call(a,b), '0');
		});		

		it('reverts on multiplication overflow', async function () {
			const a = MAX_UINT256;
			const b = new BN('2');

			try {	
				let tx = await safeMath._safeMathMultiply.call(a,b);
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}			
		});
	});
	
	describe('div', function () {
		it('divides correctly', async function () {
			const a = new BN('5678');
			const b = new BN('5678');

			assert.equal(await safeMath._safeMathDivide.call(a,b), a.div(b).toString());			
		});

		it('divides zero correctly', async function () {
			const a = new BN('0');
			const b = new BN('5678');

			assert.equal(await safeMath._safeMathDivide.call(a,b), '0');
		});

		it('returns complete number result on non-even division', async function () {
			const a = new BN('7000');
			const b = new BN('5678');

			assert.equal(await safeMath._safeMathDivide.call(a,b), '1');
		});

		it('reverts on division by zero', async function () {
			const a = new BN('5678');
			const b = new BN('0');

			try {	
				let tx = await safeMath._safeMathDivide.call(a,b);
				assert.fail();
			} catch (err) {
				assert.ok(/revert/.test(err.message));
			}
		});
	});
	
	
	
});