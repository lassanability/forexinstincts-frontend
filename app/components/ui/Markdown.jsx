import site from "@/app/styles/site.module.css";

const blockOf = (block, index) => {
  if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3)}</h2>;
  if (block.split("\n").every((line) => line.startsWith("- ")))
    return (
      <ul key={index}>
        {block.split("\n").map((line) => (
          <li key={line}>{line.slice(2)}</li>
        ))}
      </ul>
    );
  return <p key={index}>{block}</p>;
};

export default function Markdown({ text }) {
  return <div className={site.prose}>{String(text ?? "").split(/\n{2,}/).map((block, index) => blockOf(block.trim(), index))}</div>;
}
