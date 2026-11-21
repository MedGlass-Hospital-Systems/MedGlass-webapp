export type NotificationType = "mail" | "poste" | "planning" | "souhaits" | "demande";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link: string | null;
}

export type NotificationChannel = "app" | "email";
export type NotificationPrefs = Record<NotificationType, Record<NotificationChannel, boolean>>;
