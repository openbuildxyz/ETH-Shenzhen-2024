# UbiBank 

## 项目概述

UbiBank 是一个基于模块化思路构造使用 ERC4626 构造的借贷协议。相比于其他借贷协议，UbiBank 支持用户自定义抵押品、利率以及预言机等模块，这可以构造出更加自定义的链上借贷系统。

## 核心功能

- ERC4626 金库。UbiBank 使用 ERC4626 金库作为系统的核心，所有用户存入的资产都将被转化为 ERC4626 Share
- 通用模块。目前利率模块和预言机模块都支持用户自行构造，构造出的模块只需要符合 UbiBank 的接口即可
- 自定义抵押品。相比于 AAVE 等基于治理的抵押品管理系统，由于 UbiBank 是完全模块化的，所以金库管理者可以自行进行抵押品的添加

## 代码仓库地址

https://github.com/wangshouh/unibank

## 团队成员（名字、Github 地址）

[Shouhao Wang](https://github.com)

### Deck (PPT) 地址

https://github.com/openbuildxyz/ETH-Shenzhen-2024/tree/main/Hackathon/ubibank

### 项目演示

https://github.com/openbuildxyz/ETH-Shenzhen-2024/tree/main/Hackathon/ubibank