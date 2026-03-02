import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_landing/privacy-policy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
	<h1 className="font-heading mb-4 text-4xl font-bold text-foreground">Privacy Policy</h1>
	<p className="mb-8 text-muted-foreground">Last updated: January 1, 2025</p>

	<div className="prose prose-lg max-w-none">
		<div className="space-y-8 leading-relaxed text-muted-foreground">
			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">1. Introduction</h2>
				<p>
					Foreum ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
					explains how we collect, use, disclose, and safeguard your information when you use our
					forum platform service.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					2. Information We Collect
				</h2>

				<h3 className="font-heading mt-6 mb-3 text-xl font-semibold text-foreground">
					Information You Provide
				</h3>
				<ul className="list-disc space-y-2 pl-6">
					<li>Account information (name, email, username, password)</li>
					<li>Profile information (avatar, bio, preferences)</li>
					<li>Content you post (threads, replies, comments)</li>
					<li>Communications with us (support requests, feedback)</li>
					<li>Payment information (processed by third-party providers)</li>
				</ul>

				<h3 className="font-heading mt-6 mb-3 text-xl font-semibold text-foreground">
					Automatically Collected Information
				</h3>
				<ul className="list-disc space-y-2 pl-6">
					<li>Device information (IP address, browser type, operating system)</li>
					<li>Usage data (pages visited, features used, time spent)</li>
					<li>Cookies and similar tracking technologies</li>
					<li>Log data (access times, error logs)</li>
				</ul>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					3. How We Use Your Information
				</h2>
				<p className="mb-4">We use your information to:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>Provide, maintain, and improve our Service</li>
					<li>Process transactions and send related information</li>
					<li>Send administrative information and updates</li>
					<li>Respond to your comments and questions</li>
					<li>Monitor and analyze usage and trends</li>
					<li>Detect, prevent, and address technical issues</li>
					<li>Personalize your experience</li>
					<li>Send marketing communications (with your consent)</li>
				</ul>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					4. Information Sharing
				</h2>
				<p className="mb-4">We may share your information with:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li>
						<strong>Service Providers:</strong> Third parties who perform services on our behalf
					</li>
					<li>
						<strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales
					</li>
					<li>
						<strong>Legal Requirements:</strong> When required by law or to protect our rights
					</li>
					<li>
						<strong>With Your Consent:</strong> When you explicitly agree to share information
					</li>
				</ul>
				<p className="mt-4">We do not sell your personal information to third parties.</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">5. Data Security</h2>
				<p>
					We implement appropriate technical and organizational measures to protect your information
					against unauthorized access, alteration, disclosure, or destruction. However, no method of
					transmission over the Internet is 100% secure.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">6. Data Retention</h2>
				<p>
					We retain your information for as long as necessary to provide the Service and fulfill the
					purposes outlined in this Privacy Policy. When you delete your account, we will delete or
					anonymize your information, except where we are required to retain it by law.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">7. Your Rights</h2>
				<p className="mb-4">Depending on your location, you may have the following rights:</p>
				<ul className="list-disc space-y-2 pl-6">
					<li><strong>Access:</strong> Request access to your personal information</li>
					<li><strong>Correction:</strong> Request correction of inaccurate information</li>
					<li><strong>Deletion:</strong> Request deletion of your information</li>
					<li><strong>Portability:</strong> Request a copy of your information</li>
					<li><strong>Objection:</strong> Object to processing of your information</li>
					<li><strong>Restriction:</strong> Request restriction of processing</li>
					<li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
				</ul>
				<p className="mt-4">To exercise these rights, please contact us at privacy@foreum.com.</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">8. Cookies</h2>
				<p>
					We use cookies and similar tracking technologies to track activity on our Service. You can
					instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
					See our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a> for more
					information.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					9. Children's Privacy
				</h2>
				<p>
					Our Service is not intended for children under 13 years of age. We do not knowingly
					collect personal information from children under 13. If you become aware that a child has
					provided us with personal information, please contact us.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					10. International Data Transfers
				</h2>
				<p>
					Your information may be transferred to and maintained on servers located outside of your
					jurisdiction. We take appropriate safeguards to ensure your information receives adequate
					protection.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">
					11. Changes to This Policy
				</h2>
				<p>
					We may update this Privacy Policy from time to time. We will notify you of any changes by
					posting the new Privacy Policy on this page and updating the "Last updated" date.
				</p>
			</section>

			<section>
				<h2 className="font-heading mb-4 text-2xl font-semibold text-foreground">12. Contact Us</h2>
				<p>If you have questions about this Privacy Policy, please contact us at:</p>
				<ul className="mt-4 list-none space-y-2 pl-0">
					<li>Email: privacy@foreum.com</li>
					<li>Address: [Your Company Address]</li>
				</ul>
			</section>
		</div>
	</div>
</div>

  )
}
