export interface EmailPayload {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  date: string;
  body: string;
  link?: {
    url: string;
    text: string;
  };
  isPhishing: boolean;
  explanation: string;
  isUnread: boolean;
}

export const phishingEmails: EmailPayload[] = [
  {
    id: 1,
    senderName: "IT Support",
    senderEmail: "admin-update@cybersim-it.net",
    subject: "URGENT: Password Expiry Notification",
    date: "10:42 AM",
    body: "Your corporate account password expires in 24 hours. Please click the secure link below to verify your credentials and maintain grid access. Failure to do so will result in immediate termination of network privileges.",
    link: {
      url: "http://cybersim-it-update.net/login",
      text: "Verify Credentials Now"
    },
    isPhishing: true,
    explanation: "The sender domain 'cybersim-it.net' is a typo-squatting attempt (the real domain is cybersim.net). The link uses unencrypted HTTP, and the email creates a false sense of urgency.",
    isUnread: true
  },
  {
    id: 2,
    senderName: "HR Department",
    senderEmail: "hr@cybersim.net",
    subject: "Updated Q3 Holiday Schedule",
    date: "Yesterday",
    body: "Team, please review the updated Q3 holiday schedule attached to our internal portal. Note that the corporate retreat dates have been shifted by one week. Let your managers know if you have any conflicts.",
    link: {
      url: "https://portal.cybersim.net/hr/q3-schedule",
      text: "View Q3 Schedule"
    },
    isPhishing: false,
    explanation: "This is a legitimate email. The sender domain matches the official corporate domain (cybersim.net), the link points to a secure internal HTTPS portal, and the tone is professional without undue urgency.",
    isUnread: true
  },
  {
    id: 3,
    senderName: "Sarah Jenkins (Finance)",
    senderEmail: "s.jenkins.finance@gmail.com",
    subject: "Overdue Invoice #4492",
    date: "Oct 12",
    body: "Hey, I couldn't access my corporate mail so I am sending this from my personal account. We have an overdue invoice from a vendor that needs immediate payment processing today or we will incur a 15% late penalty. Please process it via the external payment gateway linked below.",
    link: {
      url: "https://secure-pay-gateway-external.com/invoice/4492",
      text: "Pay Invoice #4492"
    },
    isPhishing: true,
    explanation: "This is a classic Business Email Compromise (BEC) attempt. Finance employees should never request urgent external payments from a personal Gmail account.",
    isUnread: true
  },
  {
    id: 4,
    senderName: "CyberSim Admin",
    senderEmail: "admin@cybersim.net",
    subject: "Scheduled Server Maintenance",
    date: "Oct 10",
    body: "Please be advised that the primary database servers will undergo scheduled maintenance this Saturday from 0200 to 0400 EST. Brief disruptions in service may occur. No action is required on your part.",
    isPhishing: false,
    explanation: "This is a standard IT notification. It comes from the official domain, requires no action from the user, and doesn't contain any suspicious links or attachments.",
    isUnread: false
  },
  {
    id: 5,
    senderName: "Security Alert",
    senderEmail: "alerts@security-cybersim.com",
    subject: "Unusual Login Attempt Detected",
    date: "Oct 08",
    body: "We detected a login attempt to your CyberSim account from an unrecognized device in Russia. If this was not you, please secure your account immediately by resetting your password via the link below.",
    link: {
      url: "https://cybersim.net.account-secure-reset.com/auth",
      text: "Secure My Account"
    },
    isPhishing: true,
    explanation: "The sender domain is fake. More importantly, the link uses subdomain deception. While it starts with 'cybersim.net', the actual root domain is 'account-secure-reset.com'.",
    isUnread: false
  }
];
