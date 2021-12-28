from brownie import accounts, Faucet, config, network


LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local"]


def get_account():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])


def deploy():
    Faucet.deploy({"from": get_account()})


def add3Funders():
    faucet = Faucet[-1]
    faucet.addFunds({"from": accounts[0], "value": 100000000000000000})
    faucet.addFunds({"from": accounts[1], "value": 100000000000000000})
    faucet.addFunds({"from": accounts[2], "value": 100000000000000000})
    faucet.addFunds({"from": accounts[3], "value": 100000000000000000})


def main():
    deploy()
    add3Funders()
