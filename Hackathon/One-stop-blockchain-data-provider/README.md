# 项目介绍
在当前区块链的世界中，虽说区块链的数据是公开的，透明的，但是普通用户想要获取区块链的数据还是很困难。当前普通用户一般是通过区块链浏览器或者钱包来获取链上数据，但是这样有很大的局限性，比如用户只能查到区块链浏览器或者钱包提供的数据，对于区块链上他们没有提供的，但又很有用的数据，用户基本上只能通过写代码与区块链进行交互才能拿到，非常之繁琐以及用户不友好。

The Graph团队给为解决上述问题，建立了一个去中心化索引器网络。索引器可以将区块链上的数据下载下来，将数据进行清洗后，按照自己想要的结构在存储在GraphQL数据库里，并提供了便于外部调用的接口。至于数据怎样清洗、怎样存储、提供怎样的接口，就是subgraph做的事情了。每一个subgraph对应一个合约，处理该合约的所有相关数据。

The Graph的subgraph已经很好的解决了用户难获取到不常用数据的问题，但是对于没有编程经验的普通用户来说，门槛还是太高了。The graph适用于B端用户，但对C端用户还是很不友好。具体有以下两点：

1. 需要了解区块链细节才能开发subgraph拿到区块链的数据：普通程序员需要知道具体的区块链细节，才能编写subgraph，调用api，然后将数据展示在自己的网页上。
2. 跨合约查询很不方便：单个subgraph只对应一个合约，比如我们想查以太坊上某个地址的portfolio，就需要调用多次subgraph才能拿到这个信息。

本项目为了解决上述问题，实现了一个统一的web服务器后端用来处理前端（Telegram Bot，Discord Bot，网页）发送过来的指令，解析指令后，将指令拆分成多个subgraph api调用，等待subgraph api调用完成后，汇总调用结果，合并成最终结果后返回给用户。


## 项目概述
本项目基于thegraph的subgraph，给用户提供一种一站式链上数据查询服务。用户可以通过网页、Telegram Bot、Discord Bot等方式获取链上实时数据。

## 赛道
Open-Source Tools/Infrastructure

## bounty
The graph

## 核心功能

1. 在对用户隐藏区块链的细节的前提下，给用户提供更符合直觉的区块链数据方式
2. 多种易用的用户交互方式，包括Telegram Bot，Discord Bot，网页调用
3. 高度可定制的数据返回方式

## 代码仓库

https://github.com/jeasonzhang-eth/one-stop-blockchain-data-provider

## 项目团队

Full-stack developer：[jeaonzhang](https://github.com/wackerow)

## 历史获奖说明：如果您的项目之前参与过其它 Hackathon 或 有获得过奖项/Grant，请再次说明
无

## Deck 地址

https://xxxx.pdf

## 项目演示
https://discord.gg/T3J7wnYV