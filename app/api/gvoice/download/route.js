import { NextResponse } from 'next/server';

const API_KEY = process.env.GVOICE_API_KEY;

/**
 * Proxy route to download files from GVoice Cloud.
 * GVoice requires authentication to access uploaded files directly,
 * so we proxy the request with the API key to serve the file to the user.
 *
 * Usage: /api/gvoice/download?url=<encoded_gvoice_url>
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json({ status: false, message: 'Missing url parameter' }, { status: 400 });
    }

    let cleanUrl = fileUrl;
    if (cleanUrl.startsWith('//')) {
      cleanUrl = 'https:' + cleanUrl;
    } else if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // Only allow proxying from cloud.gvoice.app for security
    if (!cleanUrl.startsWith('https://cloud.gvoice.app/') && !cleanUrl.startsWith('http://cloud.gvoice.app/')) {
      return NextResponse.json({ status: false, message: 'Invalid file URL domain' }, { status: 403 });
    }

    // Append API key as query parameter for authentication
    const separator = cleanUrl.includes('?') ? '&' : '?';
    const authenticatedUrl = `${cleanUrl}${separator}api_key=${API_KEY}`;

    const response = await fetch(authenticatedUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      // If auth via query param didn't work, try with header
      const retryResponse = await fetch(cleanUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-Api-Key': API_KEY,
        },
        cache: 'no-store',
      });

      if (!retryResponse.ok) {
        return NextResponse.json(
          { status: false, message: `Failed to fetch file: ${retryResponse.status}` },
          { status: retryResponse.status }
        );
      }

      return buildFileResponse(retryResponse, cleanUrl);
    }

    // Check if we got redirected to the portal (HTML response instead of a file)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      // GVoice returned the portal page, try fetching raw file directly
      const rawResponse = await fetch(cleanUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'X-Api-Key': API_KEY,
        },
        cache: 'no-store',
      });
      return buildFileResponse(rawResponse, cleanUrl);
    }

    return buildFileResponse(response, cleanUrl);
  } catch (error) {
    console.error('GVoice Download Proxy Error:', error);
    return NextResponse.json(
      { status: false, message: 'Server error during file download' },
      { status: 500 }
    );
  }
}

function buildFileResponse(response, fileUrl) {
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1).split('?')[0] || 'download';

  // Determine if we should display inline or download
  const inlineTypes = [
    'application/pdf',
    'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
    'text/plain', 'text/html',
  ];
  const disposition = inlineTypes.some(t => contentType.includes(t))
    ? `inline; filename="${fileName}"`
    : `attachment; filename="${fileName}"`;

  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
