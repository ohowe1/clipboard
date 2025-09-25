import Template from "./Template";

export default function LockedPage() {
  return (
    <Template>
      <h1>The clipboard is locked</h1>
      <a href="/secure/lock">Unlock Page</a>
    </Template>
  );
}
