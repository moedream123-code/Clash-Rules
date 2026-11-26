# Clash-Rules

Windows Clash Verge Rev 与 Android FlClash 0.9.4 共用的 Mihomo 分流规则。以对应订阅里已有的 `FlyintPro` 策略组下载规则集，刷新间隔为 3600 秒。

| 规则文件 | 目标策略 | 用途 |
| --- | --- | --- |
| `rules/proxy.yaml` | `FlyintPro` | 应用测量域名的既有精确匹配 |
| `rules/direct.yaml` | `DIRECT` | Microsoft、Xbox 和 Minecraft 登录服务 |
| `rules/proxy-scp.yaml` | `FlyintPro` | SCP 两个站点的既有精确匹配 |
| `rules/gpt-proxy.yaml` | `GPT-Proxy` | ChatGPT 和依赖服务 |
| `rules/direct-loopback.yaml` | `DIRECT` | IPv4、IPv6 回环地址，保留 `no-resolve` |
| `rules/reject.yaml` | `REJECT` | 自定义拦截预留，空条目对应零条规则 |

拆分同一策略的两个文件是为了保留交错的规则优先级。Clash Verge Rev 的订阅级扩展脚本另行保留 Windows 进程规则。原订阅的广告规则继续生效，例如 `googleadservices.com` 仍命中 `adservice` 关键字并被拒绝。

## FlClash 0.9.4

打开正在使用的订阅，进入「扩展 → 脚本 → 前往配置脚本」，选择「＋ → 通过URL导入」，粘贴以下地址。返回订阅扩展页，在「扩展脚本」中选中已导入的脚本。以后修改 YAML 文件由 Mihomo 每小时获取。修改脚本后，在脚本管理页的菜单点「更新」。

```text
https://raw.githubusercontent.com/moedream123-code/Clash-Rules/main/override.js
```

脚本使用已有的 `FlyintPro` 和 `GPT-Proxy`。如果订阅没有 `GPT-Proxy`，脚本用原有的台湾、日本、韩国 fallback 策略补齐，候选节点从本机订阅动态取得。脚本保留订阅的 DNS、TUN、节点和原规则。

## 更新与回退

规则文件使用 classical YAML。写入匹配类型和匹配值，按需保留 `no-resolve`，策略由覆写脚本中的 `RULE-SET` 引用指定。已下载的规则使用 Mihomo 本地缓存。首次启动且下载失败时使用脚本内置的规则快照。维护规则时同步更新 `override.js` 的对应内置快照，供首次离线启动使用。

Android 可在订阅的「扩展 → 脚本」中取消选中。Windows 恢复原订阅级扩展脚本并重新应用配置即可恢复原始规则。

[FlClash 0.9.4 官方源码](https://github.com/chen08209/FlClash/tree/v0.9.4) · [Mihomo rule-providers 文档](https://wiki.metacubex.one/config/rule-providers/)
