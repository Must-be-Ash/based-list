import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-24 px-4 bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Based List, you accept and agree to be bound by the terms and conditions of this agreement.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>Based List is a platform that provides a directory of builders and projects in the Base ecosystem. We reserve the right to modify, suspend, or discontinue the service at any time.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate information</li>
            <li>Maintain the security of your account</li>
            <li>Not misuse the service</li>
            <li>Comply with all applicable laws</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
          <p>Users are responsible for the content they post. Content must not:</p>
          <ul>
            <li>Infringe on intellectual property rights</li>
            <li>Contain malicious code or links</li>
            <li>Include inappropriate or harmful material</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p>Based List is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
          <p>For any questions regarding these terms, please contact us at:</p>
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