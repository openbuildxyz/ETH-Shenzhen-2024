
OP-PYOT

### 项目概述

OP-PYOT 是一个 ZKP 证明者市场 （Prover Market）的方案。

OP-PYOT 并非简单的项目方案，而是一项严谨的理论研究 + 一个可行的实现方案设计。

目标场景：为链上zk-协处理器，rollup，链上llm推断等多种用户提供一个高效的证明者市场，为持有zkp专有设备和通用设备的证明者提供公平持续的收入。

主要内容
1）引入乐观机制（Optimistic）与zkp结合，降低证明成本，使得在多数乐观情况下，正确的结果可以被低成本地确认；
2）使用匹配（matching）的手段，使得证明者可以在市场中自由选择要证明的任务（PYOT，Pick-Your-Own-Task），提高市场效率。

意义和贡献
1）为OP-ZK模型的安全性提供了迄今最为严谨的博弈论分析，完全精确计算出了博弈的均衡，指出Validator充当Free Rider的情况无法避免，为现有的Optimistic机制提供了安全性警告和改进指导；
2）使用不同于拍卖的机制来解决证明者市场的问题，提供了一个新的设计思路，达到了理想的性质。


### 核心功能

系统角色：Proposer，Validator，Prover

OP-ZK部分简述：使用了一个新的OP-ZK方案，该方案在多数情况下，Proposer可以不用证明，只需要提交结果，结果的正确性由Validator保证，如果发现错误，Validator需要提交证明，证明Proposer的计算结果是错误的。此部分的重点是对于OP-ZK方案的博弈论分析，我们准确计算出均衡的结构和策略，并且发现，不存在纯策略纳什均衡，而存在可能多个混合策略纳什均衡，Validator充当Free Rider的情况无法避免。因此，我们又设计了ZK证明的市场，使得Validator

PYOT部分简述：我们提出了一个新的证明者市场设计，证明者可以自由选择证明任务，而不是通过拍卖的方式。我们提出了一个匹配的机制，使得证明者可以自由选择证明任务。此外我们的机制提供了一种解决可以让证明者对系统活性的伤害降到可控的程度。


### 代码仓库


### 项目团队

[JC](https://github.com/sun-jc)
[Siyuan](https://github.com/iamliusiyuan)

### Deck 地址

[OP-PYOT-GoogleDrive](https://docs.google.com/presentation/d/19en3Z9mq7diT1ZH168CgrEF8mDXsO-GO9JicM7pEzQU/edit?usp=sharing)

### 项目演示

