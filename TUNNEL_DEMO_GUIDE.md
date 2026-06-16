# GreenWings Temporary Demo Link

Use this when you want a non-technical person to test the website before real deployment.

## Important

This is only a temporary demo link from your laptop.

- Your laptop must stay on.
- Both terminal windows must stay open.
- The link stops working when you stop Cloudflare Tunnel.
- Do not share admin credentials during a public demo.

## Project Folder

Always run commands from the `greenwings-react` project folder, the folder that contains `package.json`.

If you run `npm run dev` from Downloads, it fails because Downloads does not contain `package.json`.

## Terminal 1: Start Website And API

Open Command Prompt or PowerShell in the project folder and run:

```powershell
START_DEV_SERVER.cmd
```

This starts:

- Backend API on `http://127.0.0.1:8787`
- Vite frontend on `http://127.0.0.1:5173`

Keep this terminal open.

## Terminal 2: Start Cloudflare Tunnel

Open a second Command Prompt or PowerShell in the project folder and run:

```powershell
START_TUNNEL_DEMO.cmd
```

Copy the generated URL that looks like:

```text
https://something.trycloudflare.com
```

Share that URL with the tester.

Keep this terminal open.

## If Cloudflared Is Not Found

Download `cloudflared-windows-amd64.exe`, then put it in one of these places:

- This project folder
- `C:\Users\Vishal\Downloads`
- Any folder added to Windows PATH

Then run:

```powershell
START_TUNNEL_DEMO.cmd
```

## Error Meanings

| Error | Cause | Fix |
| --- | --- | --- |
| `cloudflared-windows-amd64.exe is not recognized` | Terminal is not in the folder containing the exe | Use `START_TUNNEL_DEMO.cmd` from the project folder or put the exe in Downloads |
| `Blocked request. This host is not allowed` | Vite blocked the Cloudflare hostname | Fixed in `vite.config.ts` with `allowedHosts: true`; restart Vite |
| `npm ERR! enoent package.json` | You ran npm from the wrong folder | Run commands from the project folder |
| Site opens but API data is missing | Backend API is not running | Start `START_DEV_SERVER.cmd` first |

## Test Checklist

- Local site opens at `http://127.0.0.1:5173`
- Backend health opens at `http://127.0.0.1:8787/api/health`
- Cloudflare tunnel gives an `https://*.trycloudflare.com` URL
- Shared URL opens on mobile data or another computer
- Products page loads
- Live database catalogue loads
- Language switcher works
- Do not test admin login with public viewers
