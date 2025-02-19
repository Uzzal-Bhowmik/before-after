import styles from "./CustomLoader.module.css";

export default function CustomLoader({
  className = "",
  color = "#ffffff",
  variant,
  size = variant === "lg" ? 40 : 24,
  stroke = variant === "lg" ? 4.5 : 3.4,
}) {
  return (
    <div
      className={`${styles.container} ${className}`}
      style={{
        "--uib-color": color,
        "--uib-size": `${size}px`,
        "--uib-stroke": `${stroke}px`,
      }}
    >
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  );
}
