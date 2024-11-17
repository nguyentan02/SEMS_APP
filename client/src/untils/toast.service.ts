
export const createToastService = (toast) => ({
    success: (detail, summary = "Success", life = 2000) => {
      toast.add({ severity: "success", summary, detail, life });
    },
    info: (detail, summary = "Info", life = 2000) => {
      toast.add({ severity: "info", summary, detail, life });
    },
    warn: (detail, summary = "Warning", life = 2000) => {
      toast.add({ severity: "warn", summary, detail, life });
    },
    error: (detail, summary = "Error", life = 2000) => {
      toast.add({ severity: "error", summary, detail, life });
    },
  });
  