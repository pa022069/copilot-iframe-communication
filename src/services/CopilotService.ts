import type { ActionPayloadMessage, EventMessage, ResponseMessage } from '../types/communication';

export class CopilotService {
  private targetWindow: Window;
  private targetOrigin: string;
  private messageHandlers: Map<string, (payload: any) => void>;
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
    timeout: ReturnType<typeof setTimeout>;
  }>;

  constructor(targetWindow: Window, targetOrigin: string = '*') {
    this.targetWindow = targetWindow;
    this.targetOrigin = targetOrigin;
    this.messageHandlers = new Map();
    this.pendingRequests = new Map();
    this.initializeMessageListener();
  }

  private initializeMessageListener() {
    window.addEventListener('message', (event) => {
      if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
        return;
      }

      const message = event.data as ActionPayloadMessage | EventMessage | ResponseMessage;
      
      if ('requestId' in message && 'status' in message && this.pendingRequests.has(message.requestId)) {
        const request = this.pendingRequests.get(message.requestId)!;
        clearTimeout(request.timeout);
        this.pendingRequests.delete(message.requestId);
        
        if (message.status === 'SUCCESS') {
          request.resolve(message.payload);
        } else {
          request.reject(new Error(message.error));
        }
        return;
      }

      if ('eventName' in message && this.messageHandlers.has(message.eventName)) {
        const handler = this.messageHandlers.get(message.eventName)!;
        handler(message.data);
      }
    });
  }

  public async post<T>(action: string, payload: any): Promise<T> {
    const requestId = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, 5000);

      this.pendingRequests.set(requestId, { resolve, reject, timeout });

      const message: ActionPayloadMessage = {
        action,
        payload,
        requestId,
        timestamp: Date.now(),
        version: '1.0'
      };

      this.targetWindow.postMessage(message, this.targetOrigin);
    });
  }

  public emit(eventName: string, data: any): void {
    const message: EventMessage = {
      eventName,
      data,
      timestamp: Date.now(),
      version: '1.0'
    };

    this.targetWindow.postMessage(message, this.targetOrigin);
  }

  public subscribe(eventName: string, handler: (data: any) => void): () => void {
    this.messageHandlers.set(eventName, handler);
    return () => this.messageHandlers.delete(eventName);
  }
} 