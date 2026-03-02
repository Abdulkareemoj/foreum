import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'


export const Route = createFileRoute('/_landing/pricing')({
  component: PricingPage,
})

function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small communities and personal projects',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 1,000 members',
        '5 GB storage',
        'Basic moderation tools',
        'Email support',
        'Custom branding',
        'Mobile responsive',
        'Basic analytics',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For growing communities with advanced needs',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Up to 10,000 members',
        '50 GB storage',
        'Advanced moderation & AI filters',
        'Priority support',
        'Custom domain',
        'Advanced analytics',
        'API access',
        'SSO integration',
        'Custom themes',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom requirements',
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        'Unlimited members',
        'Unlimited storage',
        'Enterprise moderation suite',
        'Dedicated support manager',
        'Custom integrations',
        'Advanced security & compliance',
        'SLA guarantee',
        'White-label solution',
        'Custom development',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))
  }

  return (
    
      <>
      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-heading mb-6 text-5xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Choose the perfect plan for your community. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-muted-foreground ${
                billingCycle === 'monthly' ? 'text-foreground' : ''
              }`}
            >
              Monthly
            </span>
            <button
              onClick={toggleBillingCycle}
              className={`relative h-7 w-14 rounded-full bg-muted transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary' : ''
              }`}
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-background transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : ''
                }`}
              />
            </button>
            <span
              className={`text-muted-foreground ${
                billingCycle === 'yearly' ? 'text-foreground' : ''
              }`}
            >
              Yearly <span className="font-medium text-primary">(Save 17%)</span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border bg-card transition-all ${
                  plan.popular
                    ? 'border-primary shadow-xl'
                    : 'border-border shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="rounded-t-xl bg-primary py-2 text-center font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="font-heading mb-2 text-2xl font-bold text-card-foreground">
                    {plan.name}
                  </h3>
                  <p className="mb-6 text-muted-foreground">{plan.description}</p>

                  <div className="mb-6">
                    {plan.monthlyPrice ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          $
                          {billingCycle === 'monthly'
                            ? plan.monthlyPrice
                            : plan.yearlyPrice}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-foreground">Custom</div>
                    )}
                  </div>

                  <button
                    className={`mb-6 w-full rounded-lg py-3 font-medium transition-colors ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border text-foreground hover:bg-muted'
                    }`}
                    aria-label={plan.cta}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading mb-12 text-center text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                Can I change plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                immediately, and we'll prorate the difference.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and can arrange invoicing for
                Enterprise customers.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                Is there a free trial?
              </h3>
              <p className="text-muted-foreground">
                Yes! All plans include a 14-day free trial with full access to features. No
                credit card required to start.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                What happens if I exceed my member limit?
              </h3>
              <p className="text-muted-foreground">
                We'll notify you when you're approaching your limit. You can upgrade to a
                higher tier or we'll work with you on a custom solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading mb-6 text-4xl font-bold text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-primary-foreground/80">
            Start your 14-day free trial today. No credit card required.
          </p>
          <button
            className="rounded-lg bg-background px-8 py-4 text-lg font-medium text-foreground shadow-lg transition-colors hover:bg-muted"
            aria-label="Start Free Trial"
          >
            Start Free Trial
          </button>
        </div>
      </section>
    </>
    
  )
}

