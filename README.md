# Choices: A decentralized Voting Application

Choices is a decentralized voting web application, developed on blockchain technology. It uses smart contracts and technologies such as MetaMask for authentication and secure voting. This system is designed to be rigid and immune to tampering for electios and polls in general.

### Note: Before downloading the Repository please have The MetaMask Chrome Plugin installed.


## Getting Started

### 1. Clone the git repositroy
git clone https://github.com/MohsinRehman12/decentralized-voting-app.git

### 2. Navigate to the project directory and Install Dependencies
cd decentralized-voting-app
npm install

### 3. Compile hardhat files and then Local Etherum server

cd decentralized-voting-app
npx hardhat compile
npx hardhat node


### 4. Add Hardhat Network To Metamask with the Setting shown below
![image](https://github.com/user-attachments/assets/befeea3a-618b-43a2-80bf-0df14db793f1)
![image](https://github.com/user-attachments/assets/eb38ba8e-a0f6-4a36-94ad-39eb6febdd0e)


### 5. Copy the private key for accounts given in hardhat nodes output to metamask, and switch to one of them
![image](https://github.com/user-attachments/assets/d414dccd-4853-4a98-b188-f861f788ba32)

### 6. Run the deploy the contract and copy the address of the contract from the output
cd decentralized-voting-app
npx hardhat run ignition/modules/deploy.js --network localhost

![image](https://github.com/user-attachments/assets/204467ad-2afe-4b99-ba39-acf7066b2a2e)

### 7. Go to context/constants.js and copy the address there as show below

![image](https://github.com/user-attachments/assets/b843883c-8266-4462-ab76-4af0083b960d)

### 8. Run the application using npm start and on metamask ensure each account is connected to Localhost:3000
cd decentralized-voting-app
npm start

![image](https://github.com/user-attachments/assets/5ce80e2c-7276-402e-b234-ab72fe983dc5)


