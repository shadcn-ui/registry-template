export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEzNTk2LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4ODE3MzE4RDZmRkY2NkExOGQ4M0ExMzc2QTc2RjZlMzBCNDNjODg4OSJ9",
      payload: "eyJkb21haW4iOiJoZWxsbm8tbWluaS1hcHAtdWkudmVyY2VsLmFwcCJ9",
      signature:
        "MHhlODJmNDU5MDc1NTk0Y2I3ZTIyNjk2NDcwN2FlNmE4MDE2MTk2ZWNhYjc1ZDI0MDkyMTMwOGFiNGM1MTI4ZWQ3MDhmZTc1NmQ3YWRlMzNmNjE4MzFkOWZmZmJmNTM3NzJmM2YyYjBmY2E0YjBkOTMzMWZjYzA2NWU0ZDcyNDVjZTFj",
    },
    frame: {
      version: "1",
      name: "hellno/mini-app-ui",
      iconUrl: "https://hellno-mini-app-ui.vercel.app/vibes-icon.png",
      homeUrl: "https://hellno-mini-app-ui.vercel.app",
      imageUrl: `https://hellno-mini-app-ui.vercel.app/opengraph-image`,
      buttonTitle: "Open hellno/mini-app-ui",
      splashImageUrl: "https://hellno-mini-app-ui.vercel.app/vibes-icon.png",
      splashBackgroundColor: "#fff",
      tags: ["mini-app", "dev", "ui"],
      description:
        "A collection of components, hooks and utilities for mini apps",
      ogTitle: "hellno mini-app-ui",
      ogDescription:
        "A collection of components, hooks and utilities for mini apps",
      // webhookUrl: "https://hellno-mini-app-ui.vercel.app/api/webhook",
    },
  };

  return Response.json(config);
}
