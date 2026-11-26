# Clash-Rules

Windows Clash Verge Rev 與 Android FlClash 0.9.4 共用的 Mihomo 分流規則。規則以 HTTP rule-provider 每 3600 秒更新。既有 Raw URL 繼續使用。

## 安裝與更新

在 FlClash 開啟使用中的訂閱，進入「擴展 → 腳本 → 前往配置腳本 → ＋ → 通過URL導入」。返回「擴展腳本」選取 `override`。已匯入上一版的裝置，請在腳本管理頁選擇「更新」一次以啟用新策略組。後續 YAML 更新由 Mihomo 每小時取得。

```text
https://raw.githubusercontent.com/moedream123-code/Clash-Rules/main/override.js
```

Windows 可使用同一份腳本作為訂閱級擴展。若現有訂閱腳本含本機設定，應保留其邏輯併入覆寫。此同步系統的 Windows 部署將原 DNS 腳本和本機進程規則留在本機。

## 分流行為

| 規則檔案 | 策略 | 匹配對象 |
| --- | --- | --- |
| `apps-gpt.yaml` | `GPT-Proxy` | ChatGPT Android 套件 |
| `apps-sensitive.yaml` | `Clash-Rules-Sensitive` | Instagram、X、Facebook、Messenger、WhatsApp、Telegram、Gemini Android 套件 |
| `sensitive-domains.yaml` | `Clash-Rules-Sensitive` | X、Telegram、Gemini、Messenger、Threads 和 Meta 網域 |
| `meta-upstream.yaml` | `Clash-Rules-Sensitive` | Instagram、Facebook、WhatsApp 正式服務與 CDN 的網域子集 |
| `gpt-proxy.yaml` | `GPT-Proxy` | 既有 ChatGPT 及依賴網域 |
| `niconico-jp.yaml` | `Clash-Rules-JP` | Niconico 影片及直播 Android 套件、網站與播放網域 |
| `proxy.yaml`、`proxy-scp.yaml` | `FlyintPro` | 既有測量域名與 SCP 例外 |
| `direct.yaml`、`direct-loopback.yaml` | `DIRECT` | 既有登入例外和回環地址 |
| `reject.yaml` | `REJECT` | 自訂攔截預留 |

套件精確匹配優先於網域，網域規則在原訂閱的關鍵字、CN、GEOIP 和 MATCH 前執行。Windows 明確寫出的本機直連進程仍可優先於純網域規則。ChatGPT 保留 GPT 專用群組，Gemini 使用同一訂閱中僅允許 UDP 代理節點的群組。

`Clash-Rules-Sensitive` 從當前訂閱的代理節點中挑選有明確 `udp: true` 且無 `dialer-proxy` 的可用協議。群組無 `DIRECT` 選項，空群組使用 `REJECT`。若 Mihomo 因節點不支援 UDP 跳過第一道規則，相鄰的 UDP 規則拒絕封包，避免繼續落到後面的直連規則。

`Clash-Rules-JP` 只列出同樣支援 UDP、且節點名稱標註日本的節點。Niconico 的網域查詢使用這個群組。訂閱沒有符合條件的日本節點時，Niconico 規則使用 `REJECT`。

指定網域進入 Mihomo DNS 後，以各自的代理群組請求 DoH。其他 DNS、IPv6 和 TUN 設定沿用客戶端。Android 套件識別需要 FlClash VPN 接管流量。套件排除、系統旁路、App 自帶 DNS 或未進入核心的流量，均受裝置實際設定影響。FlClash 本機新增規則會排在腳本規則之前，避免為這些套件或網域再加直連規則。

## 資料來源及回退

`meta-upstream.yaml` 取自 MetaCubeX 的固定版本，選取常用服務網域和精確 CDN 主機。每小時同步的是本倉庫維護的集合。三份來源分別為 [Instagram](https://github.com/MetaCubeX/meta-rules-dat/blob/ebdf916c315bb0411a7ce323a7a6c002e15146a7/geo/geosite/instagram.yaml)、[Facebook](https://github.com/MetaCubeX/meta-rules-dat/blob/ebdf916c315bb0411a7ce323a7a6c002e15146a7/geo/geosite/facebook.yaml) 和 [WhatsApp](https://github.com/MetaCubeX/meta-rules-dat/blob/ebdf916c315bb0411a7ce323a7a6c002e15146a7/geo/geosite/whatsapp.yaml)。

下載失敗時保留上次成功的快取。首次離線或快取不可用時使用腳本中同版本的內置規則。維護 YAML 時可同步更新腳本中的內置快照，以更新首次離線的回退版本。

Android 在訂閱的「擴展 → 腳本」取消選取即可回退。Windows 恢復原訂閱級擴展腳本，再重新套用訂閱。

[FlClash 0.9.4 原始碼](https://github.com/chen08209/FlClash/tree/v0.9.4) · [Mihomo rule-providers](https://wiki.metacubex.one/config/rule-providers/)
