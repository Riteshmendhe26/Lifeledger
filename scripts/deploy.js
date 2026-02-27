const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("Deploying DonorContract to Sepolia...");
  
  // Get the ContractFactory
  const DonorContract = await hre.ethers.getContractFactory("DonorContract");
  
  // Deploy the contract
  const donorContract = await DonorContract.deploy();
  
  // Wait for deployment
  await donorContract.waitForDeployment();
  
  const contractAddress = await donorContract.getAddress();
  console.log("DonorContract deployed to:", contractAddress);
  
  // Save contract address to .env
  const envContent = fs.readFileSync('.env', 'utf8');
  const updatedEnvContent = envContent.replace(
    /CONTRACT_ADDRESS=.*/,
    `CONTRACT_ADDRESS=${contractAddress}`
  );
  fs.writeFileSync('.env', updatedEnvContent);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deploymentTime: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address
  };
  
  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  
  // Verify contract on Etherscan (optional)
  if (hre.network.name === "sepolia") {
    console.log("Waiting for block confirmations...");
    await donorContract.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
