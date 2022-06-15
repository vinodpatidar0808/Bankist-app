'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Vinod Patidar',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Gagan Patidar',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Deepak Patidar',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Deekshith Velgapuni Raya',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = movements => {
    containerMovements.innerHTML = '';
    movements.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
                <div class="movements__row">
                    <div class="movements__type movements__type--${type}">
                        ${i + 1} ${type}
                    </div>
                    <div class="movements__date">24/01/2037</div>
                    <div class="movements__value">${mov}₹</div>
                </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
// displayMovements(account1.movements);

const calcDisplayBalance = account => {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = `${account.balance}₹`;
    // account.balance = balance;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = account => {
    const incomes = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, curr) => acc + curr, 0);
    labelSumIn.textContent = `${incomes}₹`;
    const out = Math.abs(
        account.movements
            .filter(mov => mov < 0)
            .reduce((acc, curr) => acc + curr, 0)
    );
    labelSumOut.textContent = `${out}₹`;

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
    labelSumInterest.textContent = `${interest}₹`;
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
    displayMovements(account.movements);
    // display balance
    calcDisplayBalance(account);
    // display summary
    calcDisplaySummary(account);
};

// Event handlers

let currentAccount;

// login feature
btnLogin.addEventListener('click', event => {
    event.preventDefault();
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI and welcome message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        // assignment operator works from right to left
        inputLoginUsername.value = inputLoginPin.value = '';
        // cursor still in focus after logging in so remove it using blur method
        inputLoginPin.blur();

        updateUI(currentAccount);
    }
});

btnClose.addEventListener('click', e => {
    e.preventDefault();
    const pin = Number(inputClosePin.value);
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

//  transfer feature
btnTransfer.addEventListener('click', e => {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
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
        updateUI(currentAccount);
    }
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
