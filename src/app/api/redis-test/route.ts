import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const redis = await getRedisClient();

    const key = "studynotion:redis-test";
    const cached = await redis.get(key);

    if (cached) {
      return NextResponse.json({
        success: true,
        redis: "CONNECTED",
        cache: "HIT",
        message: "Data loaded from Redis cache",
        data: JSON.parse(cached),
      });
    }

    const data = {
      website: "StudyNotion",
      database: "Redis",
      purpose: "NoSQL cache",
      createdAt: new Date().toISOString(),
    };

    await redis.set(key, JSON.stringify(data), {
      EX: 60,
    });

    return NextResponse.json({
      success: true,
      redis: "CONNECTED",
      cache: "MISS",
      message: "Data created and saved to Redis",
      data,
    });
  } catch (error) {
    console.error("Redis test error:", error);

    return NextResponse.json(
      {
        success: false,
        redis: "ERROR",
        message: "Cannot connect to Redis",
      },
      { status: 500 }
    );
  }
}
