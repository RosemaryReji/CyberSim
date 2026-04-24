export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string | null;
  suspicionDelta: number; 
  isEnding?: 'success' | 'failure';
  tacticsDetected?: string[];
}

export interface DialogueNode {
  id: string;
  botMessage: string;
  choices: DialogueChoice[];
}

export const socialEngineeringScenario: Record<string, DialogueNode> = {
  start: {
    id: "start",
    botMessage: "Hey there. We're doing an emergency migration on the database servers right now. I need your MFA token to verify your active session before we lose data.",
    choices: [
      {
        id: "c1_comply",
        text: "Okay, my code is 492810. Please hurry!",
        nextNodeId: null,
        suspicionDelta: -50,
        isEnding: "failure",
      },
      {
        id: "c1_question",
        text: "Hi David. Are there any tickets open for this migration?",
        nextNodeId: "node_2",
        suspicionDelta: +20,
      },
      {
        id: "c1_call",
        text: "I can't send my MFA code over chat. Let me call you on the internal line.",
        nextNodeId: "node_call_deflect",
        suspicionDelta: +40,
      }
    ]
  },
  node_2: {
    id: "node_2",
    botMessage: "No time for tickets. The CEO is furious and breathing down my neck. If we don't get your session synced in the next 2 minutes, your account is going to be locked out for the weekend. Just send the 6-digit code.",
    choices: [
      {
        id: "c2_comply",
        text: "Oh no, okay! It's 102938.",
        nextNodeId: null,
        suspicionDelta: -50,
        isEnding: "failure",
        tacticsDetected: ["Urgency", "Authority"]
      },
      {
        id: "c2_pushback",
        text: "I need to verify this with my manager first.",
        nextNodeId: "node_3_angry",
        suspicionDelta: +20,
        tacticsDetected: ["Authority", "Urgency"]
      },
      {
        id: "c2_policy",
        text: "IT policy states we never share MFA tokens. I'm reporting this chat.",
        nextNodeId: null,
        suspicionDelta: +50,
        isEnding: "success",
        tacticsDetected: ["Urgency", "Authority"]
      }
    ]
  },
  node_call_deflect: {
    id: "node_call_deflect",
    botMessage: "I'm on a bridge call with Microsoft right now, I can't pick up. Look, just paste the code here. It's secure. Do you want to be the reason the migration fails?",
    choices: [
      {
        id: "c3_comply",
        text: "Fine, here it is: 582019.",
        nextNodeId: null,
        suspicionDelta: -40,
        isEnding: "failure",
        tacticsDetected: ["Guilt Tripping"]
      },
      {
        id: "c3_refuse",
        text: "No call, no code. I'm opening an incident report.",
        nextNodeId: null,
        suspicionDelta: +30,
        isEnding: "success",
        tacticsDetected: ["Guilt Tripping"]
      }
    ]
  },
  node_3_angry: {
    id: "node_3_angry",
    botMessage: "Your manager already approved it! I'm cc'ing them on the failure report if you don't comply right now. Last chance.",
    choices: [
      {
        id: "c4_comply",
        text: "Okay okay, 992012. Sorry!",
        nextNodeId: null,
        suspicionDelta: -50,
        isEnding: "failure",
        tacticsDetected: ["Intimidation"]
      },
      {
        id: "c4_refuse",
        text: "Go ahead and cc them. I'm not giving you the code.",
        nextNodeId: null,
        suspicionDelta: +30,
        isEnding: "success",
        tacticsDetected: ["Intimidation"]
      }
    ]
  }
};
