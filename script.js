'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Vinod Patidar',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Gagan Patidar',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (account, sort = false) => {
    // slice to make a  copy of movements array , we could have used spread operator but for chaining we used slice
    const transactions = sort
        ? account.movements.slice().sort((a, b) => a - b)
        : account.movements;
    containerMovements.innerHTML = '';

    transactions.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(account.movementsDates[i]);
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();
        const displayDate = `${day}/${month}/${year}`;
        const html = `
                <div class="movements__row">
                    <div class="movements__type movements__type--${type}">
                        ${i + 1} ${type}
                    </div>
                    <div class="movements__date">${displayDate}</div>
                    <div class="movements__value">${mov.toFixed(2)}₹</div>
                </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
// displayMovements(account1.movements);

const calcDisplayBalance = account => {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${account.balance.toFixed(2)}₹`;
    // account.balance = balance;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = account => {
    const incomes = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, curr) => acc + curr, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}₹`;
    const out = Math.abs(
        account.movements
            .filter(mov => mov < 0)
            .reduce((acc, curr) => acc + curr, 0)
    );
    labelSumOut.textContent = `${out.toFixed(2)}₹`;

    // each account holder has different interest rate
    const interest = account.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * account.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            // returns interests that are greater than 1
            return int > 1;
        })
        .reduce((acc, curr) => acc + curr, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
};
// calcDisplaySummary(account1.movements);

const createUserName = accounts => {
    accounts.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};

createUserName(accounts);
// console.log(accounts);

// display UI/ Update UI
const updateUI = account => {
    // display Movements
    displayMovements(account);
    // display balance
    calcDisplayBalance(account);
    // display summary
    calcDisplaySummary(account);
};

// Event handlers

let currentAccount;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// login feature
btnLogin.addEventListener('click', event => {
    event.preventDefault();
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    // console.log(currentAccount);
    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and welcome message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, 0);
        const month = `${now.getMonth() + 1}`.padStart(2, 0);
        const year = now.getFullYear();
        const hour = `${now.getHours()}`.padStart(2, 0);
        const min = `${now.getMinutes()}`.padStart(2, 0);
        // dd//mm/yy format
        labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        // assignment operator works from right to left
        inputLoginUsername.value = inputLoginPin.value = '';
        // cursor still in focus after logging in so remove it using blur method
        inputLoginPin.blur();

        updateUI(currentAccount);
    }
});

btnClose.addEventListener('click', e => {
    e.preventDefault();
    const pin = +inputClosePin.value;
    const user = inputCloseUsername.value;
    inputClosePin.value = inputCloseUsername.value = '';
    // console.log(user, pin);
    if (pin === currentAccount.pin && user === currentAccount.username) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );
        // console.log(index);
        // delete user
        accounts.splice(index, 1);

        // hide UI/ logout ui
        containerApp.style.opacity = 0;
    }
});

// loan : bank grant loan iff there is atleast one deposit which is atleast 10% of requested loan amount
btnLoan.addEventListener('click', e => {
    e.preventDefault();
    const loanAmount = Math.floor(inputLoanAmount.value);
    inputLoanAmount.value = '';
    if (
        loanAmount > 0 &&
        currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
    ) {
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    }
});

//  transfer feature
btnTransfer.addEventListener('click', e => {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    // console.log(amount, receiverAcc);

    inputTransferAmount.value = inputTransferTo.value = '';
    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // console.log('transfer valid');
        receiverAcc.movements.push(amount);
        currentAccount.movements.push(-amount);
        // add transfer date
        receiverAcc.movementsDates.push(new Date().toISOString());
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    }
});

// sort transactions
// to preserve state of transaction ordering
let sorted = false;
btnSort.addEventListener('click', e => {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
    ['INR', 'Indian Rupees'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
