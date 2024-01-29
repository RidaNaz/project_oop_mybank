import inquirer from "inquirer";
import { faker } from "@faker-js/faker"
import chalk from "chalk";

class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNum: number
    accNum: number

    constructor(firstName: string, lastName: string, age: number, gender: string, mobNum: number, accNum: number) {
        this.firstName = firstName
        this.lastName = lastName
        this.age = age
        this.gender = gender
        this.mobNum = mobNum
        this.accNum = accNum
    }
}

interface BankAccount {
    accNum: number
    balance: number
}

class Bank {
    customers: Customer[] = []
    account: BankAccount[] = []

    addCustomer(obj: Customer) {
        this.customers.push(obj)
    }

    addAccountNo(obj: BankAccount) {
        this.account.push(obj)
    }

    transaction(obj: BankAccount) {
        let newAccount = this.account.filter((acc) => acc.accNum !== obj.accNum)
        this.account = [...newAccount, obj]
    }

}

let myBank = new Bank()

for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName()
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number("923#########"))
    const customer = new Customer(fName, lName, 20 * i, "female", num, 1000 + i)
    myBank.addCustomer(customer)
    myBank.addAccountNo({ accNum: customer.accNum, balance: 100000 * i })
}

async function bankService(bank: Bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the services:",
            choices: ["Balance", "Withdraw", "Deposit"]
        })
        if (service.select == "Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your account number"
            })
            let account = myBank.account.find((acc) => acc.accNum == res.number)
            if (!account) {
                console.log(chalk.red.bold("Invalid account number!"))
            }
            if (account) {
                let name = myBank.customers.find((val) => val.accNum == account?.accNum)
                console.log(`Dear ${chalk.green.bold(name?.firstName + " " + name?.lastName)}! Your account balance is Rs ${chalk.blue.bold(account.balance)}`)
            }
        }

        if (service.select == "Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your account number"
            })
            let account = myBank.account.find((acc) => acc.accNum == res.number)
            if (!account) {
                console.log(chalk.red.bold("Invalid account number!"))
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Enter your withdrawl amount:"
                })
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("You have insufficient balance"))
                }
                let newBalance = account.balance - ans.rupee
                bank.transaction({ accNum: account.accNum, balance: newBalance })
            }
        }
        if (service.select == "Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your account number"
            })
            let account = myBank.account.find((acc) => acc.accNum == res.number)
            if (!account) {
                console.log(chalk.red.bold("Invalid account number!"))
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Enter your withdrawl amount:"
                })
                let newBalance = account.balance + ans.rupee
                bank.transaction({ accNum: account.accNum, balance: newBalance })
            }
        }
    }
    while (true)
}

bankService(myBank)