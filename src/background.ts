chrome.tabs.onCreated.addListener((tab: chrome.tabs.Tab) => {
  chrome.storage.local.get(['openerTabIdMap'], async result => {
    const openerTabIdMap = result.openerTabIdMap || {}
    if(tab.pendingUrl !== "chrome://newtab/" && tab.openerTabId) {
      openerTabIdMap[tab.id as number] = tab.openerTabId
    }

    chrome.storage.local.set({ openerTabIdMap });

    // send message to the sidePanel to refresh everytime there's a change
    await chrome.runtime.sendMessage<AdditionMessageInterface>({action: "REFRESH", type: "CREATE", identifierOrTab: tab});
  })
})

chrome.tabs.onRemoved.addListener((removedTabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
  chrome.storage.local.get(['openerTabIdMap'], async result => {
    const openerTabIdMap = result.openerTabIdMap || {}
    const openerTabId = openerTabIdMap[removedTabId]
    Object.keys(openerTabIdMap).forEach(key => {
      // key is string, need to convert to number for comparison if keys are stored as numbers
      // But object keys are always strings in JS.
      // If openerTabIdMap values are tabIds (numbers).
      if(openerTabIdMap[key] === removedTabId) {
          if (openerTabId) {
            openerTabIdMap[key] = openerTabId
          } else {
            delete openerTabIdMap[key]
          }
      }
    });
    delete openerTabIdMap[removedTabId]
    chrome.storage.local.set({ openerTabIdMap });

    // send message to the sidePanel to refresh everytime there's a change
    await chrome.runtime.sendMessage<DeleteTabMessageInterface>({action: "REFRESH", type: "DELETE",identifierOrTab: removedTabId});
  })
})

chrome.tabs.onUpdated.addListener( async (_, __, tab: chrome.tabs.Tab) => {
  await chrome.runtime.sendMessage<AdditionMessageInterface>({action: "REFRESH", type: "UPDATE", identifierOrTab: tab});
})

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

