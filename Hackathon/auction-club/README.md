## 项目概述
AuctionClub is a smart contract-based auction platform that provides traders with a fair and reliable auction environment. The platform currently supports two auction modes: English auction and Dutch auction. It also offers a variety of trading rules that sellers can freely combine. Additionally, the platform implements an incentive mechanism to provide positive feedback to bidders. Active participation in bidding can earn bidders auction shares and extract huge profits.

## 核心功能

1. Login and Connect Wallet
2. Choose auction mode, support British and Dutch
3. Bidding Mechanism
  - Bidders who bid repeatedly only need to add the difference on top of their initial bid, simplifying the bidding process.
  - Each bid increment must be at least 5% of the starting price.
4. Incentive Mechanism
  - After the auction ends, apart from the successful bidder, other participants will receive 3% of the final price as a reward, distributed according to their bidding funds. The accumulated reward will be added to the balance of the participants who bid when the auction ends.
5. Fund Handling
  - 2% of the final bid price is injected into the fund pool as a platform fee.

## 代码仓库
https://github.com/AuctionClub

## 团队成员
Solidity Contract： [Beavnvvv](https://github.com/Beavnvvv)  
front-end： [Young-Jeff](https://github.com/Young-Jeff)  

## 历史获奖

无。

## 项目链接

https://auctionclub.github.io/frontend/