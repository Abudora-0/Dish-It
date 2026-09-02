import Link from "next/link";

export function StudioSetupNotice() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        background: "#14100d",
        color: "#f3e9d8",
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <p style={{ fontSize: 13, letterSpacing: "0.2em", opacity: 0.6 }}>
          DISH IT STUDIO
        </p>
        <h1 style={{ fontSize: 30, margin: "0.6rem 0 1rem", fontWeight: 600 }}>
          Connect a Sanity project to edit content
        </h1>
        <p style={{ lineHeight: 1.7, opacity: 0.85 }}>
          The site is running on bundled seed recipes right now, so it works with
          zero configuration. To manage recipes from a dashboard, create a free
          Sanity project and add three environment variables.
        </p>
        <ol style={{ lineHeight: 1.9, opacity: 0.85, paddingLeft: "1.1rem" }}>
          <li>
            Run <code>npx sanity@latest init</code> in the project folder and
            sign in.
          </li>
          <li>
            Copy the project id and dataset it prints into a{" "}
            <code>.env.local</code> file using the keys from{" "}
            <code>.env.example</code>.
          </li>
          <li>
            Import the starter data with{" "}
            <code>npx sanity dataset import content/seed/dishit-seed.ndjson production</code>
            .
          </li>
        </ol>
        <p style={{ marginTop: "1.6rem" }}>
          <Link href="/" style={{ color: "#e8724c" }}>
            Back to Dish It
          </Link>
        </p>
      </div>
    </div>
  );
}
