'use strict';

import * as psl from 'psl'

const get_preferences = (callback) => {
  chrome.storage.sync.get(
    {
      enabled: true,
      username: "example",
      domain: "example.com",
      aliasPrefix: "+",
      useSLD: false,
      b64conversionEnabled: false,
    },
    (items) => {
      callback(items);
    }
  )
}

const toB64 = (string) => {
  let utf8str = String.fromCharCode.apply(null, new TextEncoder().encode(string))
  return btoa(utf8str)
}

const handleGenerateAliasAction = (info, tab) => {
  get_preferences((items) => {
    if (items.enabled) {
      const pageUrl = info.pageUrl || info.frameUrl || tab.url
      if (pageUrl) {
        const hostName = new URL(pageUrl).hostname
        const parsedUrl = psl.parse(hostName)
        const rawAliasPart = items.useSLD ? parsedUrl.sld : parsedUrl.domain
        const aliasPart = items.b64conversionEnabled ? toB64(rawAliasPart) : rawAliasPart
        const aliasedEmailAddress = `${items.username}${items.aliasPrefix}${aliasPart}@${items.domain}`
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: pasteAliasToTab,
          args: [aliasedEmailAddress]
        })
      }
    }
  })
}

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "generate-alias",
    title: "Generate Alias'd E-mail Address",
    contexts: ["all"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleGenerateAliasAction(info, tab)
})

chrome.commands.onCommand.addListener((info, tab) => {
  handleGenerateAliasAction(info, tab)
})

const pasteAliasToTab = (emailAddress) => {
  if (document.activeElement) document.activeElement.value = emailAddress
}