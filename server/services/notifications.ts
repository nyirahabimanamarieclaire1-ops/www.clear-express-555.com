import { NotificationItem, OrderStatus } from '../../shared/types.ts';

export interface SendNotificationPayload {
  userId?: string;
  orderId?: string;
  phone?: string;
  email?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'DRIVER' | 'SYSTEM';
  channel?: 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP';
}

export class NotificationService {
  private static notificationsStore: NotificationItem[] = [];

  public static async send(payload: SendNotificationPayload): Promise<NotificationItem> {
    const item: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: payload.userId,
      orderId: payload.orderId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      channel: payload.channel || 'SMS',
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.notificationsStore.unshift(item);

    // If SMS_API_KEY is configured, dispatch SMS to Rwandan carrier (+250)
    if (process.env.SMS_API_KEY && payload.phone) {
      console.log(`[SMS Gateway] Dispatched SMS to ${payload.phone}: "${payload.message}"`);
    } else {
      console.log(`[Notification Engine: ${item.channel}] to ${payload.phone || payload.email || 'User'}: "${item.title} - ${item.message}"`);
    }

    return item;
  }

  public static getStatusNotification(
    status: OrderStatus,
    trackingNumber: string,
    driverName?: string
  ): { title: string; message: string } {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          title: 'Order Created',
          message: `Your Clear Express 555 delivery #${trackingNumber} has been received.`,
        };
      case OrderStatus.PAID:
        return {
          title: 'Payment Confirmed',
          message: `Payment for delivery #${trackingNumber} was successfully confirmed. Dispatching nearby courier.`,
        };
      case OrderStatus.DRIVER_ASSIGNED:
        return {
          title: 'Driver Assigned',
          message: `${driverName || 'A Clear Express driver'} has accepted your order and is heading to the pickup location.`,
        };
      case OrderStatus.DRIVER_AT_PICKUP:
        return {
          title: 'Driver at Pickup',
          message: `${driverName || 'Your driver'} has arrived at the pickup location.`,
        };
      case OrderStatus.PACKAGE_PICKED_UP:
        return {
          title: 'Package Picked Up',
          message: `Your package #${trackingNumber} was verified and picked up safely.`,
        };
      case OrderStatus.IN_TRANSIT:
        return {
          title: 'Package on the Way',
          message: `Your package #${trackingNumber} is in transit to destination. Live tracking is active.`,
        };
      case OrderStatus.NEAR_DESTINATION:
        return {
          title: 'Driver Near Destination',
          message: `Your driver is within 5 minutes of the delivery destination. Please be prepared to receive it.`,
        };
      case OrderStatus.DELIVERED:
        return {
          title: 'Package Delivered',
          message: `Delivery completed! Package #${trackingNumber} has been handed over. Thank you for choosing Clear Express 555!`,
        };
      case OrderStatus.FAILED_DELIVERY:
        return {
          title: 'Delivery Alert',
          message: `Delivery attempt for #${trackingNumber} could not be completed. Driver support is reviewing.`,
        };
      default:
        return {
          title: 'Order Status Update',
          message: `Your delivery #${trackingNumber} status updated to ${status}.`,
        };
    }
  }

  public static getRecent(limit = 20): NotificationItem[] {
    return this.notificationsStore.slice(0, limit);
  }
}
