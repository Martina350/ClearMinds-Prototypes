export type SyncPriority = 1 | 2 | 3 | 4 | 5; // 1 alto

export type QueueKind = 'EMERGENCIA' | 'CIERRE_OT' | 'CHECK_IN_OUT' | 'CHECKLIST' | 'FIRMAS_FOTOS';

export interface QueueItem<T = any> {
  id: string;
  kind: QueueKind;
  priority: SyncPriority;
  payload: T;
  createdAt: number;
}

export function priorityFor(kind: QueueKind): SyncPriority {
  switch (kind) {
    case 'EMERGENCIA':
      return 1;
    case 'CIERRE_OT':
      return 2;
    case 'CHECK_IN_OUT':
      return 3;
    case 'CHECKLIST':
      return 4;
    case 'FIRMAS_FOTOS':
      return 5;
  }
}

export class InMemoryQueue {
  private items: QueueItem[] = [];

  enqueue(item: Omit<QueueItem, 'createdAt' | 'priority'>): QueueItem {
    const full: QueueItem = {
      ...item,
      priority: priorityFor(item.kind),
      createdAt: Date.now()
    };
    this.items.push(full);
    this.items.sort((a, b) => a.priority - b.priority || a.createdAt - b.createdAt);
    return full;
  }

  snapshot(): QueueItem[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}


