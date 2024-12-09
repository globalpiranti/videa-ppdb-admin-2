export const TextType = [
  "email",
  "short_text",
  "password",
  "long_text",
] as const;

export const TextTypeMap: Record<(typeof TextType)[number], string> = {
  email: "Email",
  short_text: "Text Pendek",
  long_text: "Text Panjang",
  password: "Password",
};
