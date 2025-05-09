# 2025/05/09 開發紀錄

## 規劃項目

- 發現目前專案缺少「解除訂閱（unsubscribe）」的功能。
- 當 component unmount 時，原本的 listener 沒有被正確移除，可能導致 memory leak。
- 決定補上解除訂閱的功能，以解決上述問題。

## 2025/05/09 CopilotService / messageBridge unsubscribe 機制設計

- 針對 React component unmount 可能造成的 memory leak 問題，設計 subscribe 時回傳一個 unsubscribe function。
- 使用情境：在 React 的 useEffect 內訂閱事件，並於 return 時呼叫 unsubscribe，確保 component unmount 時能正確移除 listener。
- 具體做法：
  - subscribe(eventName, handler) 時，將 handler 加入內部 Map。
  - 回傳一個 function，呼叫時會將 handler 從 Map 移除。
  - React component 內：
    ```tsx
    useEffect(() => {
      const unsubscribe = bridgeRef.current.subscribe('bias', handler);
      return () => unsubscribe();
    }, []);
    ```
- 這樣可避免 memory leak，並符合現代 JS/TS 訂閱模式。 