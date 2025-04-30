import { MemoryEntity } from '../db/entities/MemoryEntity';

export enum ModWebsocketMessageType {
  NOTIFICATION = 'notification',
  CLEAR_SIM_CACHE = 'clear_sim_cache',
  MIGRATE_SINGLE_SLOT_SAVE = 'migrate_single_slot_save',
  MEMORY_DELETED = 'MEMORY_DELETED',
  MEMORY_EDITED = 'MEMORY_EDITED',
  MEMORY_CREATED = 'MEMORY_CREATED',
  GLOBAL_MEMORY_CREATED = 'GLOBAL_MEMORY_CREATED',
  GLOBAL_MEMORY_DELETED = 'GLOBAL_MEMORY_DELETED',
  GLOBAL_MEMORY_EDITED = 'GLOBAL_MEMORY_EDITED',
}

export type ModWebsocketMessage = {
  type: ModWebsocketMessageType;
};

export enum ModWebsocketNotificationType {
  ERROR = 'error',
  MESSAGE = 'message',
}

export type ModWebsocketNotification = ModWebsocketMessage & {
  notification: {
    title: string;
    message: string;
    message_type: ModWebsocketNotificationType;
  };
};

export type ModWebsocketNotificationMemoryDeleted = ModWebsocketMessage & {
  memory_id: number;
};

export type ModWebsocketNotificationMemoryEdited = ModWebsocketMessage & {
  memory: MemoryEntity;
};

export type WebsocketNotification =
  | ModWebsocketMessage
  | ModWebsocketNotification
  | ModWebsocketNotificationMemoryEdited
  | ModWebsocketNotificationMemoryDeleted;
