'use strict';

import './popup.css';

const save_options = () => {
  const enabled = document.getElementById("enabled").value
  const username = document.getElementById("username").value
  const domain = document.getElementById("domain").value
  const aliasPrefix = document.getElementById("aliasPrefix").value
  const useSLD = document.getElementById("useSLD").checked
  const b64conversionEnabled = document.getElementById(
    "b64conversionEnabled"
  ).checked
  chrome.storage.sync.set(
    {
      enabled,
      username,
      domain,
      aliasPrefix,
      useSLD,
      b64conversionEnabled,
    },
    () => {
      const status = document.getElementById("status")
      status.textContent = "Options saved."
      setTimeout(() => {
        status.textContent = ""
      }, 750)
    }
  )
}

const restore_options = () => {
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
      document.getElementById("enabled").checked = items.enabled
      document.getElementById("username").value = items.username
      document.getElementById("domain").value = items.domain
      document.getElementById("aliasPrefix").value = items.aliasPrefix
      document.getElementById("useSLD").checked = items.useSLD
      document.getElementById("b64conversionEnabled").checked =
        items.b64conversionEnabled
    }
  )
}

const decodeText = () => {
  const encodedText = document.getElementById("b64text").value
  const decoded_utf8str = atob(encodedText)
  const decoded_array = new Uint8Array(Array.prototype.map.call(decoded_utf8str, c => c.charCodeAt()))
  const decoded = new TextDecoder().decode(decoded_array)

  document.getElementById("decodedText").textContent = `Result: ${decoded}`
}

document.addEventListener("DOMContentLoaded", restore_options)
document.getElementById("save").addEventListener("click", save_options)
document.getElementById("decode").addEventListener("click", decodeText)
