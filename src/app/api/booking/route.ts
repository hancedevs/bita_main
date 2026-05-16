import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      serviceType,
      origin,
      destination,
      weight,
      price,
      sender,
      recipient,
      packageDetails,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!serviceType || !origin || !destination || !weight || !price) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    if (!sender?.fullName || !sender?.phone || !sender?.email) {
      return NextResponse.json(
        { error: "Missing sender information" },
        { status: 400 }
      );
    }

    if (!recipient?.fullName || !recipient?.phone || !recipient?.email) {
      return NextResponse.json(
        { error: "Missing recipient information" },
        { status: 400 }
      );
    }

    if (!packageDetails?.contentCategory) {
      return NextResponse.json(
        { error: "Missing package details" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Missing payment method" },
        { status: 400 }
      );
    }

    // Generate a booking reference
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingRef = `BITA-${timestamp}-${random}`;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would save this to a database
    // For now, just return the booking reference
    return NextResponse.json({
      success: true,
      bookingRef,
      details: {
        serviceType,
        origin,
        destination,
        weight,
        price,
        sender: {
          fullName: sender.fullName,
          email: sender.email,
        },
        recipient: {
          fullName: recipient.fullName,
          email: recipient.email,
        },
        packageDetails: {
          contentCategory: packageDetails.contentCategory,
          declaredValue: packageDetails.declaredValue,
          fragile: packageDetails.fragile || false,
        },
        paymentMethod,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
