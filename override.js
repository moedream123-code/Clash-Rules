function main(config) {
  return applySyncedClashRules(config);
}

function applySyncedClashRules(config, originalWindowsRules) {
  const raw = "https://raw.githubusercontent.com/moedream123-code/Clash-Rules/main/rules/";
  const sources = [
  {
    "file": "proxy",
    "policy": "FlyintPro",
    "payload": [
      "DOMAIN,app-measurement.com"
    ]
  },
  {
    "file": "direct",
    "policy": "DIRECT",
    "payload": [
      "DOMAIN,login.live.com",
      "DOMAIN,login.microsoftonline.com",
      "DOMAIN-SUFFIX,auth.xboxlive.com",
      "DOMAIN,sisu.xboxlive.com",
      "DOMAIN,api.minecraftservices.com",
      "DOMAIN,api.mojang.com",
      "DOMAIN,sessionserver.mojang.com",
      "DOMAIN,textures.minecraft.net"
    ]
  },
  {
    "file": "proxy-scp",
    "policy": "FlyintPro",
    "payload": [
      "DOMAIN,scp-wiki-cn.wikidot.com",
      "DOMAIN,scp-wiki-cn.wdfiles.com"
    ]
  },
  {
    "file": "gpt-proxy",
    "policy": "GPT-Proxy",
    "payload": [
      "DOMAIN-SUFFIX,openai.com",
      "DOMAIN-SUFFIX,chatgpt.com",
      "DOMAIN-SUFFIX,oaistatic.com",
      "DOMAIN-SUFFIX,oaiusercontent.com",
      "DOMAIN-SUFFIX,oaistatsig.com",
      "DOMAIN,cdn.openaimerge.com",
      "DOMAIN,cdn.workos.com",
      "DOMAIN,forwarder.workos.com",
      "DOMAIN,frontend-apps-multi-region.workos.com",
      "DOMAIN,images.workoscdn.com",
      "DOMAIN,setup.workos.com",
      "DOMAIN,workos.imgix.net",
      "DOMAIN,challenges.cloudflare.com"
    ]
  },
  {
    "file": "direct-loopback",
    "policy": "DIRECT",
    "payload": [
      "IP-CIDR,127.0.0.0/8,no-resolve",
      "IP-CIDR6,::1/128,no-resolve"
    ]
  },
  {
    "file": "reject",
    "policy": "REJECT",
    "payload": []
  }
];
  const fallbackGroups = [
  {
    "type": "fallback",
    "url": "https://api.openai.com/v1/models",
    "interval": 300,
    "lazy": true,
    "timeout": 6000,
    "expected-status": "401",
    "empty-fallback": "REJECT",
    "name": "GPT-Proxy",
    "proxies": [
      "GPT-TW",
      "GPT-JP",
      "GPT-KR"
    ]
  },
  {
    "type": "fallback",
    "url": "https://api.openai.com/v1/models",
    "interval": 300,
    "lazy": true,
    "timeout": 6000,
    "expected-status": "401",
    "empty-fallback": "REJECT",
    "name": "GPT-TW",
    "include-all-proxies": true,
    "exclude-type": "direct",
    "filter": "(?i)^(Taiwan|台湾|台灣)"
  },
  {
    "type": "fallback",
    "url": "https://api.openai.com/v1/models",
    "interval": 300,
    "lazy": true,
    "timeout": 6000,
    "expected-status": "401",
    "empty-fallback": "REJECT",
    "name": "GPT-JP",
    "include-all-proxies": true,
    "exclude-type": "direct",
    "filter": "(?i)^(Japan|日本)"
  },
  {
    "type": "fallback",
    "url": "https://api.openai.com/v1/models",
    "interval": 300,
    "lazy": true,
    "timeout": 6000,
    "expected-status": "401",
    "empty-fallback": "REJECT",
    "name": "GPT-KR",
    "include-all-proxies": true,
    "exclude-type": "direct",
    "filter": "(?i)^(SouthKorea|Korea|韩国|韓國)"
  }
];
  const rules = config.rules;
  const groups = config["proxy-groups"] || [];
  const proxies = config.proxies || [];
  const existingProviders = config["rule-providers"] || {};
  const flyint = "FlyintPro";
  const gpt = "GPT-Proxy";

  if (!Array.isArray(rules) || !groups.some(group => group.name === flyint)) {
    console.warn("Clash-Rules requires a rule list and the FlyintPro group.");
    return config;
  }

  let extraGroups = [];
  if (!groups.some(group => group.name === gpt)) {
    const names = new Set([...groups, ...proxies].map(item => item.name));
    if (originalWindowsRules || fallbackGroups.some(group => names.has(group.name))) {
      console.warn("Clash-Rules could not resolve the GPT-Proxy group.");
      return config;
    }
    extraGroups = fallbackGroups;
  }

  const providerRules = [];
  const providers = {};
  for (const source of sources) {
    const name = "clash-rules-sync-" + source.file;
    const url = raw + source.file + ".yaml";
    if (existingProviders[name] && existingProviders[name].url !== url) {
      console.warn("Clash-Rules provider name is already in use: " + name);
      return config;
    }
    providers[name] = {
      type: "http",
      behavior: "classical",
      format: "yaml",
      path: "./rules/clash-rules-sync/" + source.file + ".yaml",
      url,
      proxy: flyint,
      interval: 3600,
      payload: source.payload,
    };
    providerRules.push("RULE-SET," + name + "," + source.policy);
  }

  // The Windows-only rules stay at their original boundaries.
  const prefix = [
    ...providerRules.slice(0, 3),
    ...(originalWindowsRules ? originalWindowsRules.slice(11, 18) : []),
    ...providerRules.slice(3, 5),
    ...(originalWindowsRules ? originalWindowsRules.slice(33, 35) : []),
    providerRules[5],
  ];

  if (prefix.every((rule, index) => rules[index] === rule) &&
      Object.keys(providers).every(name => existingProviders[name])) {
    return config;
  }
  if (rules.some(rule => typeof rule === "string" &&
      /^RULE-SET,clash-rules-sync-/.test(rule))) {
    console.warn("Clash-Rules found an existing injection in a different order.");
    return config;
  }

  let originalRules = rules;
  if (originalWindowsRules) {
    if (!originalWindowsRules.every((rule, index) => rules[index] === rule)) {
      console.warn("Clash-Rules could not identify the original Windows rule prefix.");
      return config;
    }
    originalRules = rules.slice(originalWindowsRules.length);
  }

  config["rule-providers"] = { ...existingProviders, ...providers };
  config.rules = [...prefix, ...originalRules];
  if (extraGroups.length > 0) {
    config["proxy-groups"] = [...groups, ...extraGroups];
  }
  return config;
}
