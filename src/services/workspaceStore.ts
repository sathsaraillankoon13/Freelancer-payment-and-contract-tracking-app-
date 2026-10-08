import type { WorkspaceData } from './storage';
import { createEmptyWorkspaceData } from './storage';

/** Synchronous snapshots let repeated actions see the previous action immediately. */
export class WorkspaceStore {
  private data = createEmptyWorkspaceData();
  private listeners = new Set<() => void>();
  getSnapshot = () => this.data;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  set = (data: WorkspaceData) => {
    if (data === this.data) return;
    this.data = data;
    this.listeners.forEach(listener => listener());
  };
}
