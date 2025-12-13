"use client";

import { Toaster, Toast } from "@ark-ui/react/toast";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { toaster } from "@/lib/toast";

export default function ToastProvider() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root 
            className={`bg-white rounded-lg shadow-lg border min-w-80 p-4 relative transition-all duration-300 ease-in-out ${
              toast.type === 'success' ? 'border-green-200' :
              toast.type === 'error' ? 'border-red-200' :
              toast.type === 'warning' ? 'border-yellow-200' :
              'border-blue-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <Toast.Title className={`font-semibold text-sm ${
                  toast.type === 'success' ? 'text-green-900' :
                  toast.type === 'error' ? 'text-red-900' :
                  toast.type === 'warning' ? 'text-yellow-900' :
                  'text-slate-900'
                }`}>
                  {toast.title}
                </Toast.Title>
                {toast.description && (
                  <Toast.Description className="text-slate-600 text-sm mt-1">
                    {toast.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.CloseTrigger className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </Toast.CloseTrigger>
            </div>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  );
}

