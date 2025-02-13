import { Alert, AlertColor, Snackbar } from "@mui/material";
import { createContext, useState, ReactNode } from "react"

type setAlertType = (message: string, severity?: AlertColor) => void;

export const AlertContext = createContext<{ pushAlert: setAlertType } | null>(null);

const AlertSystem = ({ children }: { children?: ReactNode }) => {
  const [alert, setAlert] = useState<{ message: string, severity: AlertColor, show: boolean }>({
    message: '',
    severity: 'info',
    show: false
  });
  const pushAlert: setAlertType = (message, severity = "info") => {
    setAlert({
      message,
      severity,
      show: true
    })
  }

  const handleClose = () => {
    setAlert(prev => ({ ...prev, show: false }));
  }

  return (
    <AlertContext.Provider value={{ pushAlert }}>
      {children}
      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>

  )
}

export default AlertSystem