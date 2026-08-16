export function assertEmailFromConversation(email: string, conversationEmails: Set<string>) {
  if (!conversationEmails || !conversationEmails.has(email.toLowerCase())) {
    throw new Error(
      "Refusing Phase 2 tool call: email was not explicitly provided by the user in this conversation."
    );
  }
}
