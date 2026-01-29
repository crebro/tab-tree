
interface RefreshMessageInterface {
    action: "REFRESH",
    type: "CREATE" | "UPDATE" | "DELETE",
    identifierOrTab: chrome.tabs.Tab | number,
}

interface DeleteTabMessageInterface extends RefreshMessageInterface {
    type: "DELETE"
    identifierOrTab: number 
}

interface AdditionMessageInterface extends RefreshMessageInterface {
    type: "CREATE" | "UPDATE",
    identifierOrTab: chrome.tabs.Tab
}

