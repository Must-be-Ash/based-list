import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-24 px-4 bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>When you use Based List, we collect information that you provide directly to us:</p>
          <ul>
            <li>Profile information (name, bio, social links)</li>
            <li>Project information you submit</li>
            <li>Authentication data through Clerk</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and maintain your account</li>
            <li>Display your profile to other users</li>
            <li>Send you technical notices and updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent misuse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <Link 
            href="https://x.com/navigate_ai" 
            target="_blank"
            rel="noopener noreferrer" 
            className="text-[#0052FF] hover:text-[#0052FF]/80"
          >
            @navigate_ai
          </Link>
        </section>
      </div>
    </div>
  )
} 