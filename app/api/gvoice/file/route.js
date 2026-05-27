import { NextResponse } from 'next/server';

const API_KEY = process.env.GVOICE_API_KEY;
const BASE_URL = process.env.GVOICE_API_BASE_URL || 'https://cloud.gvoice.app/api/';

export async function POST(request) {
  try {
    const incomingFormData = await request.formData();
    const file = incomingFormData.get('file');

    if (!file) {
      return NextResponse.json({ status: false, message: 'Missing file' }, { status: 400 });
    }

    const fileName = file.name || 'file';
    const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'].includes(fileExt) || file.type?.startsWith('image/');

    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('reduce_size', 'true');

    let endpoint = 'upload-file.php';
    if (isImage) {
      formData.append('image', file);
      endpoint = 'upload-image.php';
    } else {
      formData.append('file', file);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ status: false, message: 'Server error during upload' }, { status: 500 });
  }
}
