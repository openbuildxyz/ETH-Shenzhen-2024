## 项目概述

主要赛：General 

Bounty赛道：Bifrost  Vera

Vitalik 最早提出了 Base-rollup 和 Pre-confirmation的概念，Justin Drake 等人也在逐渐推动 Pre-confirmation 相关的架构的发展。目前Preconfirmation 有多个基础设施项目方在提供服务，如 Nethermind, Chainbound, Limechain, Primev, and Espresso等，但这些公司都是服务于 Layer2 的Preconfirmation 方案。

Fat-Preconf-Dapp 是一个直接应用 Preconfirmation 架构，在以太坊一层运行的Dapp框架，即在以太坊主网直接提交交易。

本次黑客松，Fat-Preconf-Dapp 将会提交一个Discord bot ，功能是预测市场和Dex交易，其所有交易架构都会是基于 Preconfirmation 的方案。

总之，Fat-Preconf-Dapp将会是第一个基于 Preconfirmation 的 以太坊主网的预测市场应用。

## 核心功能（4-5 条关键核心要点）

  

1. 预测市场和 Dex 交易 的 Discord Bot（Predictive Market and Dex Trading）
    
    1. Dex交易：利用基于预确认的快速交易确认，用户可以享受接近实时的交易体验，提高了市场操作的效率和效果。
        
    2. 市场预测：Dapp 通过使用 preconfirmation 提供一种能快速响应市场变化的预测工具，加强了市场分析的实时性和准确性。
        
2. 基于预确认的交易处理（Preconfirmation-based Transaction Processing）
    
    1. 利用预确认（Preconfirmation）架构，Fat-Preconf-Dapp 能够快速地确认和执行交易。这种架构允许在提交到以太坊主网前，通过一定的机制预先确认交易的有效性和最终结果，从而显著减少了交易在区块链上的确认时间。
        
    2. 预确认机制：Fat-Preconf-Dapp 提前确认用户的交易批次，通过在链上提前发布这些事务的确认来保证它们在主网上的执行。
        
    3. 效率与及时性：此机制通过定期向构建者发出预确认交易集合以及随后发布到主链，有效减少了因交易等待而产生的延迟，提高了Dapp的响应速度。
        
3. 增强的安全和优化 Gas 费用效率：
    
    1. 通过与以太坊层一直接集成，Fat-Preconf-Dapp 继承了以太坊网络的高安全性和去中心化特征。这样不仅保障了应用的运行安全，还提高了整体的系统稳定性。
        
    2. 通过对交易数据进行预处理和批量处理，可以减少每笔交易对于区块链网络的负担，从而降低了交易费用。在高频交易场景下，如市场预测和Dex交易，这一点尤其关键。

## 代码仓库地址
https://github.com/hash-k-k/Fat-Preconf-Dapp


## 团队成员（名字、Github 地址）

* FatBird，https://github.com/hash-k-k


## 历史获奖说明：如果您的项目之前参与过其它 Hackathon 或 有获得过奖项/Grant，请再次说明

* 没有参加过任何黑客松

## Deck (PPT) 地址，也可直接放在此文件夹下

> https://q6rsx4wom8.feishu.cn/docx/AsETdsl95ohuKrx4ZtSckUSOnig

## 项目演示（录屏 或 可页面的在线访问地址均可）

> 
> Discord bot Name ：Fat-Preconf-Dapp

