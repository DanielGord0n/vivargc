import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');

// Read content
export async function GET() {
    try {
        const content = fs.readFileSync(CONTENT_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

// Write content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        fs.writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}
