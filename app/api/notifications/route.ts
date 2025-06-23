import { NextResponse } from "next/server";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

// In-memory storage for notifications (replace with database in production)
let notifications: any[] = [];

const notificationSchema = z.object({
  type: z.enum(["success", "warning", "info"]),
  title: z.string(),
  message: z.string(),
  transactionId: z.string().optional(),
  beforeState: z.record(z.any()).optional(),
  afterState: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = notificationSchema.parse(body);

    const notification = {
      id: createId(),
      ...validatedData,
      timestamp: new Date().toISOString(),
      read: false,
    };

    notifications.unshift(notification);
    return NextResponse.json({ data: notification });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ data: notifications });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, read } = body;

    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    notification.read = read;
    return NextResponse.json({ data: notification });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      notifications = notifications.filter((n) => n.id !== id);
    } else {
      notifications = [];
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
} 