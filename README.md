# Copilot Communication Service

A communication service for handling messages between parent window and Copilot (iframe), with full TypeScript support.

## Installation

```bash
npm install copilot-communication-service
# or
yarn add copilot-communication-service
```

## Usage

### Parent Window (Vanilla JS/TS)

```typescript
import { CopilotService } from 'copilot-communication-service';

const iframe = document.getElementById('childFrame') as HTMLIFrameElement;
const parentBridge = new CopilotService(iframe.contentWindow!, '*');

// Listen for messages from child
parentBridge.subscribe('child-to-parent', (data) => {
  console.log('Received from child:', data.message);
});

// Send message to child
parentBridge.emit('parent-to-child', { message: 'Hello from parent!' });
```

### Child Window (iframe)

```typescript
import { CopilotService } from 'copilot-communication-service';

const childBridge = new CopilotService(window.parent, '*');

// Listen for messages from parent
childBridge.subscribe('parent-to-child', (data) => {
  console.log('Received from parent:', data.message);
});

// Send message to parent
childBridge.emit('child-to-parent', { message: 'Hello from child!' });
```

---

## React/Vite Playground Example

你可以在 `playground/` 目錄下找到完整的 React + Vite 父子頁面訊息互傳範例。

- `playground/parent.html`：父頁面，載入 React 父元件與 iframe
- `playground/child.html`：子頁面，載入 React 子元件
- `playground/ParentApp.tsx`、`ChildApp.tsx`：React component 實作

啟動方式：
```bash
yarn dev
# or
npm run dev
```
然後瀏覽 http://localhost:5173/playground/parent.html

---

## API

### `CopilotService`

#### 建構子
```typescript
new CopilotService(targetWindow: Window, targetOrigin?: string)
```
- `targetWindow`：要傳遞訊息的目標 window（父層用 iframe.contentWindow，子層用 window.parent）
- `targetOrigin`：目標 origin，預設為 '*'

#### 方法
- `emit(eventName: string, data: any): void`  
  發送事件到對方 window。
- `subscribe(eventName: string, handler: (data: any) => void): () => void`  
  訂閱事件，回傳取消訂閱函式。
- `post<T>(action: string, payload: any): Promise<T>`  
  發送請求並等待回應（進階用法）。

### 型別支援
- 本套件自帶 TypeScript 型別，無需額外安裝 @types。

### Enum
- `CopilotAction`、`CopilotEvent` 內建常用事件/行為名稱。

---

## Build & Publish

1. 打包（產生 JS 與型別）：
   ```bash
   yarn build
   # or
   npm run build
   ```
2. 發佈到 npm：
   ```bash
   npm publish --access public
   ```

---

## License

MIT 