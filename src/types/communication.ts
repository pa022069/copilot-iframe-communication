export interface BaseMessage {
  timestamp: number;
  version: string;
}

export interface ActionPayloadMessage extends BaseMessage {
  action: string;
  payload: any;
  requestId?: string;
}

export interface EventMessage extends BaseMessage {
  eventName: string;
  data: any;
}

export interface ResponseMessage extends BaseMessage {
  requestId: string;
  status: 'SUCCESS' | 'ERROR';
  payload?: any;
  error?: string;
}

export enum CopilotAction {
  // 父視窗發送給 Copilot 的行為
  INIT = 'INIT',
  UPDATE_CONFIG = 'UPDATE_CONFIG',
  REQUEST_DATA = 'REQUEST_DATA',
  
  // Copilot 發送給父視窗的行為
  UPDATE_UI = 'UPDATE_UI',
  SAVE_DATA = 'SAVE_DATA',
  REQUEST_PERMISSION = 'REQUEST_PERMISSION'
}

export enum CopilotEvent {
  // 父視窗發送給 Copilot 的事件
  CONFIG_CHANGED = 'CONFIG_CHANGED',
  USER_ACTION = 'USER_ACTION',
  
  // Copilot 發送給父視窗的事件
  DATA_CHANGED = 'DATA_CHANGED',
  STATE_UPDATED = 'STATE_UPDATED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  SAVE_RESPONSE = 'SAVE_RESPONSE'
} 