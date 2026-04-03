import { sileo } from "react-sileo";

export const notify = {
  success: (message, description = "") =>
    sileo.success({
      title: message,
      description,
    }),

  error: (message, description = "") =>
    sileo.error({
      title: message,
      description,
    }),

  info: (message, description = "") =>
    sileo.info({
      title: message,
      description,
    }),

  // Notificación para IA
  ai: (message, description = "") =>
    sileo.action({
      title: message,
      description,
      styles: {
        title: "text-cyan-300 font-bold",
        description: "text-cyan-100/80",
        badge:
          "border border-cyan-500/50 bg-zinc-900 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
      },
    }),
};

export default notify;