import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ComponentType } from 'react';

export interface DialogConfig<T> {
  content: ComponentType<any>;
  props?: T;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

type State = {
  isOpen: boolean;
  currentDialog: DialogConfig<any> | null;
};

type Actions = {
  openDialog: <T = any>(config: DialogConfig<T>) => void;
  closeDialog: () => void;
  updateDialogProps: (props: Record<string, any>) => void;
};

export const useGlobalDialogStore = create<State & Actions>()(
  immer((set) => ({
    isOpen: false,
    currentDialog: null,

    openDialog: <T = any>(config: DialogConfig<T>) => {
      set((state) => {
        state.isOpen = true;
        state.currentDialog = {
          size: 'md',
          showCloseButton: true,
          ...config,
        };
      });
    },

    closeDialog: () => {
      set((state) => {
        state.isOpen = false;
        state.currentDialog = null;
      });
    },

    updateDialogProps: (props: Record<string, any>) => {
      set((state) => {
        if (state.currentDialog) {
          if (!state.currentDialog.props) {
            state.currentDialog.props = {};
          }
          Object.assign(state.currentDialog.props, props);
        }
      });
    },
  }))
);
