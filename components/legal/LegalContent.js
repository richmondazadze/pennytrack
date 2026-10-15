// Terms and privacy text, shared by the landing page, sign-in and settings.

const TERMS = [
  ["User Account", "You are responsible for maintaining the confidentiality of your account and password. You are also responsible for all activities that occur under your account."],
  ["Google Login", "Our app requires login through Google. By logging in, you allow us to access your basic profile information and email address."],
  ["Usage", "You agree to use PennyTrack only for lawful purposes. You are not permitted to use the app to violate any laws or infringe on the rights of others."],
  ["Data Accuracy", "We strive to provide accurate financial tracking. However, you are responsible for ensuring the accuracy of your data inputs and reviewing your financial data."],
  ["Limitation of Liability", 'PennyTrack is provided on an "as-is" basis. We do not guarantee that the app will meet your requirements or be available uninterrupted or error-free. We are not liable for any losses or damages resulting from the use of the app.'],
  ["Modifications", "We reserve the right to modify these terms at any time. Continued use of the app signifies your acceptance of the updated terms."],
];

const PRIVACY = [
  ["Data Collection", "We collect personal information such as your name and email address when you log in through Google. We also collect data related to your income and expenses as you use the app."],
  ["Data Usage", "We use your data to provide you with accurate financial tracking and insights. We do not sell or share your personal information with third parties, except as required by law."],
  ["Data Security", "We implement security measures to protect your data. However, we cannot guarantee absolute security due to the nature of the internet."],
  ["Data Retention", "We retain your data as long as necessary to provide our services and for legal compliance. You may request deletion of your data at any time by contacting us."],
  ["Cookies", "We use cookies to enhance your experience. You can control cookie settings through your browser."],
  ["Changes to this Policy", "We may update this Privacy Policy from time to time. We will notify you of any significant changes."],
];

export const LEGAL = {
  terms: { title: "Terms of Service", intro: "Welcome to PennyTrack! By using this app, you agree to the following terms:", items: TERMS },
  privacy: { title: "Privacy Policy", intro: "At PennyTrack, we value your privacy. This policy outlines how we handle your data:", items: PRIVACY },
};

export default function LegalContent({ doc }) {
  const { intro, items } = LEGAL[doc];
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-muted">
      <p>{intro}</p>
      <ol className="space-y-4">
        {items.map(([title, body], i) => (
          <li key={title} className="flex gap-3">
            <span className="amount mt-0.5 text-sm font-semibold text-forest-600 dark:text-lime">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="font-semibold text-fg">{title}.</span> {body}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
