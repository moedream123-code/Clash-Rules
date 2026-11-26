function main(config) {
  return applySyncedClashRules(config);
}

function applySyncedClashRules(config, originalWindowsRules) {
  const raw = "https://raw.githubusercontent.com/moedream123-code/Clash-Rules/main/rules/";
  const sources = [
  {
    "file": "proxy",
    "payload": [
      "DOMAIN,app-measurement.com"
    ]
  },
  {
    "file": "direct",
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
    "payload": [
      "DOMAIN,scp-wiki-cn.wikidot.com",
      "DOMAIN,scp-wiki-cn.wdfiles.com"
    ]
  },
  {
    "file": "gpt-proxy",
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
    "payload": [
      "IP-CIDR,127.0.0.0/8,no-resolve",
      "IP-CIDR6,::1/128,no-resolve"
    ]
  },
  {
    "file": "reject",
    "payload": []
  },
  {
    "file": "apps-gpt",
    "payload": [
      "PROCESS-NAME,com.openai.chatgpt"
    ]
  },
  {
    "file": "apps-sensitive",
    "payload": [
      "PROCESS-NAME,com.instagram.android",
      "PROCESS-NAME,com.instagram.lite",
      "PROCESS-NAME,com.twitter.android",
      "PROCESS-NAME,com.facebook.katana",
      "PROCESS-NAME,com.facebook.lite",
      "PROCESS-NAME,com.facebook.orca",
      "PROCESS-NAME,com.whatsapp",
      "PROCESS-NAME,com.whatsapp.w4b",
      "PROCESS-NAME,org.telegram.messenger",
      "PROCESS-NAME,org.telegram.messenger.web",
      "PROCESS-NAME,com.google.android.apps.bard"
    ]
  },
  {
    "file": "sensitive-domains",
    "payload": [
      "DOMAIN-SUFFIX,threads.net",
      "DOMAIN-SUFFIX,threads.com",
      "DOMAIN-SUFFIX,meta.com",
      "DOMAIN-SUFFIX,meta.ai",
      "DOMAIN-SUFFIX,messenger.com",
      "DOMAIN-SUFFIX,m.me",
      "DOMAIN-SUFFIX,x.com",
      "DOMAIN-SUFFIX,twitter.com",
      "DOMAIN-SUFFIX,twimg.com",
      "DOMAIN-SUFFIX,t.co",
      "DOMAIN-SUFFIX,telegram.org",
      "DOMAIN-SUFFIX,t.me",
      "DOMAIN-SUFFIX,telegram.me",
      "DOMAIN-SUFFIX,telegra.ph",
      "DOMAIN-SUFFIX,telesco.pe",
      "DOMAIN-SUFFIX,gemini.google.com",
      "DOMAIN-SUFFIX,gemini.google",
      "DOMAIN,aistudio.google.com",
      "DOMAIN,ai.google.dev",
      "DOMAIN,generativelanguage.googleapis.com"
    ]
  },
  {
    "file": "meta-upstream",
    "payload": [
      "DOMAIN-SUFFIX,instagram.com",
      "DOMAIN-SUFFIX,cdninstagram.com",
      "DOMAIN-SUFFIX,ig.me",
      "DOMAIN-SUFFIX,facebook.com",
      "DOMAIN-SUFFIX,facebook.net",
      "DOMAIN-SUFFIX,fb.com",
      "DOMAIN-SUFFIX,fb.me",
      "DOMAIN-SUFFIX,fbcdn.net",
      "DOMAIN-SUFFIX,fbsbx.com",
      "DOMAIN,fbcdn-a.akamaihd.net",
      "DOMAIN-SUFFIX,whatsapp.com",
      "DOMAIN-SUFFIX,whatsapp.net",
      "DOMAIN-SUFFIX,wa.me",
      "DOMAIN-SUFFIX,whatsappbrand.com"
    ]
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
  const sensitive = "Clash-Rules-Sensitive";
  const providerName = file => "clash-rules-sync-" + file;
  const ref = (file, policy) => "RULE-SET," + providerName(file) + "," + policy;
  const udpGuard = file => "AND,((NETWORK,UDP),(RULE-SET," + providerName(file) + ")),REJECT";
  const startsWith = prefix => prefix.every((rule, index) => rules[index] === rule);

  if (!Array.isArray(rules) || !groups.some(group => group.name === flyint)) {
    console.warn("Clash-Rules requires a rule list and the FlyintPro group.");
    return config;
  }

  let extraGroups = [];
  const names = new Set([...groups, ...proxies].map(item => item.name));
  if (!groups.some(group => group.name === gpt)) {
    if (originalWindowsRules || fallbackGroups.some(group => names.has(group.name))) {
      console.warn("Clash-Rules could not resolve the GPT-Proxy group.");
      return config;
    }
    extraGroups = fallbackGroups;
  }

  const oldPrefix = [
    ref("proxy", flyint),
    ref("direct", "DIRECT"),
    ref("proxy-scp", flyint),
    ...(originalWindowsRules ? originalWindowsRules.slice(11, 18) : []),
    ref("gpt-proxy", gpt),
    ref("direct-loopback", "DIRECT"),
    ...(originalWindowsRules ? originalWindowsRules.slice(33, 35) : []),
    ref("reject", "REJECT"),
  ];
  const protect = (file, policy) => [ref(file, policy), udpGuard(file)];
  const gptIndex = oldPrefix.indexOf(ref("gpt-proxy", gpt));
  const prefix = [
    ...protect("apps-gpt", gpt),
    ...protect("apps-sensitive", sensitive),
    // Existing Windows DIRECT process rules still take precedence over domain-only matching.
    ...oldPrefix.slice(0, gptIndex),
    ...protect("sensitive-domains", sensitive),
    ...protect("meta-upstream", sensitive),
    ...protect("gpt-proxy", gpt),
    ...oldPrefix.slice(gptIndex + 1),
  ];
  let originalRules = rules;
  const alreadySynced = startsWith(prefix);
  if (alreadySynced) {
    originalRules = rules.slice(prefix.length);
  } else if (startsWith(oldPrefix)) {
    originalRules = rules.slice(oldPrefix.length);
  } else if (originalWindowsRules) {
    if (!startsWith(originalWindowsRules)) {
      console.warn("Clash-Rules could not identify the original Windows rule prefix.");
      return config;
    }
    originalRules = rules.slice(originalWindowsRules.length);
  }
  if (originalRules.some(rule => typeof rule === "string" && /^RULE-SET,clash-rules-sync-/.test(rule))) {
    console.warn("Clash-Rules found an existing injection in a different order.");
    return config;
  }
  if (names.has(sensitive) && !alreadySynced) {
    console.warn("Clash-Rules proxy group name is already in use: " + sensitive);
    return config;
  }

  const eligibleTypes = new Set(["vless", "vmess", "trojan", "ss", "hysteria2", "tuic", "wireguard"]);
  const eligible = [...new Set(proxies
    .filter(proxy => proxy.udp === true && !proxy["dialer-proxy"] && eligibleTypes.has(proxy.type))
    .map(proxy => proxy.name))];
  const sensitiveGroup = {
    name: sensitive,
    type: "select",
    proxies: eligible.length ? eligible : ["REJECT"],
    "empty-fallback": "REJECT",
  };

  const providers = {};
  for (const source of sources) {
    const name = providerName(source.file);
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
      // FlClash may normalize provider paths before running a second pass.
      ...(existingProviders[name]?.path ? { path: existingProviders[name].path } : {}),
    };
  }

  config["rule-providers"] = { ...existingProviders, ...providers };
  config.rules = [...prefix, ...originalRules];
  config["proxy-groups"] = [
    ...groups.filter(group => group.name !== sensitive),
    ...extraGroups,
    sensitiveGroup,
  ];
  if (config["find-process-mode"] === "off") config["find-process-mode"] = "strict";
  if (config.dns?.enable !== false && config.dns) {
    const policy = { ...config.dns["nameserver-policy"] };
    for (const file of ["meta-upstream", "sensitive-domains", "gpt-proxy"]) {
      const resolver = "https://1.1.1.1/dns-query#" + (file === "gpt-proxy" ? gpt : sensitive);
      policy["rule-set:" + providerName(file)] = resolver;
      for (const rule of sources.find(source => source.file === file).payload) {
        const [kind, host] = rule.split(",");
        if (kind === "DOMAIN") policy[host] = resolver;
        if (kind === "DOMAIN-SUFFIX") policy["+." + host] = resolver;
      }
    }
    config.dns["nameserver-policy"] = policy;
  }
  return config;
}
