import Link from "next/link";
import styles from "./not-found.module.css";

const messages = [
  { class: "m1", text: "404 Status" }, // 3, 6
  { class: "m2", text: "Warning this sector empty" }, // 7, 4, 6, 5
  { class: "m3", text: "Nothing here is any accessible route" }, // 7, 4, 2, 3, 10, 5
  { class: "m4", text: "Wait what should we even display" }, // 4, 4, 6, 2, 4, 7
  { class: "m5", text: "But it does no use anyway" }, // 3, 2, 4, 2, 3, 6
  { class: "m6", text: "I think I should render this message" }, // 1, 5, 1, 6, 6, 4, 7
  { class: "m7", text: "Hello" }, // 5
  { class: "m8", text: "Well nobody is here today" }, // 4, 6, 2, 4, 5
  { class: "m9", text: "You might try home route !" }, // 3, 5, 3, 4, 5, 1
];

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={`${styles.grid} ${styles["gr-1"]}`}></div>
      <div className={`${styles.grid} ${styles["gr-2"]}`}></div>
      <div className={`${styles.grid} ${styles["gr-3"]}`}></div>
      <div className={`${styles.grid} ${styles["gr-4"]}`}></div>

      <div className={styles["not-found-message"]}>
        <div className={styles.text}>404 - Not Found</div>
      </div>

      <div className={styles.light}>
        <div className={styles.blocker}></div>
        <div className={styles.blocker}></div>
      </div>

      <div className={styles.messages}>
        {messages.map((m, mIdx) => (
          <div key={mIdx} className={`${styles.message} ${styles[m.class]}`}>
            {m.text.split(" ").map((word, wIdx, arr) => (
              <span key={wIdx} className={styles.word}>
                {word.split("").map((letter, lIdx) => (
                  <span key={lIdx} className={styles.letter}>
                    {letter}
                  </span>
                ))}
                {wIdx < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
        ))}
      </div>

      <Link href="/" className={styles["go-home"]}>
        <div className={`${styles.glow} ${styles.g1}`}></div>
        <div className={`${styles.glow} ${styles.g2}`}></div>
        <div className={`${styles.glow} ${styles.g3}`}></div>
        <div className={`${styles.glow} ${styles.g4}`}></div>
        <div className={styles.text}>Return to Grid</div>
      </Link>
    </div>
  );
}
