import { createToaster } from "@ark-ui/react/toast";

export const toaster = createToaster({
  placement: "bottom-end",
  gap: 16,
  overlap: true,
});

export function showToast(
  title: string,
  description?: string,
  type: "success" | "error" | "info" | "warning" = "info"
) {
  toaster.create({
    title,
    description,
    type,
  });
}

