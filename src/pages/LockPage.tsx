import { PageProps } from "./page_props";
import Template from "./Template";

export default function Lock({
  unlockedUntil,
  currentTime,
  pageProps
}: {
  unlockedUntil: number;
  currentTime: number;
  pageProps: PageProps
}) {
  const isLocked = !(unlockedUntil && currentTime <= unlockedUntil);

  return (
    <Template pageProps={pageProps}>
      <h1>Lock Clipboard</h1>
      <p>
        The clipboard is currently {isLocked
          ? "locked"
          : `unlocked (${Math.max(
              0,
              Math.ceil((unlockedUntil - currentTime) / 60000)
            )} min left)`}
        .
      </p>
      <form method="post" action="/secure/lock" style={{ marginBottom: 8 }}>
        <input type="hidden" name="unlock" value="false" />
        <button type="submit">Lock now</button>
      </form>

      <form method="post" action="/secure/lock">
        <input type="hidden" name="unlock" value="true" />
        <label>
          Unlock for minutes:
          <input
            type="number"
            name="duration"
            min={1}
            defaultValue={5}
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>
          Unlock
        </button>
      </form>
    </Template>
  );
}
