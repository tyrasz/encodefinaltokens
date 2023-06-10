import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "dotenv/config";
import { MyArbitrageableRomance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";

async function main() {
  const tokenFactory = await ethers.getContractFactory(
    "MyArbitrageableRomance"
  );
  const tokenContract = (await tokenFactory.deploy()) as MyArbitrageableRomance;
  await tokenContract.deployed();

  const [deployer, acc1] = await ethers.getSigners();

  await tokenContract.mint(
    deployer.address,
    ethers.utils.parseUnits("1000", 18)
  );

  await tokenContract.mint(acc1.address, ethers.utils.parseUnits("3000", 18), {
    gasLimit: 1000000,
  });

  //verify contracts
  async function verifyTokenContract(
    hre: HardhatRuntimeEnvironment,
    contractAddress: string
  ) {
    await hre.run("verify:verify", {
      address: contractAddress,
    });
  }

  //actually verify the contract
  const verifyTokenTx = await verifyTokenContract(hre, tokenContract.address);
  console.log(verifyTokenTx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
