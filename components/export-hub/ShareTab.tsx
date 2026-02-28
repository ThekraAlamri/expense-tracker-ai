'use client';

import { useState, useMemo } from 'react';
import { Link2, Copy, CheckCheck, QrCode, Mail, Timer, Lock, Zap, Download } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';

type Expiry = '24h' | '7d' | '30d' | 'never';
const EXPIRY_OPTS: { value: Expiry; label: string }[] = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never' },
];

/** Generates a realistic-looking fake QR code SVG with proper finder patterns */
function FakeQRCode({ token }: { token: string }) {
  const size = 21;

  const grid = useMemo<boolean[][]>(() => {
    let h = 0;
    for (const ch of token) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;

    const g: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));

    // Finder pattern (7×7 block) at given origin
    const finder = (or: number, oc: number) => {
      for (let dr = 0; dr < 7; dr++) {
        for (let dc = 0; dc < 7; dc++) {
          const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const onCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          g[or + dr][oc + dc] = onBorder || onCore;
        }
      }
    };

    finder(0, 0);          // top-left
    finder(0, size - 7);   // top-right
    finder(size - 7, 0);   // bottom-left

    // Timing strips
    for (let i = 8; i < size - 8; i++) {
      g[6][i] = i % 2 === 0;
      g[i][6] = i % 2 === 0;
    }

    // Data modules (pseudo-random)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= size - 8;
        const inBottomLeft = r >= size - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;
        if (r === 6 || c === 6) continue;
        const idx = r * size + c;
        const val = (Math.imul(h + idx, 0x9e3779b9) >>> 0) % 2;
        g[r][c] = val === 0;
      }
    }

    return g;
  }, [token]);

  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      className="w-36 h-36"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x={-1} y={-1} width={size + 2} height={size + 2} fill="white" rx={1} />
      {grid.flatMap((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${y}-${x}`} x={x} y={y} width={1} height={1} fill="#111827" /> : null,
        ),
      )}
    </svg>
  );
}

function downloadQR(token: string) {
  const size = 21;
  // Simple SVG text for download
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${size + 2} ${size + 2}" width="300" height="300" style="image-rendering:pixelated"><rect x="-1" y="-1" width="${size + 2}" height="${size + 2}" fill="white"/><text x="2" y="11" font-size="3" fill="#111">QR: expenses/${token.slice(0, 8)}</text></svg>`;
  const url = URL.createObjectURL(new Blob([svgContent], { type: 'image/svg+xml' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `qr-expenses-${token.slice(0, 8)}.svg` });
  a.click();
  URL.revokeObjectURL(url);
}

export default function ShareTab() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState<Expiry>('7d');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [emailShare, setEmailShare] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const shareUrl = linkToken ? `https://expenses.app/share/${linkToken}` : null;

  function generateLink() {
    setLinkToken(generateId());
    setCopied(false);
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleEmailShare() {
    if (!emailShare || !shareUrl) return;
    await new Promise((r) => setTimeout(r, 600));
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Shareable link */}
      <section>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Link2 size={12} /> Shareable Link
        </p>
        <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-4">
          {shareUrl ? (
            <>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <p className="flex-1 text-xs text-gray-700 font-mono truncate">{shareUrl}</p>
                <button
                  onClick={copyLink}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0',
                    copied
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300',
                  )}
                >
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Link settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Timer size={11} className="text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">Expires</p>
                  </div>
                  <select
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value as Expiry)}
                    className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {EXPIRY_OPTS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Lock size={11} className="text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">Password</p>
                  </div>
                  <button
                    onClick={() => setPasswordEnabled((p) => !p)}
                    className={cn(
                      'w-full py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all',
                      passwordEnabled
                        ? 'border-violet-300 bg-violet-50 text-violet-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300',
                    )}
                  >
                    {passwordEnabled ? 'Password set' : 'Add password'}
                  </button>
                </div>
              </div>

              <button
                onClick={generateLink}
                className="text-xs text-violet-600 hover:underline"
              >
                Generate new link
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 mb-3">
                Create a read-only link to share your expense data
              </p>
              <button
                onClick={generateLink}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Zap size={14} />
                Generate Link
              </button>
            </div>
          )}
        </div>
      </section>

      {/* QR code */}
      <section>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <QrCode size={12} /> QR Code
        </p>
        <div className="p-4 rounded-xl border border-gray-100 bg-white">
          {linkToken ? (
            <div className="flex items-center gap-6">
              <div className="rounded-xl border border-gray-200 p-2 bg-white shadow-sm">
                <FakeQRCode token={linkToken} />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-600">
                  Scan to open your shared expense report on any device.
                </p>
                <button
                  onClick={() => downloadQR(linkToken)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 transition-colors"
                >
                  <Download size={12} />
                  Download SVG
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center text-gray-400 py-4">
              Generate a link above to create the QR code
            </p>
          )}
        </div>
      </section>

      {/* Quick share */}
      {shareUrl && (
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Share</p>
          <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-2.5">
            <div className="flex gap-2">
              <input
                type="email"
                value={emailShare}
                onChange={(e) => setEmailShare(e.target.value)}
                placeholder="Send link to email…"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={handleEmailShare}
                disabled={!emailShare || emailSent}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  emailSent
                    ? 'bg-emerald-500 text-white'
                    : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40',
                )}
              >
                <Mail size={13} />
                {emailSent ? 'Sent!' : 'Send'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
