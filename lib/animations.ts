// lib/animations.ts

export const messageVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
};

export const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" }
  })
};

export const drawerVariants = {
  closed: { x: "100%", transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  open:   { x: 0,      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

export const toolThinkingVariants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.15 } }
};

export const payCardVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};
