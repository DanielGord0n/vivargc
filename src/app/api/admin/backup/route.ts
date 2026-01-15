import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src/data/content.json');
const BACKUP_PATH = path.join(process.cwd(), 'src/data/content.backup.json');

// Create backup before saving
export async function POST() {
    try {
        // Copy current content to backup
        if (fs.existsSync(CONTENT_PATH)) {
            const content = fs.readFileSync(CONTENT_PATH, 'utf-8');
            fs.writeFileSync(BACKUP_PATH, content);
        }
        return NextResponse.json({ success: true, message: 'Backup created' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }
}

// Restore from backup (undo)
export async function PUT() {
    try {
        if (!fs.existsSync(BACKUP_PATH)) {
            return NextResponse.json({ error: 'No backup available' }, { status: 404 });
        }

        const backup = fs.readFileSync(BACKUP_PATH, 'utf-8');
        fs.writeFileSync(CONTENT_PATH, backup);

        return NextResponse.json({ success: true, message: 'Content restored from backup' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
    }
}

// Get backup status
export async function GET() {
    try {
        const hasBackup = fs.existsSync(BACKUP_PATH);
        let backupTime = null;

        if (hasBackup) {
            const stats = fs.statSync(BACKUP_PATH);
            backupTime = stats.mtime.toISOString();
        }

        return NextResponse.json({ hasBackup, backupTime });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check backup status' }, { status: 500 });
    }
}
