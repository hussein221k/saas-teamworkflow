export default async function Code() {
  const code = await crypto.randomUUID();
  return code;
}
