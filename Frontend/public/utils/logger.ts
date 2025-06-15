// class Logger {
//     private enabled: boolean = true;
    
//     constructor() {
//         this.loadConfig();
//     }

//     private async loadConfig(): Promise<void> {
//         try {
//             const response = await fetch('/request/config/logger');
//             if (response.ok) {
//                 const config = await response.json();
//                 this.enabled = config.LOG_ACTIVE !== false;
//             }
//         } catch {
//             // Utiliser la valeur par défaut si erreur
//         }
//     }

//     info(message: string, context?: any): void {
//         if (this.enabled) {
//             const msg = context ? `${message} ${JSON.stringify(context)}` : message;
//             console.info(`ℹ️ ${msg}`);
//         }
//     }

//     error(message: string, context?: any): void {
//         const msg = context ? `${message} ${JSON.stringify(context)}` : message;
//         console.error(`${msg}`);
//     }
// }

// export const log = new Logger();
// export default log;